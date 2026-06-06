import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';
import { useReveal } from '../../hooks/useReveal';

export function Extras() {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="extras" className="mb-20">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{t('extras_title')}</h2>
      <GlassCard ref={ref} className="p-8 reveal" tilt>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <i className="ri-sparkling-line text-accent mr-3 text-xl" />
          <span>{t('extras_interest_title')}</span>
        </h3>
        <p className="text-[15px] font-light">{t('extras_interest_content')}</p>
      </GlassCard>
    </section>
  );
}
