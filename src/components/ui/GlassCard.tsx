import { forwardRef, type ReactNode, type CSSProperties, type MouseEvent } from 'react';
import { useTilt } from '../../hooks/useTilt';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

/**
 * 玻璃态卡片
 * - 默认开启 3D 倾斜 + 鼠标光斑
 * - 通过 CSS 变量 --rx/--ry/--mx/--my 实现
 * - 支持 ref 转发 (供 useReveal 等订阅)
 */
export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { children, className = '', tilt = true, style, onClick },
  ref
) {
  const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt(8);

  const setRef = (node: HTMLDivElement | null) => {
    tiltRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
  };

  const motionHandlers = tilt
    ? { onMouseMove: onMouseMove as unknown as (e: MouseEvent<HTMLDivElement>) => void, onMouseLeave }
    : { onMouseLeave };

  return (
    <div
      ref={setRef}
      className={`glass-card ${className}`}
      style={style}
      onClick={onClick}
      {...motionHandlers}
    >
      {children}
    </div>
  );
});
