import { useI18n } from '../../i18n/I18nProvider';
import { LangToggle } from '../ui/LangToggle';

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const { t } = useI18n();
  return (
    <div className="md:hidden mobile-header p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-lg font-bold tracking-tight">{t('site_title_mobile')}</h1>
      <div className="flex items-center space-x-3">
        <LangToggle mobile />
        <button
          id="menu-toggle"
          onClick={onMenuToggle}
          className="text-2xl"
          aria-label="Menu"
        >
          <i className="ri-menu-3-line" />
        </button>
      </div>
    </div>
  );
}
