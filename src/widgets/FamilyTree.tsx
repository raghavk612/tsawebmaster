import { useState } from 'react';

const rings = [
  { id: 'ai', name: 'Artificial intelligence', r: 150, color: 'var(--m1)', soft: '#EEEAFE', def: 'The whole field: any technique that lets computers act "smart", including old-school rule-based systems.', eg: 'Chess engines · route planners · spam filters' },
  { id: 'ml', name: 'Machine learning', r: 112, color: '#1F6FB2', soft: '#E3EFFA', def: 'AI that learns patterns from data instead of following hand-written rules.', eg: 'Recommendations · fraud detection · spam filters' },
  { id: 'dl', name: 'Deep learning', r: 76, color: 'var(--m2)', soft: '#E6F6F0', def: 'Machine learning with many-layered neural networks, great for images, sound, and language.', eg: 'Face unlock · voice assistants · translation' },
  { id: 'gen', name: 'Generative AI', r: 40, color: 'var(--m3)', soft: '#FDECEA', def: 'Deep-learning models that create new text, images, audio, or code.', eg: 'Chatbots · image generators · code assistants' },
];

export function FamilyTree() {
  const [sel, setSel] = useState(3);
  const ring = rings[sel];
  return (
    <div className="widget-grid">
      <svg viewBox="0 0 320 320" className="family-svg" role="group" aria-label="AI family tree: nested circles">
        {rings.map((r, i) => (
          <g
            key={r.id}
            role="button"
            tabIndex={0}
            aria-pressed={sel === i}
            aria-label={r.name}
            className={`ring ${sel === i ? 'on' : ''} ${i <= sel ? 'lit' : ''}`}
            onClick={(e) => { e.stopPropagation(); setSel(i); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(i); } }}
          >
            <circle cx="160" cy={320 - r.r - 10} r={r.r} fill={sel === i ? r.soft : '#fff'} stroke={r.color} strokeWidth={sel === i ? 5 : 2.5} />
            <text x="160" y={320 - 2 * r.r - 10 + (i === 3 ? 44 : 24)} textAnchor="middle" fontSize={i === 3 ? 13 : 14} fontWeight="700" fill={r.color}>
              {i === 3 ? 'Gen AI' : r.name}
            </text>
          </g>
        ))}
      </svg>
      <div className="widget-side" aria-live="polite">
        <p className="eyebrow" style={{ color: ring.color, marginBottom: 4 }}>Tap a circle</p>
        <h3 style={{ color: ring.color }}>{ring.name}</h3>
        <p>{ring.def}</p>
        <p className="muted" style={{ fontSize: 15 }}><strong>Examples:</strong> {ring.eg}</p>
        {sel > 0 && (
          <p className="feedback info" style={{ marginTop: 8 }}>
            Every {ring.name.toLowerCase()} system is also {rings[sel - 1].name.toLowerCase()}, but not the other way around.
          </p>
        )}
      </div>
    </div>
  );
}
