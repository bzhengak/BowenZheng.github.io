import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';

export function Hero() {
  const { lang, t } = useI18n();
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLDivElement | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const headline = headlineRef.current;
    const sub = subRef.current;
    if (!headline || !sub) return;

    const mainText = 'Bowen Zheng';
    const subText = t('hero_subheadline');

    headline.innerHTML = '';
    sub.innerHTML = '';

    const charDelay = 30;
    const wordDelay = 400;

    mainText.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = 'all 0.4s ease';
      span.style.transitionDelay = `${i * charDelay}ms`;
      headline.appendChild(span);
    });

    subText.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      span.style.marginRight = '0.5rem';
      span.style.opacity = '0';
      span.style.transform = 'translateY(15px)';
      span.style.transition = 'all 0.5s ease';
      span.style.transitionDelay = `${wordDelay + i * 80}ms`;
      sub.appendChild(span);
    });

    setTimeout(() => {
      headline.querySelectorAll('span').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      });
      sub.querySelectorAll('span').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      });
    }, 100);
  }, [t, lang]);

  return (
    <section className="mb-16 reveal is-visible">
      <GlassCard className="p-8">
        <div className="hero-text-animated">
          <h1
            ref={headlineRef}
            className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4"
          />
          <div ref={subRef} className="text-xl font-light mt-2" />
        </div>
        <div className="mt-8 leading-relaxed">{t('summary_content_short')}</div>
      </GlassCard>
    </section>
  );
}
