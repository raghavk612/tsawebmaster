export function ProgressRing({
  pct,
  size = 64,
  stroke = 7,
  color = 'var(--primary)',
  label,
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
  label?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(1, pct));
  const text = label ?? `${Math.round(safe * 100)}%`;
  return (
    <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(safe * 100)}% complete`}>
      <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} />
      <circle
        className="ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - safe)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text className="ring-label" x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={size * 0.24}>
        {text}
      </text>
    </svg>
  );
}
