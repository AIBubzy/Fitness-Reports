import { Flame, TrendingUp } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface StreakCardProps {
  streak: number;
  weekScore: number;
  tier: string;
}

export function StreakCard({ streak, weekScore, tier }: StreakCardProps) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div
        className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-emerald)" }}
      />
      <div className="relative grid grid-cols-3 gap-3">
        <div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Flame className="h-3 w-3 text-neon-amber" />
            Streak
          </div>
          <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">{streak}</div>
          <div className="text-[10px] text-muted-foreground/70">days</div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            <TrendingUp className="h-3 w-3 text-neon-emerald" />
            Week
          </div>
          <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">{weekScore}%</div>
          <div className="text-[10px] text-muted-foreground/70">adherence</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Tier</div>
          <div className="mt-1 text-lg font-bold text-gradient-hero">{tier}</div>
          <div className="text-[10px] text-muted-foreground/70">execution</div>
        </div>
      </div>
    </GlassCard>
  );
}
