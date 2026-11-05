import { useRef, type MouseEventHandler, type ReactNode } from 'react';

/**
 * 磁性包装: 光标附近时子按钮被"吸"过来, 离开时弹性回位
 * (仅起鼠标位移 transform, 内容本身可保持原样式)
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove: MouseEventHandler<HTMLDivElement> = e => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transition = 'transform 0.08s linear';
    el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.28).toFixed(1)}px)`;
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.4)';
    el.style.transform = '';
  };

  return (
    <div className="magrp" ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  );
}
