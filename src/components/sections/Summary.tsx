import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';
import { useReveal } from '../../hooks/useReveal';

export function Summary() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="summary" className="mb-16">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{t('summary_title')}</h2>
      <GlassCard ref={ref} className="p-8 reveal">
        <p className="leading-relaxed text-[15px] font-light">{t('summary_content')}</p>
      </GlassCard>
    </section>
  );
}
