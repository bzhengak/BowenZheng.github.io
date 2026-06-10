import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 侧边栏内的 3D 星空粒子
 * - 自定义 ShaderMaterial: 中心实心 + 边缘高斯衰减的圆形 sprite
 * - 每个粒子有独立 phase, size 和 opacity 在 0.5×~1.5× 之间慢速呼吸 (twinkle)
 * - 距离相机越远: size 越小, 亮度越低 (深度视差 + 层次感)
 * - 主题色根据 dark/light 切换
 */

// 星空专用的 vertex shader
const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aDepth;
  attribute vec3 color;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vDepth;
  varying float vTwinkle;
  varying vec3 vColor;

  void main() {
    float t = uTime * 0.6 + aPhase * 6.2831;
    float tw = 0.5 + 0.5 * sin(t);
    float twinkle = mix(0.6, 1.4, tw);

    vDepth = aDepth;
    vTwinkle = twinkle;
    vColor = color;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    float distAtten = 1.0 / -mvPosition.z;
    float depthScale = mix(1.0, 0.35, aDepth);

    gl_PointSize = aSize * twinkle * distAtten * uPixelRatio * depthScale * 60.0;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// 星空专用的 fragment shader: 中心实心 + 高斯衰减光晕
const starFragment = /* glsl */ `
  uniform float uBrightness;
  varying float vDepth;
  varying float vTwinkle;
  varying vec3 vColor;

  void main() {
    // gl_PointCoord 是 0~1 的方格坐标, 中心 (0.5, 0.5)
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);

    // 中心实心核 (很小的硬核)
    float core = smoothstep(0.18, 0.0, dist);

    // 高斯光晕 (大范围柔光)
    float halo = exp(-dist * dist * 18.0);

    // 合并: 核 + 光晕
    float alpha = (core * 0.9 + halo * 0.55) * uBrightness * vTwinkle;

    // 远处粒子整体更暗
    alpha *= mix(1.0, 0.35, vDepth);

    if (alpha < 0.01) discard;

    // 中心更白, 边缘是颜色 (模拟恒星色温)
    vec3 finalColor = mix(vColor, vec3(1.0), core * 0.6);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface StarCloudProps {
  count?: number;
  isDark: boolean;
  mouseParallax: React.MutableRefObject<{ x: number; y: number }>;
}

function StarCloud({ count = 600, isDark, mouseParallax }: StarCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { camera, size, gl } = useThree();
  const pixelRatio = Math.min(gl.getPixelRatio(), 2);

  // 生成球壳分布的粒子
  const { positions, colors, sizes, phases, depths } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const ph = new Float32Array(count);
    const dp = new Float32Array(count);

    // 暗色: 暗色为主 6 色 + 亮色 4 色 (更克制)
    const palette = isDark
      ? [
          // 暗色 (主) - 60%
          [0.55, 0.60, 0.85],  // 暗蓝紫
          [0.45, 0.55, 0.90],  // 暗蓝
          [0.40, 0.65, 0.95],  // 冷蓝
          [0.50, 0.70, 0.88],  // 天蓝
          [0.55, 0.72, 0.92],  // 浅蓝
          [0.60, 0.75, 0.85],  // 银蓝
          // 亮色 (点缀) - 40%
          [0.85, 0.90, 1.00],  // 亮银白
          [0.90, 0.95, 1.00],  // 冷白
          [0.80, 0.88, 1.00],  // 亮蓝
          [0.95, 0.98, 1.00],  // 纯白
        ]
      : [
          // 亮色: 4 色 (克制)
          [0.55, 0.65, 0.95],
          [0.95, 0.70, 0.80],
          [0.70, 0.85, 1.00],
          [0.95, 0.85, 0.65],
        ];

    for (let i = 0; i < count; i++) {
      // 球壳分布, 半径紧凑使星点更密集
      const radius = 1.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // 3 级 size: 大星 5% / 中星 25% / 小星 70%
      const rand = Math.random();
      if (rand < 0.25) {
        siz[i] = 0.35 + Math.random() * 0.2;  // 大星: 0.14~0.24
      } else if (rand < 0.50) {
        siz[i] = 0.18 + Math.random() * 0.1;  // 中星: 0.06~0.12
      } else {
        siz[i] = 0.08 + Math.random() * 0.08; // 小星: 0.018~0.053
      }

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3 + 0] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];

      // 每个粒子独立相位 (twinkle)
      ph[i] = Math.random();

      // 深度: 归一化 (0=近, 1=远), 基于 z 坐标
      dp[i] = Math.max(0, Math.min(1, (pos[i * 3 + 2] + 1.6) / 3.0));
    }
    return { positions: pos, colors: col, sizes: siz, phases: ph, depths: dp };
  }, [count, isDark]);

  // shader uniform: 整体亮度
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uBrightness: { value: isDark ? 1.0 : 0.75 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [isDark, pixelRatio]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
    // 相机视差
    const targetX = mouseParallax.current.x * 0.4;
    const targetY = mouseParallax.current.y * 0.3;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (-targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
        />
        <bufferAttribute
          attach="attributes-aDepth"
          args={[depths, 1]}
        />
      </bufferGeometry>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  );
}

interface SidebarParticlesProps {
  isDark: boolean;
}

export function SidebarParticles({ isDark }: SidebarParticlesProps) {
  const mouseParallax = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseParallax.current.x = nx;
      mouseParallax.current.y = ny;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseParallax]);

  if (!ready) return null;

  return (
    <div className="particles-canvas">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <StarCloud count={isDark ? 1200 : 1000} isDark={isDark} mouseParallax={mouseParallax} />
      </Canvas>
    </div>
  );
}
