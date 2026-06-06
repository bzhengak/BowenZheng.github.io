import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 侧边栏内的 3D 粒子星云
 * - 600 颗粒子, 球壳分布
 * - 鼠标移动 → 相机视差
 * - 主题色根据 dark/light 切换 (硬编码 fallback, 因为 R3F 在 canvas 内)
 */

interface StarCloudProps {
  count?: number;
  isDark: boolean;
  mouseParallax: React.MutableRefObject<{ x: number; y: number }>;
}

function StarCloud({ count = 600, isDark, mouseParallax }: StarCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  // 生成球壳分布的粒子
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    // 暗色用冷色 (蓝紫青), 亮色用更暖的色 (粉橙)
    const palette = isDark
      ? [
          [0.65, 0.55, 1.0],   // purple
          [0.38, 0.65, 1.0],   // blue
          [0.02, 0.71, 0.83],  // cyan
          [0.20, 0.83, 0.60],  // green
          [0.95, 0.45, 0.71],  // pink
          [0.0, 0.44, 0.89],   // apple blue
        ]
      : [
          [0.45, 0.55, 1.0],
          [1.0, 0.55, 0.7],
          [0.6, 0.85, 1.0],
          [0.95, 0.78, 0.5],
        ];

    for (let i = 0; i < count; i++) {
      // 球壳分布
      const radius = 2.2 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3 + 0] = c[0];
      col[i * 3 + 1] = c[1];
      col[i * 3 + 2] = c[2];

      siz[i] = Math.random() * 0.08 + 0.015;
    }
    return { positions: pos, colors: col, sizes: siz };
  }, [count, isDark]);

  // 缓慢自转
  useFrame((_, delta) => {
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
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={isDark ? 0.85 : 0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
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
        <ambientLight intensity={0.5} />
        <StarCloud count={isDark ? 600 : 480} isDark={isDark} mouseParallax={mouseParallax} />
      </Canvas>
    </div>
  );
}
