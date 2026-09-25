import { useState } from 'react';
import { simulatedAccuracy } from './math';

export function Bias() {
  const [share, setShare] = useState(10);
  const { a, b } = simulatedAccuracy(share);
  const gap = a - b;
  const dots = Array.from({ length: 40 }, (_, i) => (i < Math.round((share / 100) * 40) ? 'b' : 'a'));
  return (
    <div>
      <p>A face-recognition model is trained on 40,000 photos. Slide to change how many come from <strong className="grp-b">Group B</strong> vs. <strong className="grp-a">Group A</strong>.</p>
      <div className="dot-grid" aria-hidden="true">
        {dots.map((d, i) => <span key={i} className={`dot ${d}`} />)}
      </div>
      <label className="slider-row">
        <span>Group B share of training photos</span>
        <input type="range" min={5} max={50} step={5} value={share} onChange={(e) => setShare(Number(e.target.value))} aria-valuetext={`${share} percent`} />
        <output>{share}%</output>
      </label>
      <div className="bias-bars">
        {[{ label: 'Group A accuracy', v: a, cls: 'a' }, { label: 'Group B accuracy', v: b, cls: 'b' }].map((r) => (
          <div className="prob-row" key={r.label} style={{ gridTemplateColumns: '150px 1fr 48px' }}>
            <strong>{r.label}</strong>
            <div className={`bar ${r.cls}`}><span style={{ width: `${r.v}%` }} /></div>
            <span>{r.v}%</span>
          </div>
        ))}
      </div>
      <div role="status" className={`feedback ${gap > 10 ? 'bad' : gap > 3 ? 'info' : 'ok'}`}>
        {gap > 10
          ? `A ${gap}-point gap. The model works far worse for Group B because it barely saw them during training.`
          : gap > 3
            ? `The gap is shrinking (${gap} points). More representative data helps.`
            : 'Balanced data, balanced results. Real fixes also need testing each group separately.'}
      </div>
      <p className="muted" style={{ fontSize: 14, margin: '8px 0 0' }}>Simulated numbers that illustrate the pattern found in real audits like Gender Shades.</p>
    </div>
  );
}
