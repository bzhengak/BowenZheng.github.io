import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';
import { Collapsible } from '../ui/Collapsible';
import { experiences, type ExperienceItem, type ExperienceProject } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

interface ExperienceBlockProps {
  exp: ExperienceItem;
  index: number;
}

function ExperienceBlock({ exp, index }: ExperienceBlockProps) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  return (
    <GlassCard
      ref={ref}
      className={`p-8 reveal ${index > 0 ? 'mt-6' : 'mb-6'}`}
      tilt
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-xl font-semibold">{exp.company}</h3>
        <span className="text-xs bg-white/5 px-3 py-1 rounded-full font-semibold whitespace-nowrap ml-4">
          {exp.period}
        </span>
      </div>
      <p className="text-sm text-secondary mb-6 italic font-medium">{t(exp.roleKey)}</p>
      <div className="space-y-4">
        {exp.projects.map((proj, pi) => (
          <ProjectSubItem key={proj.titleKey} proj={proj} delayIndex={pi + 1} />
        ))}
      </div>
    </GlassCard>
  );
}

interface ProjectSubItemProps {
  proj: ExperienceProject;
  delayIndex: number;
}

function ProjectSubItem({ proj, delayIndex }: ProjectSubItemProps) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`bg-white/5 rounded-2xl p-5 border border-white/5 reveal reveal-delay-${Math.min(delayIndex, 4)}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-md font-semibold">{t(proj.titleKey)}</h4>
        <span className="text-sm font-semibold text-secondary">
          {/* 子项不需要独立按钮, 由 Collapsible 处理 */}
        </span>
      </div>
      <Collapsible
        trigger={null}
        tags={proj.tags}
        details={
          <ul className="list-disc list-inside text-[15px] font-light space-y-2 pt-2 mt-2 border-t border-white/5">
            {proj.details.map(dKey => (
              <li key={dKey}>{t(dKey)}</li>
            ))}
          </ul>
        }
      />
    </div>
  );
}

export function Experience() {
  const { t } = useI18n();
  return (
    <section id="experience" className="mb-16">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{t('exp_title')}</h2>
      {experiences.map((exp, i) => (
        <ExperienceBlock key={exp.company} exp={exp} index={i} />
      ))}
    </section>
  );
}
