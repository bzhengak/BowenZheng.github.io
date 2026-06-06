import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../i18n/I18nProvider';

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      className="lang-btn text-xs rounded-full px-3 py-1.5 transition flex items-center font-semibold"
      aria-label={isDark ? t('theme_toggle_light') : t('theme_toggle_dark')}
      title={isDark ? t('theme_toggle_light') : t('theme_toggle_dark')}
    >
      <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} mr-1.5`} />
      <span>{compact ? (isDark ? '☀' : '☾') : (isDark ? t('theme_toggle_light') : t('theme_toggle_dark'))}</span>
    </button>
  );
}
