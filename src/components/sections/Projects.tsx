import { useId, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { TagChip } from '../ui/TagChip';
import { GlassCard } from '../ui/GlassCard';
import { projects, type ProjectItem } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

function ProjectCard({ item, index }: { item: ProjectItem; index: number }) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const delayClass = index > 0 ? `reveal-delay-${Math.min(index, 4)}` : '';
  const rest = item.details.slice(1);

  return (
    <GlassCard
      ref={ref}
      className={`p-8 reveal ${delayClass}`}
      tilt={index < 2}
    >
      <div className="flex justify-between items-start mb-2 gap-3 flex-wrap">
        <h3 className="text-xl font-semibold font-display tracking-tight">{t(item.titleKey)}</h3>
        <div className="flex items-center gap-3">
          <span className="period-pill">{item.period}</span>
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="social-icon text-xl"
              aria-label="GitHub"
            >
              <i className="ri-github-line" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--accent)' }}>
        {t(item.summaryKey)}
      </p>

      <ul className="detail-list">
        <li>{t(item.details[0])}</li>
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

      <div className="flex justify-between items-center flex-wrap gap-2 mt-4">
        <div className="chip-row" style={{ justifyContent: 'flex-start' }}>
          {item.tags?.map(tag => <TagChip key={tag} label={tag} />)}
        </div>
        {rest.length > 0 && (
          <button
            type="button"
            className="btn-pill"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls={detailsId}
          >
            <span>{open ? t('exp_less') : t('exp_more')}</span>
            <i
              className="ri-arrow-down-s-line transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        )}
      </div>
    </GlassCard>
  );
}

export function Projects() {
  const { t } = useI18n();
  return (
    <section id="projects" className="section">
      <SectionHeader index="05" labelKey="nav_projects" titleKey="proj_title" />
      <div className="space-y-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.titleKey} item={p} index={i} />
        ))}
      </div>
    </section>
  );
}
