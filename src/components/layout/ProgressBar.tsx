import { useEffect, useState, type RefObject } from 'react';
import type Lenis from 'lenis';

interface ProgressBarProps {
  lenisRef: RefObject<Lenis | null>;
}

/**
 * 阅读进度条 (顶部)
 * 订阅 Lenis scroll 事件
 */
export function ProgressBar({ lenisRef }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const onScroll = () => {
      const scroll = lenis.scroll;
      const limit = lenis.limit;
      setProgress(limit > 0 ? scroll / limit : 0);
    };
    lenis.on('scroll', onScroll);
    return () => {
      lenis.off('scroll', onScroll);
    };
  }, [lenisRef]);

  return (
    <div className="progress-bar" aria-hidden="true">
      <div
        className="progress-bar__fill"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
