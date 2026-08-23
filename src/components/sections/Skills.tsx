import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { useReveal } from '../../hooks/useReveal';
import { skills, skillCategoryTitles } from '../../data/content';

gsap.registerPlugin(ScrollTrigger);

const CATEGORY_ICONS = [
  'ri-robot-2-line',
  'ri-bar-chart-box-line',
  'ri-code-s-slash-line',
  'ri-shield-check-line',
  'ri-leaf-line',
  'ri-translate-2',
];

export function Skills() {
  const { t, lang } = useI18n();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useReveal<HTMLDivElement>();

  const titles = skillCategoryTitles[lang];

  // GSAP 瀑布: 进入视口时所有分类卡片逐个浮现
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const cards = container.querySelectorAll<HTMLElement>('.skill-cat-card');

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 82%',
      once: true,
      onEnter: () => {
        cards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 26, scale: 0.96 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.65,
              ease: 'back.out(1.5)',
              delay: i * 0.07,
            }
          );
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section id="skills" className="section">
      <SectionHeader index="02" labelKey="nav_skills" titleKey="skill_title" />
      <div
        ref={(node) => {
          containerRef.current = node;
          (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className="skills-grid reveal"
      >
        {skills.map((cat, i) => (
          <article key={cat.titleKey} className="skill-cat-card">
            <div className="skill-cat-head">
              <span className="skill-cat-icon">
                <i className={CATEGORY_ICONS[i] ?? 'ri-star-line'} aria-hidden="true" />
              </span>
              <span className="skill-cat-name">{titles[i]}</span>
              <span className="skill-cat-count">{String(cat.tags.length).padStart(2, '0')}</span>
            </div>
            <div className="skill-tags-wrap">
              {cat.tags.map(tag => (
                <span key={tag} className="skill-tag">{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
