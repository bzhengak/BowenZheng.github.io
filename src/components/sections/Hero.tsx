import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { experiences, projects, earlyProjects, skills } from '../../data/content';

/** 数字滚动计数: 进入视口后从 0 缓动到目标值 */
function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    const obs = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setValue(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function StatRow({ value, labelKey, delay }: { value: number; labelKey: string; delay: string }) {
  const { t } = useI18n();
  const { value: shown, ref } = useCountUp(value);
  return (
    <div className="stat-cell stat-cell--row fade-up" style={{ '--d': delay } as React.CSSProperties}>
      <span className="stat-value">
        <span ref={ref}>{shown}</span>
      </span>
      <span className="stat-label">{t(labelKey)}</span>
    </div>
  );
}

export function Hero() {
  const { lang, t } = useI18n();

  // 语言切换时通过 key 重挂载, 重播入场动画并同步全部文案 (声明式, 无 innerHTML)
  const keywords = t('hero_keywords').split(',').map(s => s.trim()).filter(Boolean);

  return (
    <section className="hero" key={lang} aria-label="Intro">
      <div className="hero-grid">
        {/* 左栏: 主叙事 */}
        <div className="hero-main">
          <div className="hero-hello fade-up" style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className="pulse-dot" aria-hidden="true" />
            <span>{t('hero_kicker')}</span>
          </div>

          <h1 className="hero-name">
            <span className="word-mask"><span className="word" style={{ '--d': '80ms' } as React.CSSProperties}>{t('hero_name_a')}</span></span>
            {t('hero_name_b') && (
              <>
                {' '}
                <span className="word-mask"><span className="word" style={{ '--d': '170ms' } as React.CSSProperties}>{t('hero_name_b')}</span></span>
              </>
            )}
          </h1>

          <p className="hero-role fade-up" style={{ '--d': '300ms' } as React.CSSProperties}>
            {t('hero_tagline')}
          </p>

          <div className="cred-row">
            {[
              { key: 'cred_hkust', icon: 'ri-graduation-cap-line' },
              { key: 'cred_um', icon: 'ri-graduation-cap-line' },
              { key: 'cred_ey', icon: 'ri-briefcase-line' },
              { key: 'cred_webank', icon: 'ri-bank-line' },
              { key: 'cred_pwc', icon: 'ri-shield-keyhole-line' },
            ].map((c, i) => (
              <span
                key={c.key}
                className="cred-chip fade-up"
                style={{ '--d': `${520 + i * 70}ms` } as React.CSSProperties}
              >
                <i className={c.icon} aria-hidden="true" />
                {t(c.key)}
              </span>
            ))}
          </div>

          <div className="kw-row kw-row--hero fade-up" style={{ '--d': '900ms' } as React.CSSProperties}>
            {keywords.map(kw => (
              <span key={kw} className="kw-item">{kw}</span>
            ))}
          </div>

          <div className="cta-row fade-up" style={{ '--d': '1020ms' } as React.CSSProperties}>
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
        </div>

        {/* 右栏: 数据速览面板 (平衡左右视觉) */}
        <aside className="hero-side fade-up" style={{ '--d': '1150ms' } as React.CSSProperties}>
          <div className="hero-panel">
            <div className="hero-panel-label">{t('hero_panel_label')}</div>
            <div className="stats-stack">
              <StatRow value={experiences.length} labelKey="stat_internships" delay="1250ms" />
              <StatRow value={projects.length + earlyProjects.length} labelKey="stat_projects" delay="1330ms" />
              <StatRow value={skills.length} labelKey="stat_domains" delay="1410ms" />
            </div>
          </div>
        </aside>
      </div>

      <a href="#summary" className="scroll-cue fade-up" style={{ '--d': '1500ms' } as React.CSSProperties}>
        <span>{t('scroll_cue')}</span>
        <i className="ri-arrow-down-line" aria-hidden="true" />
      </a>
    </section>
  );
}
