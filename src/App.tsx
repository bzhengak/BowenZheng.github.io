import { useState, useEffect, useRef } from 'react';
import { I18nProvider } from './i18n/I18nProvider';
import { ThemeProvider } from './hooks/useTheme';
import { useLenis } from './hooks/useLenis';
import { Cursor } from './components/layout/Cursor';
import { ProgressBar } from './components/layout/ProgressBar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { Hero } from './components/sections/Hero';
import { Summary } from './components/sections/Summary';
import { Skills } from './components/sections/Skills';
import { Education } from './components/sections/Education';
import { Experience } from './components/sections/Experience';
import { Projects } from './components/sections/Projects';
import { EarlyProjects } from './components/sections/EarlyProjects';
import { Extras } from './components/sections/Extras';

function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const lenisRef = useLenis();

  // 视口宽度变化时关闭移动端菜单
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="app-shell">
      <Cursor />
      <ProgressBar lenisRef={lenisRef} />
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <MobileHeader onMenuToggle={() => setMobileOpen(v => !v)} />
      <main>
        <Hero />
        <Summary />
        <Skills />
        <Education />
        <Experience />
        <Projects />
        <EarlyProjects />
        <Extras />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AppShell />
      </I18nProvider>
    </ThemeProvider>
  );
}
