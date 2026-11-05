import { useEffect, useState, type KeyboardEvent } from 'react';
import { useI18n } from '../../i18n/I18nProvider';

interface TermLine {
  cls: 'in' | 'out';
  text: string;
}

/**
 * 终端自述卡
 * - 逐行打字动画, 全部 8 行 ≈ 5 秒打完 (按字符数占比分配时间片)
 * - 点击 / 回车可重播; 语言切换时随 key={lang} 重挂载自动重播
 * - reduced-motion: 直接静态呈现全部行
 */
export function TerminalCard() {
  const { t, lang } = useI18n();
  const [display, setDisplay] = useState<TermLine[]>([]);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const pairs: [string, string][] = [
      [t('term_l1_in'), t('term_l1_out')],
      [t('term_l2_in'), t('term_l2_out')],
      [t('term_l3_in'), t('term_l3_out')],
      [t('term_l4_in'), t('term_l4_out')],
    ];

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setDisplay(
        pairs.flatMap(([a, b]) => [
          { cls: 'in' as const, text: a },
          { cls: 'out' as const, text: b },
        ])
      );
      setActiveIdx(-1);
      return;
    }

    const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    // 纯打字预算 4200ms + 行间停顿 + 起手 340ms ≈ 5s
    const TYPE_BUDGET = 4200;
    const lens = pairs.flatMap(p => [p[0].length, p[1].length]);
    const sum = lens.reduce((a, b) => a + b, 0) || 1;

    const run = async () => {
      setDisplay([]);
      setActiveIdx(-1);
      await wait(340);
      if (cancelled) return;

      for (const [cmd, out] of pairs) {
        for (const [cls, text] of [['in', cmd], ['out', out]] as Array<['in' | 'out', string]>) {
          if (cancelled) return;
          const slice = (text.length / sum) * TYPE_BUDGET;
          const per = Math.max(6, slice / Math.max(text.length, 1));

          setDisplay(prev => [...prev, { cls, text: '' }]);
          setActiveIdx(idx => idx + 1);

          for (let i = 1; i <= text.length; i++) {
            if (cancelled) return;
            const filled = text.slice(0, i);
            setDisplay(prev => {
              const next = prev.slice();
              const last = next[next.length - 1];
              if (last) next[next.length - 1] = { cls, text: filled };
              return next;
            });
            await wait(per);
          }

          await wait(cls === 'in' ? 70 : 120);
          if (cancelled) return;
        }
      }
      setActiveIdx(-1);
    };

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, runId]);

  const replay = () => setRunId(v => v + 1);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      replay();
    }
  };

  return (
    <div
      className="bcard term"
      role="button"
      tabIndex={0}
      title={t('term_replay')}
      aria-label={t('term_replay')}
      onClick={replay}
      onKeyDown={onKeyDown}
    >
      <div className="term-head">
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <span>{t('term_title')}</span>
      </div>
      <div className="term-body">
        {display.map((l, i) => (
          <div key={i} className={`term-line term-line--${l.cls}`}>
            {l.text}
            {i === activeIdx && <span className="term-caret" aria-hidden="true" />}
          </div>
        ))}
        {display.length === 0 && (
          <div className="term-line term-line--in">
            <span className="term-caret" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
