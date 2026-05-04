import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "outlined";
  glow?: "none" | "cyan" | "violet" | "emerald";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = "none", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-3xl p-5 transition-all duration-500",
          variant === "default" && "glass",
          variant === "strong" && "glass-strong",
          variant === "outlined" && "border border-glass-border bg-glass",
          glow === "cyan" && "glow-cyan",
          glow === "violet" && "glow-violet",
          glow === "emerald" && "glow-emerald",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
GlassCard.displayName = "GlassCard";
