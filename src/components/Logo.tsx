/** Original logo mark: a small neural network forming a path upward. */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
        <path d="M8 22 L16 16 L24 10" />
        <path d="M8 22 L16 24" />
        <path d="M16 16 L24 20" />
        <path d="M16 24 L24 20" />
        <path d="M8 12 L16 16" />
      </g>
      <circle cx="8" cy="22" r="2.6" fill="#fff" />
      <circle cx="8" cy="12" r="2.2" fill="#fff" />
      <circle cx="16" cy="16" r="2.6" fill="#fff" />
      <circle cx="16" cy="24" r="2.2" fill="#fff" />
      <circle cx="24" cy="20" r="2.2" fill="#fff" />
      <circle cx="24" cy="10" r="3.2" fill="var(--xp-bright)" />
    </svg>
  );
}
