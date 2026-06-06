import { useI18n } from '../../i18n/I18nProvider';

interface LangToggleProps {
  mobile?: boolean;
}

export function LangToggle({ mobile = false }: LangToggleProps) {
  const { lang, toggle, t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggle}
      className={`lang-btn text-xs rounded-full transition flex items-center font-semibold ${
        mobile ? 'px-2 py-1' : 'px-3 py-1.5'
      }`}
      aria-label="Switch language"
    >
      <i className={`ri-translate-2 ${mobile ? 'mr-1' : 'mr-1.5'}`} />
      <span>{mobile ? t('lang_switch_mobile') : t('lang_switch')}</span>
      <span className="ml-1 opacity-60">· {lang.toUpperCase()}</span>
    </button>
  );
}
