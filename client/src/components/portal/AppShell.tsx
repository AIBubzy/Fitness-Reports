import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  return (
    <div className="relative min-h-screen pb-28">
      <div className="mx-auto max-w-md px-5 pt-8">
        {(title || subtitle) && (
          <header className="mb-6 animate-float-up">
            {subtitle && (
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/80">{subtitle}</p>
            )}
            {title && (
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            )}
          </header>
        )}
        <div className="space-y-5">{children}</div>
      </div>
      <BottomNav />
    </div>
  );
}
