import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';
import { Collapsible } from '../ui/Collapsible';
import { earlyProjects } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

export function EarlyProjects() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="early-projects" className="mb-16">
      <GlassCard ref={ref} className="p-8 reveal" tilt>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold tracking-tight">{t('early_title')}</h2>
        </div>
        <Collapsible
          trigger={null}
          details={
            <div className="space-y-6 pt-6 border-t border-white/5">
              {earlyProjects.map(p => (
                <div key={p.titleKey}>
                  <h4 className="text-md font-semibold mb-1">{t(p.titleKey)}</h4>
                  <p className="text-xs text-secondary font-medium mb-2">{p.period}</p>
                  <ul className="list-disc list-inside text-[15px] font-light space-y-1">
                    {p.details.map(dKey => (
                      <li key={dKey}>{t(dKey)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          }
        />
      </GlassCard>
    </section>
  );
}
