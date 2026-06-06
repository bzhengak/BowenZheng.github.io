import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * Lenis 平滑滚动 hook
 * - 启动 Lenis 并 requestAnimationFrame 驱动
 * - 暴露实例 ref 以便 ProgressBar 等组件订阅
 */
export function useLenis() {
  const instanceRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 尊重用户 prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    instanceRef.current = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      instanceRef.current = null;
    };
  }, []);

  return instanceRef;
}
