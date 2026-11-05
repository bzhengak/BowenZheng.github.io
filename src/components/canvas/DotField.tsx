import { useEffect, useRef } from 'react';

/**
 * Canvas 点阵波场 (Hero 背景层)
 *
 * - 全屏细点阵网格, 光标经过时点被"排开"并点亮 (位移 + 亮度衰减半径)
 * - 周期性从画面中生成一圈扩散波纹 (蓝→青), 席卷点阵后衰减
 * - 纯 Canvas 2D, 零依赖; 离开视口自动暂停; weak-motion 渲染静态点阵
 */
export function DotField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const GAP = 26;              // 点阵间距
    const REPEL_R = 130;         // 光标排开半径
    const REPEL_DEPTH = 16;      // 最大位移距离
    const RIPPLE_W = 46;         // 波纹环带厚度
    const RIPPLE_SPEED = 0.16;   // 波纹扩散速度 px/ms
    const RIPPLE_LIFE = 3200;    // 波纹寿命 ms

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let rafId = 0;
    let inView = true;
    let nextRippleAt = performance.now() + 600;

    const pointer = { x: -9999, y: -9999 };
    const ripples: { x: number; y: number; born: number }[] = [];

    const isLight = () => document.documentElement.classList.contains('light');

    /* —— 尺寸 & 点阵重建 —— */
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* —— 事件 —— */
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeaveWindow = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const obs = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
    }, { threshold: 0 });
    obs.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) drawStatic();
    });
    ro.observe(canvas);

    /* —— 绘制单帧 —— */
    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      const light = isLight();
      const baseDot = light ? '11, 18, 32' : '148, 190, 255';
      const baseAlpha = light ? 0.1 : 0.085;

      // 波纹生命周期管理
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = now - rp.born;
        const radius = age * RIPPLE_SPEED;
        if (age > RIPPLE_LIFE || radius > Math.max(w, h) * 1.1) {
          ripples.splice(i, 1);
        }
      }
      // 自动生成波纹 (画面中部 60% 区域)
      if (now >= nextRippleAt) {
        ripples.push({
          x: w * (0.2 + Math.random() * 0.6),
          y: h * (0.2 + Math.random() * 0.6),
          born: now,
        });
        nextRippleAt = now + 2100 + Math.random() * 1600;
      }

      for (const d of dots()) {
        let ox = 0;
        let oy = 0;
        let glow = 0;
        let cyan = false;

        // 光标排开
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const pd = Math.hypot(dx, dy);
        if (pd < REPEL_R && pd > 0.001) {
          const f = 1 - pd / REPEL_R;
          const ease = f * f;
          ox += (dx / pd) * ease * REPEL_DEPTH;
          oy += (dy / pd) * ease * REPEL_DEPTH;
          glow = Math.max(glow, ease);
        }

        // 波纹环带点亮 + 轻微径向位移
        for (const rp of ripples) {
          const radius = (now - rp.born) * RIPPLE_SPEED;
          const dist = Math.hypot(d.x - rp.x, d.y - rp.y);
          const half = RIPPLE_W / 2;
          const delta = Math.abs(dist - radius);
          if (delta < half) {
            const f = 1 - delta / half;            // 0~1
            const life = 1 - (now - rp.born) / RIPPLE_LIFE; // 衰减
            const amount = f * f * Math.max(0, life);
            glow = Math.max(glow, amount * 0.9);
            cyan = amount * 0.9 > 0.45 ? true : cyan;
            if (dist > 0.001) {
              const push = amount * 7;
              ox += ((d.x - rp.x) / dist) * push;
              oy += ((d.y - rp.y) / dist) * push;
            }
          }
        }

        const x = d.x + ox;
        const y = d.y + oy;
        const r = 1 + glow * 1.4;
        const a = baseAlpha + glow * 0.8;

        ctx.beginPath();
        ctx.fillStyle =
          glow > 0.12
            ? `rgba(${cyan ? '103, 232, 249' : '147, 197, 253'}, ${a.toFixed(3)})`
            : `rgba(${baseDot}, ${baseAlpha.toFixed(3)})`;
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    /* —— 点阵坐标生成 —— */
    const dots = function* (): Generator<{ x: number; y: number }, void, unknown> {
      for (let y = GAP / 2; y < h + GAP; y += GAP) {
        for (let x = GAP / 2; x < w + GAP; x += GAP) {
          yield { x, y };
        }
      }
    };

    /* —— reduced-motion: 静态点阵一帧 —— */
    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      const light = isLight();
      ctx.fillStyle = light ? 'rgba(11, 18, 32, 0.1)' : 'rgba(148, 190, 255, 0.085)';
      for (const d of dots()) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (reduced) {
      resize();
      drawStatic();
      return () => {
        obs.disconnect();
        ro.disconnect();
      };
    }

    // 主循环
    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      if (!inView || document.hidden) return;
      draw(now);
    };

    resize();
    rafId = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeaveWindow);
    window.addEventListener('blur', onPointerLeaveWindow);

    return () => {
      cancelAnimationFrame(rafId);
      obs.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeaveWindow);
      window.removeEventListener('blur', onPointerLeaveWindow);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`dotfield ${className}`}
      aria-hidden="true"
    />
  );
}
