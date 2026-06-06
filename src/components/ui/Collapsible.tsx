import { useState, type ReactNode } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

interface CollapsibleProps {
  trigger: ReactNode;     // 自定义触发器 (标题行)
  details: ReactNode;     // 折叠内容
  initialOpen?: boolean;
}

/**
 * 详情折叠
 * - 触发器和内容是 sibling, 通过父组件布局
 * - 我们用一个 wrapper 包住 trigger+details, 控制 details 的 maxHeight/opacity
 */
export function Collapsible({ trigger, details, initialOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(initialOpen);
  const { t } = useI18n();
  const id = `collapsible-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="collapsible-root">
      <div
        className="collapsible-trigger"
        onClick={() => setOpen(v => !v)}
        role="button"
        aria-expanded={open}
        aria-controls={id}
      >
        {trigger}
        <button className="btn-pill" type="button" tabIndex={-1} aria-hidden="true">
          <span className="btn-text">{open ? t('btn_hide') : t('btn_details')}</span>
          <i
            className="ri-arrow-down-s-line transition-transform duration-300"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
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
