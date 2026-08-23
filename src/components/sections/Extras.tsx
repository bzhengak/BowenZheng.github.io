import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { useReveal } from '../../hooks/useReveal';

export function Extras() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();

  const interests = t('extras_interest_content')
    .split(/[、,，]/)
    .map(s => s.trim().replace(/[.。]+$/, ''))
    .filter(Boolean);

  return (
    <section id="extras" className="section" style={{ marginBottom: '4.5rem' }}>
      <SectionHeader index="07" labelKey="nav_extras" titleKey="extras_title" />
      <div
        ref={ref}
        className="glass-card glass-card--flat reveal"
        style={{ padding: '26px 28px' }}
      >
        <h3 className="text-base font-semibold flex items-center mb-4">
          <i className="ri-sparkling-line text-accent mr-2.5 text-lg" aria-hidden="true" />
          <span>{t('extras_interest_title')}</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {interests.map(interest => (
            <span key={interest} className="tag-chip">
              <span className="tag-chip-dot" />
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
