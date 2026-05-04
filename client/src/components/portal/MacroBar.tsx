import { cn } from "@/lib/utils";

interface MacroBarProps {
  label: string;
  consumed: number;
  target: number;
  unit?: string;
  color: "protein" | "carbs" | "fats" | "water" | "primary";
}

const colorMap = {
  protein: "var(--macro-protein)",
  carbs: "var(--macro-carbs)",
  fats: "var(--macro-fats)",
  water: "var(--macro-water)",
  primary: "var(--neon-cyan)",
};

export function MacroBar({ label, consumed, target, unit = "g", color }: MacroBarProps) {
  const pct = Math.min(100, Math.round((consumed / target) * 100));
  const c = colorMap[color];

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="tabular-nums text-foreground/90">
          <span className="font-semibold">{consumed}</span>
          <span className="text-muted-foreground/70">/{target}{unit}</span>
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-glass-border overflow-hidden">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-700")}
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${c} 0%, ${c} 100%)`,
            boxShadow: `0 0 12px ${c}`,
          }}
        />
      </div>
    </div>
  );
}
