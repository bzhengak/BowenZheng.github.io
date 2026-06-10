import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { useTheme } from '../../hooks/useTheme';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { navLinks } from '../../data/content';
import { LangToggle } from '../ui/LangToggle';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SidebarParticles } from '../three/SidebarParticles';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (b: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { activeId, onNavClick } = useScrollSpy(
    navLinks.map(l => l.id),
    0.2,
    0.4
  );
  const isDark = theme === 'dark';

  // 点击 nav 链接后收起移动端菜单
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    onNavClick(id);
    if (window.innerWidth < 768) setMobileOpen(false);
  };

  return (
    <nav id="sidebar" className={mobileOpen ? 'mobile-open' : ''}>
      {/* 3D 粒子星云背景 */}
      <SidebarParticles isDark={isDark} />

      <div className="edge-glow" />
      <div className="nav-content">
        <div className="sidebar-header">
          <h1 className="text-2xl font-bold sidebar-title tracking-tight">
            {t('site_title')}
          </h1>
          <p className="text-xs sidebar-subtitle mt-2 uppercase tracking-widest font-semibold">
            {t('site_subtitle')}
          </p>
        </div>

        <div className="flex-grow overflow-y-auto py-1">
          <ul className="space-y-0.5">
            {navLinks.map(link => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className={`nav-link ${activeId === link.id ? 'active' : ''}`}
                  onClick={handleNavClick(link.id)}
                >
                  <i className={link.icon} />
                  <span>{t(link.labelKey)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-3 mt-3 border-t border-white/5 space-y-3">
          <div className="flex items-center space-x-4">
            <a
              href="mailto:bowen.zheng.owen@gmail.com"
              className="social-icon"
              title={t('social_email')}
              aria-label={t('social_email')}
            >
              <i className="ri-mail-line" />
            </a>
            <a
              href="https://www.linkedin.com/in/bowen-zheng-owen"
              className="social-icon"
              title={t('social_linkedin')}
              aria-label={t('social_linkedin')}
            >
              <i className="ri-linkedin-box-line" />
            </a>
            <a
              href="https://github.com/bzhengak/BowenZheng.github.io"
              className="social-icon"
              title={t('social_github')}
              aria-label={t('social_github')}
            >
              <i className="ri-github-line" />
            </a>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
