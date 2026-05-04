import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, Dumbbell, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/today", label: "Today", Icon: Home },
  { to: "/nutrition", label: "Nutrition", Icon: UtensilsCrossed },
  { to: "/training", label: "Training", Icon: Dumbbell },
  { to: "/progress", label: "Progress", Icon: TrendingUp },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)] pointer-events-none"
      aria-label="Primary"
    >
      <div className="mx-auto max-w-md px-4 pb-3 pointer-events-auto">
        <div className="glass-strong rounded-3xl px-2 py-2 flex items-center justify-between">
          {tabs.map(({ to, label, Icon }) => {
            const active = path === to || (to === "/today" && path === "/");
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "relative flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-all duration-300",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span
                    className="absolute inset-0 rounded-2xl -z-10"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.85 0.19 195 / 18%), oklch(0.68 0.24 295 / 18%))",
                      boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 8%)",
                    }}
                  />
                )}
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} strokeWidth={active ? 2.4 : 1.8} />
                <span className={cn("text-[10px] font-medium tracking-wide", active && "text-gradient-hero font-semibold")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
