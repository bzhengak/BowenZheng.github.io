import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nProvider';
import { SectionHeader } from '../ui/SectionHeader';
import { TagChip } from '../ui/TagChip';
import { GlassCard } from '../ui/GlassCard';
import { useTilt } from '../../hooks/useTilt';
import { projects, type ProjectItem } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

/** 竖排项目卡 (移动端 / reduced-motion / 打印回退) */
function ProjectCard({ item, index }: { item: ProjectItem; index: number }) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const delayClass = index > 0 ? `reveal-delay-${Math.min(index, 4)}` : '';
  const rest = item.details.slice(1);

  return (
    <GlassCard
      ref={ref}
      className={`p-8 reveal ${delayClass}`}
      tilt={index < 2}
    >
      <div className="flex justify-between items-start mb-2 gap-3 flex-wrap">
        <h3 className="text-xl font-semibold font-display tracking-tight">{t(item.titleKey)}</h3>
        <div className="flex items-center gap-3">
          <span className="period-pill">{item.period}</span>
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="social-icon text-xl"
              aria-label="GitHub"
            >
              <i className="ri-github-line" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm font-semibold mb-4" style={{ color: 'var(--accent)' }}>
        {t(item.summaryKey)}
      </p>

      <ul className="detail-list">
        <li>{t(item.details[0])}</li>
      </ul>

      <div
        id={detailsId}
        className={`collapsible-wrapper ${open ? 'is-expanded' : ''}`}
        aria-hidden={!open}
      >
        <div className="collapsible-inner">
          <ul className="detail-list collapsible-content">
            {rest.map(dKey => (
              <li key={dKey}>{t(dKey)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center flex-wrap gap-2 mt-4">
        <div className="chip-row" style={{ justifyContent: 'flex-start' }}>
          {item.tags?.map(tag => <TagChip key={tag} label={tag} />)}
        </div>
        {rest.length > 0 && (
          <button
            type="button"
            className="btn-pill"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls={detailsId}
          >
            <span>{open ? t('exp_less') : t('exp_more')}</span>
            <i
              className="ri-arrow-down-s-line transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        )}
      </div>
    </GlassCard>
  );
}

/** 横向滚动项目卡 (吸顶驱动画) */
function HCard({ item }: { item: ProjectItem }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { ref, onMouseMove, onMouseLeave } = useTilt(3);
  const rest = item.details.slice(1);

  return (
    <div
      ref={ref}
      className="hcard"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="hcard-top">
        <span className="period-pill">{item.period}</span>
        {item.githubUrl && (
          <a
            href={item.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="social-icon text-xl"
            aria-label="GitHub"
          >
            <i className="ri-github-line" />
          </a>
        )}
      </div>

      <h3 className="hcard-title">{t(item.titleKey)}</h3>
      <p className="hcard-sum">{t(item.summaryKey)}</p>

      <ul className="detail-list">
        <li>{t(item.details[0])}</li>
      </ul>

      <div
        id={detailsId}
        className={`collapsible-wrapper ${open ? 'is-expanded' : ''}`}
        aria-hidden={!open}
      >
        <div className="collapsible-inner">
          <ul className="detail-list collapsible-content">
            {rest.map(dKey => (
              <li key={dKey}>{t(dKey)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hcard-foot">
        <div className="chip-row" style={{ justifyContent: 'flex-start' }}>
          {item.tags?.map(tag => <TagChip key={tag} label={tag} />)}
        </div>
        {rest.length > 0 && (
          <button
            type="button"
            className="btn-pill"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls={detailsId}
          >
            <span>{open ? t('exp_less') : t('exp_more')}</span>
            <i
              className="ri-arrow-down-s-line transition-transform duration-300"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Projects — P2 Pinned Horizontal Scroll
 * - 桌面 (≥1024px 且未开 reduced-motion): 区块吸顶, 滚动驱动轨道横移 + 速度歪斜
 * - 其他情形自动回退为竖排卡片
 */
export function Projects() {
  const { t, lang } = useI18n();
  const [pinned, setPinned] = useState(false);

  const hsecRef = useRef<HTMLDivElement | null>(null);
  const htrackRef = useRef<HTMLDivElement | null>(null);
  const hprogRef = useRef<HTMLSpanElement | null>(null);

  // 视口判定: ≥1024px 且未开 reduced-motion 才启用吸顶横卷
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update = () => setPinned(mq.matches && !reduced);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // 区块总高 = 视口高 + 轨道可横移距离 (被吸住的"滚动距离")
  useLayoutEffect(() => {
    if (!pinned) return;
    const sec = hsecRef.current;
    const track = htrackRef.current;
    if (!sec || !track) return;

    let raf = 0;
    const calc = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const maxX = Math.max(0, track.scrollWidth - window.innerWidth);
        sec.style.height = `${Math.round(window.innerHeight + maxX)}px`;
      });
    };
    calc();
    const t1 = window.setTimeout(calc, 600); // 字体/图片加载后再校准
    window.addEventListener('resize', calc);
    return () => {
      window.clearTimeout(t1);
      window.removeEventListener('resize', calc);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, lang]);

  // 滚动驱动: 轨道横移 + 速度歪斜 (jelly skew)
  useEffect(() => {
    if (!pinned) return;
    const sec = hsecRef.current;
    const track = htrackRef.current;
    const prog = hprogRef.current;
    if (!sec || !track) return;

    let raf = 0;
    let lastY = window.scrollY;
    let vel = 0;

    const loop = () => {
      raf = 0;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      if (total > 0) {
        const p = Math.min(Math.max(-rect.top / total, 0), 1);
        const maxX = Math.max(0, track.scrollWidth - window.innerWidth);

        const dy = window.scrollY - lastY;
        lastY = window.scrollY;
        vel = vel * 0.8 + dy * 0.2;
        const skew = Math.max(-6, Math.min(6, vel * 0.07));

        track.style.transform = `translate3d(${(-p * maxX).toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;

        if (prog) {
          const idx = Math.min(
            projects.length,
            Math.max(1, 1 + Math.round(p * (projects.length - 1)))
          );
          prog.textContent = `${String(idx).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
        }
      }

      // 歪斜自主衰减: 滚动停止后继续回弹直到静止
      if (Math.abs(vel) > 0.15) raf = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(loop);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (track) track.style.transform = '';
    };
  }, [pinned, lang]);

  return (
    <section id="projects" className="section">
      <SectionHeader index="05" labelKey="nav_projects" titleKey="proj_title" />

      {pinned ? (
        <div className="hsec" ref={hsecRef}>
          <div className="hsticky">
            <div className="hpin-head">
              <span className="pin-kicker">05 · {t('nav_projects')}</span>
            </div>
            <div className="htrack" ref={htrackRef}>
              <div className="hintro" aria-hidden="true">
                <i className="ri-mouse-line" aria-hidden="true" />
                <span>{t('proj_pin_hint')}</span>
              </div>
              {projects.map(p => (
                <HCard key={p.titleKey} item={p} />
              ))}
            </div>
            <div className="hmeta">
              <span className="hprog" ref={hprogRef}>
                01 / {String(projects.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="proj-list">
          {projects.map((p, i) => (
            <ProjectCard key={p.titleKey} item={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
