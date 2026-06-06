interface SkillTagProps {
  label: string;
  variant?: 'blue' | 'gray';
  className?: string;
}

export function SkillTag({ label, variant = 'blue', className = '' }: SkillTagProps) {
  return (
    <span className={`skill-tag ${variant === 'gray' ? 'skill-tag--gray' : ''} ${className}`}>
      {label}
    </span>
  );
}
