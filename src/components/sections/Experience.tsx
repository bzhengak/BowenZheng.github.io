import { useEffect, useId, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { useReveal } from '../../hooks/useReveal';
import { experiences, type ExperienceItem, type ExperienceProject } from '../../data/content';
import { TagChip } from '../ui/TagChip';

/** 单个子项目卡: 首条 bullet 常开, 其余折叠 (渐进披露) */
function ProjectSubItem({ proj }: { proj: ExperienceProject }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rest = proj.details.slice(1);
  const detailsId = useId();

  return (
    <article className="tl-subcard">
      <h4>{t(proj.titleKey)}</h4>
      <ul className="detail-list" style={{ marginTop: 8 }}>
        <li style={{ marginBottom: 0 }}>{t(proj.details[0])}</li>
      </ul>
      <div
        id={detailsId}
        className={`collapsible-wrapper ${open ? 'is-expanded' : ''}`}
        aria-hidden={!open}
      >
        <div className="collapsible-inner">
          <ul className="detail-list collapsible-content">
            {rest.map(dKey => (
              <li key={dKey}>{t(dKey)}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
        <div className="chip-row" style={{ justifyContent: 'flex-start' }}>
          {proj.tags?.map(tag => <TagChip key={tag} label={tag} />)}
        </div>
        {rest.length > 0 && (
          <button
            type="button"
            className="btn-pill"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
          >
            <span>{open ? t('exp_less') : t('exp_more')}</span>
            <i
              className="ri-arrow-down-s-line transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        )}
      </div>
    </article>
  );
}

function ExperienceNode({ exp, index }: { exp: ExperienceItem; index: number }) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  const delayClass = index === 0 ? '' : 'reveal-delay-1';

  return (
    <div ref={ref} className={`tl-item reveal ${delayClass}`}>
      <span className="tl-node" aria-hidden="true" />
      <span className="tl-period">{exp.period}</span>
      <h3 className="tl-org">{exp.company}</h3>
      <p className="tl-role">{t(exp.roleKey)}</p>
      <div className="space-y-4 mt-4">
        {exp.projects.map(proj => (
          <ProjectSubItem key={proj.titleKey} proj={proj} />
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  const { t } = useI18n();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const revealRef = useReveal<HTMLDivElement>();

  // 时间线轴线随滚动生长
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        // 轴线顶端进入视口 85% 处开始绘制, 底端到达视口 45% 处画满
        const start = vh * 0.85;
        const end = vh * 0.45;
        const total = rect.height || 1;
        const drawn = Math.min(Math.max((start - rect.top) / (total + start - end), 0), 1);
        el.style.setProperty('--tl-fill', String(drawn));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section id="experience" className="section">
      <SectionHeader index="04" labelKey="nav_experience" titleKey="exp_title" />
      <div
        ref={(node) => {
          wrapRef.current = node;
          (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className="timeline"
      >
        <div className="timeline-track" aria-hidden="true">
          <div className="timeline-track-fill" />
        </div>
        {experiences.map((exp, i) => (
          <ExperienceNode key={exp.company} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
