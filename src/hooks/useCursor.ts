import { useEffect, useRef, useState } from 'react';

/**
 * 自定义光标:
 * - 仅在桌面端 (>= 768px) 启用
 * - 跟踪鼠标, 落到 a/button/card/tag 上时切换 hover 态
 * - 同步驱动右侧 ambient glow
 */
export function useCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!cursor || !glow) return;

    let rafId = 0;
    let targetX = 0, targetY = 0;
    let glowX = 0, glowY = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      cursor.style.opacity = '1';
      glow.classList.add('is-active');
      if (!rafId) rafId = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      cursor.style.opacity = '0';
      glow.classList.remove('is-active');
    };
    const onEnter = () => {
      cursor.style.opacity = '1';
      glow.classList.add('is-active');
    };

    // 缓动循环: glow 跟随稍慢, cursor 即时
    const loop = () => {
      glowX += (targetX - glowX) * 0.18;
      glowY += (targetY - glowY) * 0.18;
      cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - glowX) > 0.5 || Math.abs(targetY - glowY) > 0.5) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = 0;
      }
    };

    // hover 态: 落到 a/button/.glass-card/.skill-tag/.nav-link/.btn-pill/.skill-category
    const INTERACTIVE = 'a, button, .glass-card, .skill-tag, .nav-link, .btn-pill, .skill-category, [role="button"]';
    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest(INTERACTIVE)) cursor.classList.add('is-hover');
    };
    const onOut = (e: Event) => {
      const t = e.target as Element | null;
      if (t && t.closest(INTERACTIVE)) cursor.classList.remove('is-hover');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return { cursorRef, glowRef, enabled };
}
