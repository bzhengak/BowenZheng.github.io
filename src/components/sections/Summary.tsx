import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { useReveal } from '../../hooks/useReveal';

const CARDS = [
  { key: 'cap_ai', icon: 'ri-robot-2-line', delayClass: '' },
  { key: 'cap_data', icon: 'ri-line-chart-line', delayClass: 'reveal-delay-1' },
  { key: 'cap_consulting', icon: 'ri-hand-heart-line', delayClass: 'reveal-delay-2' },
] as const;

export function Summary() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="summary" className="section">
      <SectionHeader index="01" labelKey="nav_summary" titleKey="summary_title" />
      <div ref={ref} className="cap-grid reveal">
        {CARDS.map(card => (
          <article key={card.key} className={`cap-card ${card.delayClass}`}>
            <div className="cap-icon">
              <i className={card.icon} aria-hidden="true" />
            </div>
            <h3 className="cap-title">{t(`${card.key}_title`)}</h3>
            <p className="cap-desc">{t(`${card.key}_desc`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
