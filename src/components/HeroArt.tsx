import type { ReactElement } from 'react';

/** Original illustration: a neural network whose nodes are the three module colors,
 * with an XP "path" winding through it. Pure SVG, no external assets. */
export function HeroArt() {
  const layers = [
    [70, 150, 230, 310],
    [110, 190, 270],
    [80, 160, 240, 320],
    [190],
  ];
  const xs = [60, 170, 280, 390];
  const colors = ['var(--m1)', 'var(--m2)', 'var(--m3)', 'var(--xp-bright)'];
  const lines: ReactElement[] = [];
  layers.forEach((ys, li) => {
    if (li === layers.length - 1) return;
    ys.forEach((y1, a) =>
      layers[li + 1].forEach((y2, b) =>
        lines.push(
          <line key={`${li}-${a}-${b}`} x1={xs[li]} y1={y1} x2={xs[li + 1]} y2={y2} stroke="var(--line)" strokeWidth="2" />,
        ),
      ),
    );
  });
  return (
    <svg className="hero-art" viewBox="0 0 450 380" role="img" aria-label="Illustration of a neural network with a glowing path through it">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--xp-bright)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--xp-bright)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="390" cy="190" r="70" fill="url(#glow)" />
      {lines}
      <path
        d="M60 230 L170 190 L280 240 L390 190"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="10 10"
      />
      {layers.map((ys, li) =>
        ys.map((y, i) => (
          <circle
            key={`n${li}-${i}`}
            cx={xs[li]}
            cy={y}
            r={li === 3 ? 30 : 17}
            fill={li === 3 ? colors[3] : 'var(--surface)'}
            stroke={colors[li]}
            strokeWidth="5"
          />
        )),
      )}
      <path d="M378 190 l8 8 l16 -18" fill="none" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <g fontFamily="var(--font-head)" fontWeight="700" fontSize="14" fill="var(--ink-2)" textAnchor="middle">
        <text x="60" y="30">Learn</text>
        <text x="170" y="30">Practice</text>
        <text x="280" y="30">Reflect</text>
        <text x="390" y="30">Level up</text>
      </g>
    </svg>
  );
}
