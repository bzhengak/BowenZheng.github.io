interface TagChipProps {
  label: string;
}

/**
 * 紧凑型标签芯片
 * - 比 SkillTag 更小更精致, 用于项目/经历卡片的关键词标识
 * - HR 视角: 一眼看清每段经历/项目的核心领域
 */
export function TagChip({ label }: TagChipProps) {
  return (
    <span className="tag-chip">
      <span className="tag-chip-dot" />
      {label}
    </span>
  );
}
