import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';
import { Collapsible } from '../ui/Collapsible';
import { education, type EducationItem } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

interface EduCardProps {
  item: EducationItem;
  delayClass: string;
}

function EduCard({ item, delayClass }: EduCardProps) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  return (
    <GlassCard
      ref={ref}
      className={`p-8 reveal ${delayClass}`}
      tilt
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">{item.school}</h3>
        <span className="text-xs bg-white/5 px-3 py-1 rounded-full font-semibold">
          {item.period}
        </span>
      </div>
      <p className="text-sm text-accent font-semibold mb-4">{t(item.degKey)}</p>
      <Collapsible
        trigger={null}
        details={
          <>
            <p className="text-[15px] font-light leading-relaxed">
              {t(item.courseKey)}
            </p>
            {item.honorKey && (
              <p className="text-xs text-emerald-500 mt-3 font-semibold">
                {t(item.honorKey)}
              </p>
            )}
          </>
        }
      />
    </GlassCard>
  );
}

export function Education() {
  const { t } = useI18n();
  return (
    <section id="education" className="mb-16">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{t('edu_title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {education.map((edu, i) => (
          <EduCard
            key={edu.school}
            item={edu}
            delayClass={i === 0 ? 'reveal-delay-1' : 'reveal-delay-2'}
          />
        ))}
      </div>
    </section>
  );
}
