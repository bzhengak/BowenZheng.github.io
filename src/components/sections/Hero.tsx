import type { CSSProperties } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { DotField } from '../canvas/DotField';
import { TerminalCard } from './TerminalCard';
import { CoverageBands } from './CoverageBands';
import { GlassCard } from '../ui/GlassCard';

/**
 * Hero — Bento Grid 首屏
 * - 身份卡 (span 7 × 2 行) + 终端自述卡 (span 5) + 覆盖域带卡 (span 5)
 * - 背景 Canvas 点阵波场; 语言切换通过 key={lang} 重挂载重播全部动画
 *
 * 注意: fade-up 只加在网格 cell 包装层 (不与 .glass-card 的 tilt transform 冲突);
 * 卡片内部元素用纯 opacity 的 fade-in。
 */
export function Hero() {
  const { lang, t } = useI18n();

  const creds = [
    { key: 'cred_hkust', icon: 'ri-graduation-cap-line' },
    { key: 'cred_um', icon: 'ri-graduation-cap-line' },
    { key: 'cred_ey', icon: 'ri-briefcase-line' },
    { key: 'cred_webank', icon: 'ri-bank-line' },
    { key: 'cred_pwc', icon: 'ri-shield-keyhole-line' },
  ];

  return (
    <section className="hero" key={lang} aria-label="Intro">
      <DotField className="hero-dotfield" />

      <div className="bento">
        {/* 身份卡 */}
        <div className="bcell bcell-a fade-up" style={{ '--d': '60ms' } as CSSProperties}>
          <GlassCard className="bcard bhero">
            <div className="hero-hello fade-in" style={{ '--d': '160ms' } as CSSProperties}>
              <span className="pulse-dot" aria-hidden="true" />
              <span>{t('hero_kicker')}</span>
            </div>

            <h1 className="hero-name">
              <span className="word-mask">
                <span className="word" style={{ '--d': '220ms' } as CSSProperties}>
                  {t('hero_name_a')}
                </span>
              </span>
              {t('hero_name_b') && (
                <>
                  {' '}
                  <span className="word-mask">
                    <span className="word" style={{ '--d': '310ms' } as CSSProperties}>
                      {t('hero_name_b')}
                    </span>
                  </span>
                </>
              )}
            </h1>

            <p className="hero-role fade-in" style={{ '--d': '460ms' } as CSSProperties}>
              {t('hero_tagline')}
            </p>

            <div className="cred-row">
              {creds.map((c, i) => (
                <span
                  key={c.key}
                  className="cred-chip fade-in"
                  style={{ '--d': `${640 + i * 70}ms` } as CSSProperties}
                >
                  <i className={c.icon} aria-hidden="true" />
                  {t(c.key)}
                </span>
              ))}
            </div>

            <div className="cta-row fade-in" style={{ '--d': '1000ms' } as CSSProperties}>
              <a href="mailto:bowen.zheng.owen@gmail.com" className="cta-btn cta-btn--primary">
                <i className="ri-mail-line" aria-hidden="true" />
                {t('cta_email')}
                <i className="ri-arrow-right-line" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/bzhengak/BowenZheng.github.io"
                target="_blank"
                rel="noreferrer noopener"
                className="cta-btn cta-btn--ghost"
              >
                <i className="ri-github-line" aria-hidden="true" />
                {t('cta_github')}
              </a>
              <a
                href="https://www.linkedin.com/in/bowen-zheng-owen"
                target="_blank"
                rel="noreferrer noopener"
                className="cta-btn cta-btn--ghost"
              >
                <i className="ri-linkedin-box-line" aria-hidden="true" />
                {t('cta_linkedin')}
              </a>
            </div>
          </GlassCard>
        </div>

        {/* 终端自述卡 */}
        <div className="bcell bcell-b fade-up" style={{ '--d': '320ms' } as CSSProperties}>
          <TerminalCard />
        </div>

        {/* 覆盖域带卡 */}
        <div className="bcell bcell-c fade-up" style={{ '--d': '440ms' } as CSSProperties}>
          <CoverageBands />
        </div>
      </div>

      <a
        href="#summary"
        className="scroll-cue fade-up"
        style={{ '--d': '1350ms' } as CSSProperties}
      >
        <span>{t('scroll_cue')}</span>
        <i className="ri-arrow-down-line" aria-hidden="true" />
      </a>
    </section>
  );
}
