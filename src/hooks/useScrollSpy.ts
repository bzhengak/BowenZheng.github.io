import { useEffect, useState } from 'react';

/**
 * 滚动监听: 返回当前在视口内的 section id
 * - 通过 rootMargin 调整触发的"哪一段"算 active
 * - 点击锚点后的短时间内不上报 (避免被点击目标 section 抢断)
 */
export function useScrollSpy(sectionIds: string[], topOffsetPct = 0.2, bottomOffsetPct = 0.6) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '');
  const [isClickScrolling, setIsClickScrolling] = useState(false);

  useEffect(() => {
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const obs = new IntersectionObserver(
      entries => {
        if (isClickScrolling) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${topOffsetPct * 100}% 0px -${(1 - bottomOffsetPct) * 100}% 0px`,
      }
    );

    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [sectionIds, topOffsetPct, bottomOffsetPct, isClickScrolling]);

  // 点击导航链接时的临时锁
  const onNavClick = (id: string) => {
    setIsClickScrolling(true);
    setActiveId(id);
    window.setTimeout(() => setIsClickScrolling(false), 800);
  };

  return { activeId, onNavClick };
}
