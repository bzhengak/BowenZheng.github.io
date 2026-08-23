import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { useReveal } from '../../hooks/useReveal';
import { education } from '../../data/content';

function EduNode({ item, index }: { item: (typeof education)[number]; index: number }) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  const delayClass = index === 0 ? '' : 'reveal-delay-1';

  return (
    <div ref={ref} className={`tl-item reveal ${delayClass}`}>
      <span className="tl-node" aria-hidden="true" />
      <span className="tl-period">{item.period}</span>
      <h3 className="tl-org">{item.school}</h3>
      <p className="tl-role" style={{ color: 'var(--accent)', fontWeight: 600 }}>
        {t(item.degKey)}
      </p>
      <p
        className="text-[0.85rem] font-light leading-relaxed mt-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t(item.courseKey)}
      </p>
      {item.honorKey && (
        <p className="text-xs mt-2 font-semibold text-emerald-500">
          <i className="ri-award-line mr-1" aria-hidden="true" />
          {t(item.honorKey)}
        </p>
      )}
    </div>
  );
}

export function Education() {
  const { t } = useI18n();
  const trackRef = useReveal<HTMLDivElement>();

  return (
    <section id="education" className="section">
      <SectionHeader index="03" labelKey="nav_education" titleKey="edu_title" />
      <div ref={trackRef} className="timeline reveal">
        <div className="timeline-track" aria-hidden="true">
          <div className="timeline-track-fill" style={{ '--tl-fill': 1 } as React.CSSProperties} />
        </div>
        {education.map((edu, i) => (
          <EduNode key={edu.school} item={edu} index={i} />
        ))}
      </div>
    </section>
  );
}
