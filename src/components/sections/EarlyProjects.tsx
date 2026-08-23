import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { TagChip } from '../ui/TagChip';
import { earlyProjects } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

function yearOf(period: string): string {
  // 取起始年份, 如 "02/2023 - 05/2023" → "2023"
  const m = period.match(/(\d{4})/);
  return m ? m[1] : period;
}

export function EarlyProjects() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="early-projects" className="section">
      <SectionHeader index="06" labelKey="nav_early" titleKey="early_title" />
      <div
        ref={ref}
        className="glass-card glass-card--flat reveal"
        style={{ padding: '10px 26px' }}
      >
        <div className="early-list">
          {earlyProjects.map(p => (
            <article key={p.titleKey} className="early-row">
              <span className="early-row-year">{yearOf(p.period)}</span>
              <div className="early-row-body">
                <h4>{t(p.titleKey)}</h4>
                <p>{t(p.details[0])}</p>
                {p.details[1] && <p style={{ marginTop: 4 }}>{t(p.details[1])}</p>}
                <div className="chip-row" style={{ justifyContent: 'flex-start', marginTop: 8 }}>
                  <span className="period-pill">{p.period}</span>
                  {p.tags?.map(tag => <TagChip key={tag} label={tag} />)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
