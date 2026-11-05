import type { CSSProperties } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

/**
 * Coverage Map 覆盖域带 (D2)
 * - 三条带并排, 宽度表达"重心分布"(无数字, 纯视觉面积感)
 * - hover / 键盘聚焦时该带展开, 露出技术方向 chips
 * - 窄屏 (≤767px) 回退: 纵向堆叠, chips 常开
 */
const BANDS = [
  { titleKey: 'cov_band_ai_title', listKey: 'cov_band_ai_k', grow: 1.5, cls: 'band--a' },
  { titleKey: 'cov_band_risk_title', listKey: 'cov_band_risk_k', grow: 1.05, cls: 'band--b' },
  { titleKey: 'cov_band_consult_title', listKey: 'cov_band_consult_k', grow: 0.85, cls: 'band--c' },
];

export function CoverageBands() {
  const { t } = useI18n();

  return (
    <div className="bcard bcov">
      <span className="bcov-label">{t('cov_label')}</span>
      <div className="bands">
        {BANDS.map(b => (
          <div
            key={b.titleKey}
            className={`band ${b.cls}`}
            style={{ '--w': b.grow } as CSSProperties}
            tabIndex={0}
          >
            <b className="band-title">{t(b.titleKey)}</b>
            <span className="band-ks">
              {t(b.listKey)
                .split(',')
                .map(kw => kw.trim())
                .filter(Boolean)
                .map(kw => (
                  <span key={kw} className="band-kw">
                    {kw}
                  </span>
                ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
