import { useI18n } from '../../i18n/I18nProvider';
import { GlassCard } from '../ui/GlassCard';
import { Collapsible } from '../ui/Collapsible';
import { projects, type ProjectItem } from '../../data/content';
import { useReveal } from '../../hooks/useReveal';

interface ProjectCardProps {
  item: ProjectItem;
  index: number;
}

function ProjectCard({ item, index }: ProjectCardProps) {
  const { t } = useI18n();
  const ref = useReveal<HTMLDivElement>();
  const delayClass = index > 0 ? `reveal-delay-${Math.min(index, 4)}` : '';
  return (
    <GlassCard
      ref={ref}
      className={`p-8 reveal ${delayClass}`}
      tilt
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold">{t(item.titleKey)}</h3>
        <div className="flex items-center space-x-3">
          <span className="text-xs bg-white/5 px-3 py-1 rounded-full font-semibold hidden md:inline-block">
            {item.period}
          </span>
          {item.githubUrl && (
            <a href={item.githubUrl} target="_blank" rel="noreferrer noopener" className="social-icon text-xl">
              <i className="ri-github-line" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm text-accent font-semibold mb-4">{t(item.summaryKey)}</p>
      <Collapsible
        trigger={null}
        details={
          <ul className="list-disc list-inside text-[15px] font-light space-y-2 pt-2 mt-2 border-t border-white/5">
            {item.details.map(dKey => (
              <li key={dKey}>{t(dKey)}</li>
            ))}
          </ul>
        }
      />
    </GlassCard>
  );
}

export function Projects() {
  const { t } = useI18n();
  return (
    <section id="projects" className="mb-16">
      <h2 className="text-4xl font-bold mb-8 tracking-tight">{t('proj_title')}</h2>
      <div className="space-y-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.titleKey} item={p} index={i} />
        ))}
      </div>
    </section>
  );
}
