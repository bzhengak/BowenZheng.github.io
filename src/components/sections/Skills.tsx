import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../../i18n/I18nProvider';
import { useReveal } from '../../hooks/useReveal';
import { skills, skillCategoryTitles } from '../../data/content';

gsap.registerPlugin(ScrollTrigger);

export function Skills() {
  const { t, lang } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const revealRef = useReveal<HTMLDivElement>();
  const hoverTimer = useRef<number | null>(null);

  const titles = skillCategoryTitles[lang];

  // GSAP cascade 瀑布: 进入视口时对所有 tag 逐个 fly-in
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tagEls = container.querySelectorAll<HTMLElement>('.skill-category');

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        tagEls.forEach((cat, i) => {
          const titleEl = cat.querySelector<HTMLElement>('.category-title');
          if (titleEl) {
            gsap.fromTo(
              titleEl,
              { opacity: 0, y: 16, scale: 0.9 },
              {
                opacity: 1, y: 0, scale: 1,
                duration: 0.6, ease: 'back.out(1.6)',
                delay: i * 0.06,
              }
            );
          }
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // hover 联动: 激活某个分类, 其他变暗
  const activate = (idx: number) => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    hoverTimer.current = window.setTimeout(() => {
      setActiveIndex(idx);
    }, 500);
  };
  const deactivate = () => {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setActiveIndex(null);
  };

  // 重置已激活分类的 tag 弹动
  useEffect(() => {
    if (activeIndex === null) return;
    const active = containerRef.current?.querySelectorAll<HTMLElement>('.skill-category')[activeIndex];
    if (!active) return;
    const tags = active.querySelectorAll<HTMLElement>('.skill-tag');
    gsap.fromTo(
      tags,
      { scale: 0.7, y: 6 },
      { scale: 1, y: 0, duration: 0.4, stagger: 0.025, ease: 'back.out(2.2)' }
    );
  }, [activeIndex]);

  return (
    <section id="skills" className="mb-16">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{t('skill_title')}</h2>
      <div
        ref={(node) => {
          containerRef.current = node;
          (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className="glass-card skills-container reveal"
      >
        {skills.map((cat, i) => {
          const isActive = activeIndex === i;
          const isDimmed = activeIndex !== null && activeIndex !== i;
          return (
            <div
              key={cat.titleKey}
              className={`skill-category ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
              onMouseEnter={() => activate(i)}
              onMouseLeave={deactivate}
              onFocus={() => activate(i)}
              onBlur={deactivate}
              tabIndex={0}
            >
              <span className="category-title">{titles[i]}</span>
              <div className="tags-wrapper">
                {cat.tags.map(tag => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
