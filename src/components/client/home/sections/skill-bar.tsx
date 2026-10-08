type SkillBarProps = {
  label: string;
  value: number;
};

function SkillBar({ label, value }: SkillBarProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between text-sm font-medium text-foreground-muted">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export { SkillBar };
