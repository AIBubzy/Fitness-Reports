interface AdherenceRingProps {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function AdherenceRing({
  value,
  size = 160,
  stroke = 12,
  label,
  sublabel,
}: AdherenceRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const id = `ring-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-60"
        style={{ background: "radial-gradient(circle, var(--neon-cyan) 0%, transparent 70%)" }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--neon-cyan)" />
            <stop offset="100%" stopColor="var(--neon-violet)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="oklch(1 0 0 / 6%)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s var(--ease-smooth)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-gradient-hero">{value}%</span>
        {label && <span className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</span>}
        {sublabel && <span className="text-[10px] text-muted-foreground/70 mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}
