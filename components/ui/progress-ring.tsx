export function ProgressRing({ pct, size = 88 }: { pct: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {/* Colors come from the theme variables so the ring reads in light and dark mode. */}
      <circle cx={center} cy={center} r={r} fill="none" className="stroke-slate-800" strokeWidth="8" />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3ECF5E" />
          <stop offset="100%" stopColor="#22B8F0" />
        </linearGradient>
      </defs>
      <text
        x={center}
        y={center + 5}
        textAnchor="middle"
        fontSize="16"
        fontWeight={700}
        className="font-mono fill-slate-100"
      >
        {pct}%
      </text>
    </svg>
  );
}
