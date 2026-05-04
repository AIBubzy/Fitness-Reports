import { Check, Clock, Flame, Minus, Replace, X } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Meal, MealStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusConfig: Record<MealStatus, { label: string; cls: string; Icon: typeof Check }> = {
  planned: { label: "Planned", cls: "text-muted-foreground border-glass-border", Icon: Clock },
  eaten: { label: "Eaten", cls: "text-neon-emerald border-neon-emerald/40 bg-neon-emerald/10", Icon: Check },
  partial: { label: "Partial", cls: "text-neon-amber border-neon-amber/40 bg-neon-amber/10", Icon: Minus },
  skipped: { label: "Skipped", cls: "text-destructive border-destructive/40 bg-destructive/10", Icon: X },
  substituted: { label: "Subbed", cls: "text-neon-violet border-neon-violet/40 bg-neon-violet/10", Icon: Replace },
};

export function MealCard({ meal, onClick }: { meal: Meal; onClick?: () => void }) {
  const s = statusConfig[meal.status];
  return (
    <GlassCard
      onClick={onClick}
      className="cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{meal.type}</span>
            <span className="opacity-40">•</span>
            <span>{meal.time}</span>
          </div>
          <h3 className="mt-1 text-base font-semibold text-foreground truncate">{meal.title}</h3>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 text-foreground/90">
              <Flame className="h-3.5 w-3.5 text-neon-amber" />
              <span className="tabular-nums font-medium">{meal.macros.calories}</span>
            </span>
            <span className="text-macro-protein font-medium tabular-nums">P {meal.macros.protein}g</span>
            <span className="text-macro-carbs font-medium tabular-nums">C {meal.macros.carbs}g</span>
            <span className="text-macro-fats font-medium tabular-nums">F {meal.macros.fats}g</span>
          </div>
        </div>
        <div
          className={cn(
            "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border",
            s.cls,
          )}
        >
          <s.Icon className="h-3 w-3" />
          {s.label}
        </div>
      </div>
    </GlassCard>
  );
}
