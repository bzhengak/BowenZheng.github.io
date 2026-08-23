import { useI18n } from '../../i18n/I18nProvider';

interface SectionHeaderProps {
  index: string;     // 编号 "01".."07"
  labelKey: string;  // i18n 导航短标签 (kicker 行)
  titleKey: string;  // i18n 章节标题
}

export function SectionHeader({ index, labelKey, titleKey }: SectionHeaderProps) {
  const { t } = useI18n();
  return (
    <header className="section-head">
      <span className="section-num" aria-hidden="true">{index}</span>
      <div className="section-kicker">
        <span>{index}</span>
        <span>{t(labelKey)}</span>
      </div>
      <h2 className="section-title">{t(titleKey)}</h2>
    </header>
  );
}
