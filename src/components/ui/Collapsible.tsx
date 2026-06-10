import { useState, type ReactNode } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { TagChip } from './TagChip';

interface CollapsibleProps {
  trigger: ReactNode;     // 自定义触发器 (标题行)
  details: ReactNode;     // 折叠内容
  initialOpen?: boolean;
  tags?: string[];        // 关键词 chips, 展示在 View Details 按钮左侧
}

/**
 * 详情折叠
 * - 触发器和内容是 sibling, 通过父组件布局
 * - 我们用一个 wrapper 包住 trigger+details, 控制 details 的 maxHeight/opacity
 */
export function Collapsible({ trigger, details, initialOpen = false, tags }: CollapsibleProps) {
  const [open, setOpen] = useState(initialOpen);
  const { t } = useI18n();
  const id = `collapsible-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="collapsible-root">
      <div className="collapsible-trigger">
        {trigger}
        <div className="collapsible-right">
          {tags && tags.length > 0 && (
            <div className="chip-row chip-row--inline">
              {tags.map(tag => (
                <TagChip key={tag} label={tag} />
              ))}
            </div>
          )}
          <button
            className="btn-pill"
            type="button"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls={id}
          >
            <span className="btn-text">{open ? t('btn_hide') : t('btn_details')}</span>
            <i
              className="ri-arrow-down-s-line transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
      </div>
      <div
        id={id}
        className={`collapsible-wrapper ${open ? 'is-expanded' : ''}`}
      >
        <div className="collapsible-inner">{details}</div>
      </div>
    </div>
  );
}
