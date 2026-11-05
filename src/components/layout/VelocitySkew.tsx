import { useEffect } from 'react';

/**
 * 全局速度歪斜层
 * - 监听滚动速度, 将衰减后的歪斜度写入 :root --vskew (deg, ±2)
 * - CSS 端用于 .section-title / .footer-title 的 skewY (细节果冻感)
 * - reduced-motion 时不启动 (变量恒为 0)
 */
export function VelocitySkew() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = 0;
    let lastY = window.scrollY;
    let vel = 0;

    const loop = () => {
      rafId = requestAnimationFrame(loop);
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      vel = vel * 0.82 + dy * 0.18;

      const sk = vel === 0 ? 0 : Math.max(-2, Math.min(2, vel * 0.045));
      document.documentElement.style.setProperty('--vskew', sk.toFixed(3));
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.style.removeProperty('--vskew');
    };
  }, []);

  return null;
}
