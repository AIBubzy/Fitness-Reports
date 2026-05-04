import { Link } from "react-router-dom";
import { Dumbbell, Clock, ChevronRight, Flame } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Workout } from "@/lib/mock-data";

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <GlassCard variant="strong" className="overflow-hidden relative">
      <div
        className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-violet)" }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neon-violet">
          <Flame className="h-3 w-3" />
          Today's Session
        </div>
        <h3 className="mt-2 text-xl font-bold text-foreground">{workout.title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{workout.focus}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="tabular-nums">{workout.durationMin} min</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Dumbbell className="h-3.5 w-3.5" />
            <span className="tabular-nums">{workout.exercises.length} exercises</span>
          </span>
        </div>

        <Link
          to="/training/session/$workoutId"
          params={{ workoutId: workout.id }}
          className="mt-5 group flex items-center justify-between rounded-2xl px-5 py-3.5 font-semibold text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99]"
          style={{ background: "var(--gradient-hero)", boxShadow: "var(--glow-cyan)" }}
        >
          <span>Start Workout</span>
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </GlassCard>
  );
}
