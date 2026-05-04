import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "../components/portal/AppShell";
import { GlassCard } from "../components/portal/GlassCard";
import { AdherenceRing } from "../components/portal/AdherenceRing";
import { MacroBar } from "../components/portal/MacroBar";
import { MealCard } from "../components/portal/MealCard";
import { WorkoutCard } from "../components/portal/WorkoutCard";
import { StreakCard } from "../components/portal/StreakCard";
import { adherence, dailyTargets, insight, profile, todaysMeals, todaysWorkout } from "../lib/mock-data";
import { Quote, RefreshCw } from "lucide-react";
import axios from "axios";

// This will eventually pull real data based on the :id param
export default function ClientPortal() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [errorIndicator, setErrorIndicator] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const res = await axios.get(`/api/client/${id}`);
        // Destructure server mapping
        const { name, goal, aiPlans, macros } = res.data.data;
        
        // Safety Fallback (for old static plans without AI generation strings)
        const mealsSafe = aiPlans?.mealPlan?.[0] ? aiPlans.mealPlan[0].slice(1).map((m, i) => ({
            id: `meal-${i}`, type: i === 0 ? "Breakfast" : i === 1 ? "Snack 1" : i === 2 ? "Lunch" : i === 3 ? "Snack 2" : "Dinner",
            name: m, status: "pending", target: "Macros aligned"
        })) : todaysMeals;
        
        const workoutSafe = aiPlans?.trainingPlan?.[0] ? {
            id: "w1", title: aiPlans.trainingPlan[0].day, focus: (goal || '').replace('_',' '), duration: "45-60 min", status: "pending",
            movements: aiPlans.trainingPlan[0].exercises.map((ex, j) => ({ id: `ex-${j}`, name: ex[0], type: "strength", target: `${ex[1]} sets x ${ex[2]}` }))
        } : todaysWorkout;

        const calParams = { consumed: 0, target: macros?.calories || 2000 };

        setClientData({
            profile: { firstName: name.split(' ')[0], goal: (goal || 'General').replace('_', ' ').toUpperCase(), phase: "PHASE 1" },
            insight: `Based on Visual AI analysis, your estimated body fat is around ${aiPlans?.bodyFat || 'N/A'}. Stick to the ${calParams.target}kcal target.`,
            adherence: { todayScore: 0, streak: 0, weekScore: 0, tier: 'unranked' },
            dailyTargets: {
                calories: calParams, protein: { consumed: 0, target: macros?.macros?.protein || 150 },
                carbs: { consumed: 0, target: macros?.macros?.carbs || 150 }, fats: { consumed: 0, target: macros?.macros?.fats || 60 },
                hydrationMl: { consumed: 0, target: 3000 }
            },
            todaysMeals: mealsSafe,
            todaysWorkout: workoutSafe
        });
        setLoading(false);
      } catch (e) {
        setErrorIndicator(true);
        setLoading(false);
      }
    };
    fetchClientData();
  }, [id]);

  if (errorIndicator) {
     return <div className="text-center text-white mt-20">Link Expired or Invalid Protocol Matrix.</div>;
  }
  
  if (loading || !clientData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <RefreshCw className="animate-spin mb-4 text-neon-cyan" size={40} />
        <p className="font-heading uppercase tracking-widest text-sm text-white/50">Waking up Neural Engine...</p>
      </div>
    );
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell>
      {/* Hero */}
      <section className="animate-float-up text-white">
        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">{dateLabel}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          {greeting},{" "}
          <span className="text-gradient-hero">{clientData.profile.firstName}</span>
        </h1>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 glass text-xs font-medium border border-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]" />
          {clientData.profile.goal}
        </div>
      </section>

      {/* Adherence ring */}
      <GlassCard className="flex items-center gap-5 animate-float-up text-white" style={{ animationDelay: "60ms", border: '1px solid rgba(255,255,255,0.1)' }}>
        <AdherenceRing value={clientData.adherence.todayScore} label="Today" sublabel="execution" />
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-white/50">Coach Insight</p>
          <p className="mt-1 text-sm text-white/90 leading-relaxed line-clamp-4">
            <Quote className="inline h-3 w-3 text-neon-cyan -translate-y-2 mr-1" />
            {clientData.insight}
          </p>
        </div>
      </GlassCard>

      {/* Daily targets */}
      <GlassCard className="animate-float-up text-white/90" style={{ animationDelay: "120ms", border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Daily Targets</h2>
          <span className="text-xs tabular-nums text-white/70">
            <span className="font-semibold text-white">{clientData.dailyTargets.calories.consumed}</span>
            <span className="text-white/50"> / {clientData.dailyTargets.calories.target} kcal</span>
          </span>
        </div>
        <div className="space-y-3">
          <MacroBar label="Protein" consumed={clientData.dailyTargets.protein.consumed} target={clientData.dailyTargets.protein.target} color="protein" />
          <MacroBar label="Carbs" consumed={clientData.dailyTargets.carbs.consumed} target={clientData.dailyTargets.carbs.target} color="carbs" />
          <MacroBar label="Fats" consumed={clientData.dailyTargets.fats.consumed} target={clientData.dailyTargets.fats.target} color="fats" />
          <MacroBar label="Water" consumed={clientData.dailyTargets.hydrationMl.consumed} target={clientData.dailyTargets.hydrationMl.target} unit="ml" color="water" />
        </div>
      </GlassCard>

      {/* Today's workout */}
      <div className="animate-float-up text-white" style={{ animationDelay: "180ms" }}>
        <WorkoutCard workout={clientData.todaysWorkout} />
      </div>

      {/* Today's meals */}
      <section className="animate-float-up text-white" style={{ animationDelay: "240ms" }}>
        <div className="flex items-baseline justify-between mb-3 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Today's Meals</h2>
          <span className="text-xs text-white/50 tabular-nums">
            {clientData.todaysMeals.filter((m) => m.status === "eaten").length} / {clientData.todaysMeals.length}
          </span>
        </div>
        <div className="space-y-3">
          {clientData.todaysMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </section>

      {/* Streak */}
      <div className="animate-float-up text-white" style={{ animationDelay: "300ms" }}>
        <StreakCard streak={clientData.adherence.streak} weekScore={clientData.adherence.weekScore} tier={clientData.adherence.tier} />
      </div>
    </AppShell>
  );
}
