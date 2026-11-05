import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../hooks/useTheme';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { navLinks } from '../../data/content';

const SCRAMBLE_CHARS = '{}[]()<>#@%&*+=?/\\:;—';

interface DockProps {
  mobileOpen: boolean;
  setMobileOpen: (b: boolean) => void;
}

/**
 * 左侧 Dock 图标导航 (桌面) + 移动端全屏浮层菜单
 * - 图标 hover: tooltip 文字 scramble 解码 + 放大
 * - 当前 section: 高亮 + 底部呼吸点
 * - 语言切换重置 tooltip (label 文案变化)
 */
export function Dock({ mobileOpen, setMobileOpen }: DockProps) {
  const { t, lang, toggle: toggleLang } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const { activeId, onNavClick } = useScrollSpy(
    navLinks.map(l => l.id),
    0.2,
    0.4
  );
  const isDark = theme === 'dark';

  /* —— tooltip scramble —— */
  const [tips, setTips] = useState<Record<string, string>>({});
  const rafRef = useRef<number>(0);

  // 语言切换后重置 (label 变化)
  useEffect(() => {
    setTips({});
  }, [lang]);

  const scrambleTo = (id: string, text: string) => {
    setTips(prev => ({ ...prev, [id]: text }));
  };

  const scramble = (id: string, text: string) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scrambleTo(id, text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    const t0 = performance.now();
    const dur = 340;
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const solved = Math.floor(p * text.length);
      let out = text.slice(0, solved);
      for (let i = solved; i < text.length; i++) {
        out += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      scrambleTo(id, out);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else scrambleTo(id, text);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // 归位: hover 结束时清掉被 scramble 的缓存 (下次用实时文案)
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* —— 移动浮层 —— */
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const tipOf = (id: string, label: string) => tips[id] ?? label;

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavClick(id);
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });
    else if (id === 'hero') window.scrollTo({ top: 0 });
  };

  const langLabel = `EN / 中 · ${lang.toUpperCase()}`;
  const themeLabel = isDark ? t('theme_toggle_light') : t('theme_toggle_dark');

  return (
    <>
      {/* 桌面 Dock */}
      <nav id="dock" aria-label="Primary">
        <a
          className="dock-logo"
          href="#summary"
          aria-label={t('site_title')}
          onClick={handleNavClick('summary')}
          onMouseEnter={() => scramble('logo', t('site_title'))}
        >
          BZ
          <span className="dock-tip" aria-hidden="true">
            {tipOf('logo', t('site_title'))}
          </span>
        </a>

        <div className="dock-sep" aria-hidden="true" />

        <div className="dock-items">
          {navLinks.map(link => (
            <a
              key={link.id}
              href={link.href}
              className={`dock-ic ${activeId === link.id ? 'on' : ''}`}
              aria-label={t(link.labelKey)}
              aria-current={activeId === link.id ? 'true' : undefined}
              onMouseEnter={() => scramble(link.id, t(link.labelKey))}
              onClick={handleNavClick(link.id)}
            >
              <i className={link.icon} aria-hidden="true" />
              <span className="dock-tip" aria-hidden="true">
                {tipOf(link.id, t(link.labelKey))}
              </span>
            </a>
          ))}
        </div>

        <div className="dock-sep" aria-hidden="true" />

        <div className="dock-items">
          <button
            type="button"
            className="dock-ic"
            aria-label={t('lang_switch')}
            onClick={toggleLang}
            onMouseEnter={() => scramble('lang', langLabel)}
          >
            <i className="ri-translate-2" aria-hidden="true" />
            <span className="dock-tip" aria-hidden="true">
              {tipOf('lang', langLabel)}
            </span>
          </button>
          <button
            type="button"
            className="dock-ic"
            aria-label={themeLabel}
            onClick={toggleTheme}
            onMouseEnter={() => scramble('theme', themeLabel)}
          >
            <i className={isDark ? 'ri-sun-line' : 'ri-moon-line'} aria-hidden="true" />
            <span className="dock-tip" aria-hidden="true">
              {tipOf('theme', themeLabel)}
            </span>
          </button>
        </div>
      </nav>

      {/* 移动端浮层菜单 */}
      {mobileOpen && (
        <div className="mobile-overlay" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="mo-close"
            aria-label="Close"
            onClick={() => setMobileOpen(false)}
          >
            <i className="ri-close-line" />
          </button>

          <div className="mo-title">
            <h1>{t('site_title')}</h1>
            <p>{t('site_subtitle')}</p>
          </div>

          <div className="mo-links">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={link.href}
                className={`mo-link ${activeId === link.id ? 'on' : ''}`}
                onClick={handleNavClick(link.id)}
              >
                <i className={link.icon} aria-hidden="true" />
                <span>{t(link.labelKey)}</span>
                <i className="ri-arrow-right-up-line mo-arrow" aria-hidden="true" />
              </a>
            ))}
          </div>

          <div className="mo-footer">
            <button type="button" className="mo-toggle" onClick={toggleLang}>
              <i className="ri-translate-2" aria-hidden="true" />
              {t('lang_switch_mobile')}
            </button>
            <button type="button" className="mo-toggle" onClick={toggleTheme}>
              <i className={isDark ? 'ri-sun-line' : 'ri-moon-line'} aria-hidden="true" />
              {themeLabel}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
