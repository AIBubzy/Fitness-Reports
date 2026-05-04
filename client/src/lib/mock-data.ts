// Mock data layer — mirrors planned API contracts.
// Replace with real API calls once Lovable Cloud backend is wired up.

export type MealStatus = "planned" | "eaten" | "partial" | "skipped" | "substituted";
export type WorkoutStatus = "not_started" | "in_progress" | "completed";

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Meal {
  id: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  title: string;
  time: string;
  macros: Macros;
  status: MealStatus;
  ingredients: { name: string; qty: string }[];
  instructions: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  type: "Compound" | "Isolation";
  sets: number;
  reps: string;
  restSeconds: number;
  cue: string;
}

export interface Workout {
  id: string;
  title: string;
  focus: string;
  durationMin: number;
  exercises: Exercise[];
  status: WorkoutStatus;
  completionPct: number;
}

export interface DailyTargets {
  calories: { target: number; consumed: number };
  protein: { target: number; consumed: number };
  carbs: { target: number; consumed: number };
  fats: { target: number; consumed: number };
  hydrationMl: { target: number; consumed: number };
  steps: { target: number; consumed: number };
}

export interface ClientProfile {
  firstName: string;
  lastName: string;
  goal: string;
  phase: string;
  startedAt: string;
  planVersion: string;
  coach: string;
}

export const profile: ClientProfile = {
  firstName: "Sarah",
  lastName: "Chen",
  goal: "Fat Loss Phase",
  phase: "Week 3 of 12",
  startedAt: "March 24, 2026",
  planVersion: "v2.1",
  coach: "Coach Marcus",
};

export const dailyTargets: DailyTargets = {
  calories: { target: 1850, consumed: 1240 },
  protein: { target: 165, consumed: 118 },
  carbs: { target: 180, consumed: 132 },
  fats: { target: 62, consumed: 41 },
  hydrationMl: { target: 3000, consumed: 1800 },
  steps: { target: 10000, consumed: 6420 },
};

export const todaysMeals: Meal[] = [
  {
    id: "m1",
    type: "Breakfast",
    title: "Greek Yogurt Power Bowl",
    time: "7:30 AM",
    macros: { calories: 420, protein: 38, carbs: 42, fats: 12 },
    status: "eaten",
    ingredients: [
      { name: "Greek yogurt 0%", qty: "250g" },
      { name: "Blueberries", qty: "80g" },
      { name: "Granola", qty: "30g" },
      { name: "Almond butter", qty: "15g" },
    ],
    instructions: "Layer yogurt, top with berries, granola, and a drizzle of almond butter.",
  },
  {
    id: "m2",
    type: "Lunch",
    title: "Grilled Chicken & Quinoa",
    time: "12:30 PM",
    macros: { calories: 540, protein: 48, carbs: 58, fats: 14 },
    status: "eaten",
    ingredients: [
      { name: "Chicken breast", qty: "180g" },
      { name: "Quinoa, cooked", qty: "150g" },
      { name: "Roasted veg mix", qty: "200g" },
      { name: "Olive oil", qty: "10ml" },
    ],
    instructions: "Grill chicken 6 min/side. Toss quinoa with veg and olive oil. Season generously.",
  },
  {
    id: "m3",
    type: "Snack",
    title: "Protein Smoothie",
    time: "4:00 PM",
    macros: { calories: 280, protein: 32, carbs: 24, fats: 6 },
    status: "planned",
    ingredients: [
      { name: "Whey isolate", qty: "30g" },
      { name: "Banana", qty: "1 medium" },
      { name: "Almond milk", qty: "300ml" },
    ],
    instructions: "Blend until smooth. Add ice for thickness.",
  },
  {
    id: "m4",
    type: "Dinner",
    title: "Salmon with Sweet Potato",
    time: "7:30 PM",
    macros: { calories: 610, protein: 47, carbs: 56, fats: 22 },
    status: "planned",
    ingredients: [
      { name: "Salmon fillet", qty: "180g" },
      { name: "Sweet potato", qty: "250g" },
      { name: "Asparagus", qty: "150g" },
    ],
    instructions: "Bake salmon 12 min at 200°C. Roast sweet potato wedges 25 min. Steam asparagus.",
  },
];

export const todaysWorkout: Workout = {
  id: "w1",
  title: "Upper Body Hypertrophy",
  focus: "Chest · Shoulders · Triceps",
  durationMin: 55,
  status: "not_started",
  completionPct: 0,
  exercises: [
    { id: "e1", name: "Incline Dumbbell Press", muscleGroup: "Chest", type: "Compound", sets: 4, reps: "8-10", restSeconds: 90, cue: "Drive elbows under wrists, control eccentric." },
    { id: "e2", name: "Seated Shoulder Press", muscleGroup: "Shoulders", type: "Compound", sets: 4, reps: "8-10", restSeconds: 90, cue: "Brace core, full lockout overhead." },
    { id: "e3", name: "Cable Chest Fly", muscleGroup: "Chest", type: "Isolation", sets: 3, reps: "12-15", restSeconds: 60, cue: "Squeeze at midline, slow stretch." },
    { id: "e4", name: "Lateral Raises", muscleGroup: "Shoulders", type: "Isolation", sets: 4, reps: "12-15", restSeconds: 45, cue: "Lead with elbows, no swinging." },
    { id: "e5", name: "Tricep Rope Pushdown", muscleGroup: "Triceps", type: "Isolation", sets: 3, reps: "12-15", restSeconds: 60, cue: "Lock elbows at sides, full extension." },
    { id: "e6", name: "Overhead Tricep Extension", muscleGroup: "Triceps", type: "Isolation", sets: 3, reps: "10-12", restSeconds: 60, cue: "Deep stretch overhead, controlled." },
  ],
};

export const weekSplit = [
  { day: "Mon", title: "Upper Hypertrophy", status: "completed" as const },
  { day: "Tue", title: "Lower Strength", status: "completed" as const },
  { day: "Wed", title: "Active Recovery", status: "completed" as const },
  { day: "Thu", title: "Upper Hypertrophy", status: "in_progress" as const },
  { day: "Fri", title: "Lower Hypertrophy", status: "not_started" as const },
  { day: "Sat", title: "Full Body Power", status: "not_started" as const },
  { day: "Sun", title: "Rest", status: "not_started" as const },
];

export const weeklyPlan = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  totals: { calories: 1850, protein: 165, carbs: 180, fats: 62 },
  meals: todaysMeals.length,
}));

export const adherence = {
  todayScore: 72,
  weekScore: 86,
  streak: 17,
  tier: "Precision",
  weeklyAdherence: [78, 84, 90, 88, 86, 92, 72],
};

export const insight =
  "You're hitting protein targets 6 days running — that consistency is what's driving the visible recomp. Push hydration up 400ml today to stay ahead of recovery.";
