import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { useReveal } from '../../hooks/useReveal';
import { skills, skillCategoryTitles } from '../../data/content';

const CATEGORY_ICONS = [
  'ri-robot-2-line',
  'ri-bar-chart-box-line',
  'ri-code-s-slash-line',
  'ri-shield-check-line',
  'ri-leaf-line',
  'ri-translate-2',
];

/**
 * Skills — D5 Tabs Cloud
 * - 左侧分类导航 (hover / click 切换), 右侧标签云 stagger 跳入
 * - 切换时通过 key={active} 重挂载重播 chipIn 动画
 */
export function Skills() {
  const { lang } = useI18n();
  const titles = skillCategoryTitles[lang];
  const [active, setActive] = useState(0);
  const revealRef = useReveal<HTMLDivElement>();

  // 语言切换时防越界
  useEffect(() => {
    if (active >= skills.length) setActive(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const tabProps = (i: number) => ({
    role: 'tab' as const,
    'aria-selected': i === active,
    onClick: () => setActive(i),
    onMouseEnter: () => setActive(i),
    onFocus: () => setActive(i),
  });

  const tags = skills[active]?.tags ?? [];

  return (
    <section id="skills" className="section">
      <SectionHeader index="02" labelKey="nav_skills" titleKey="skill_title" />

      <div ref={revealRef} className="skx reveal">
        <div className="skct" role="tablist" aria-label="Skill categories">
          {skills.map((cat, i) => (
            <button
              key={cat.titleKey}
              type="button"
              className={`sktb ${i === active ? 'on' : ''}`}
              tabIndex={0}
              {...tabProps(i)}
            >
              <span className="sktb-icon">
                <i className={CATEGORY_ICONS[i] ?? 'ri-star-line'} aria-hidden="true" />
              </span>
              <b>{titles[i] ?? cat.titleKey}</b>
              <span className="sktb-count">{String(cat.tags.length).padStart(2, '0')}</span>
            </button>
          ))}
        </div>

        <div className="skcloud" role="tabpanel" key={`${active}-${lang}`}>
          {tags.map((tag, i) => (
            <span
              key={tag}
              className="skill-tag sktag-in"
              style={{ '--d': `${i * 26}ms` } as React.CSSProperties}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
