import { useMemo, useState } from 'react';
import { accuracyAt } from './math';

type P = { x: number; cls: 'a' | 'b' };
const mk = (xs: number[], cls: P['cls']): P[] => xs.map((x) => ({ x, cls }));
const train: P[] = [...mk([1.2, 2.0, 2.8, 3.5, 4.1, 5.6], 'a'), ...mk([4.8, 5.9, 6.5, 7.2, 8.0, 8.9], 'b')];
const test: P[] = [...mk([2.4, 4.4, 6.1], 'a'), ...mk([5.2, 7.7, 9.3], 'b')];
const best = Math.max(...Array.from({ length: 101 }, (_, i) => accuracyAt(train, i / 10)));

export function Threshold() {
  const [t, setT] = useState(2);
  const [showTest, setShowTest] = useState(false);
  const acc = accuracyAt(train, t);
  const testAcc = accuracyAt(test, t);
  const pts = useMemo(() => (showTest ? [...train.map((p) => ({ ...p, test: false })), ...test.map((p) => ({ ...p, test: true }))] : train.map((p) => ({ ...p, test: false }))), [showTest]);
  const X = (x: number) => 20 + (x / 10) * 560;

  return (
    <div>
      <p style={{ marginBottom: 8 }}>
        Your model’s rule: <strong>if sweetness &lt; {t.toFixed(1)} → 🍋 lemon, otherwise → 🍊 orange.</strong> Drag the slider to find the rule that makes the fewest mistakes.
      </p>
      <svg viewBox="0 0 600 150" className="threshold-svg" role="img" aria-label={`Fruits on a sweetness scale with the rule line at ${t.toFixed(1)}`}>
        <rect x={20} y={30} width={X(t) - 20} height={80} fill="#FFF7C2" />
        <rect x={X(t)} y={30} width={580 - X(t)} height={80} fill="#FFE4CC" />
        <line x1={20} y1={120} x2={580} y2={120} stroke="var(--line)" strokeWidth={2} />
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <text key={v} x={X(v)} y={140} textAnchor="middle" fontSize={12} fill="var(--ink-2)">{v}</text>
        ))}
        {pts.map((p, i) => {
          const wrong = (p.x < t ? 'a' : 'b') !== p.cls;
          const y = p.test ? 95 : 55;
          return (
            <g key={i}>
              <circle cx={X(p.x)} cy={y} r={15} fill={p.cls === 'a' ? '#F7D83C' : '#F59331'} stroke={wrong ? 'var(--bad)' : p.test ? 'var(--ink)' : 'none'} strokeWidth={wrong ? 4 : 2} strokeDasharray={p.test && !wrong ? '4 3' : undefined} />
              {wrong && <text x={X(p.x)} y={y + 5} textAnchor="middle" fontSize={16} fontWeight={700} fill="var(--bad)">✕</text>}
            </g>
          );
        })}
        <line x1={X(t)} y1={22} x2={X(t)} y2={118} stroke="var(--primary)" strokeWidth={4} strokeLinecap="round" />
        <text x={X(t)} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--primary)">rule</text>
      </svg>
      <label className="slider-row">
        <span>Sweetness cut-off</span>
        <input type="range" min={0} max={10} step={0.1} value={t} onChange={(e) => setT(Number(e.target.value))} aria-valuetext={`${t.toFixed(1)}`} />
        <output>{t.toFixed(1)}</output>
      </label>
      <div className="stat-row">
        <div className={`stat ${acc === best ? 'good' : ''}`}>
          <strong>{acc}/12</strong>
          <span>training fruits correct</span>
        </div>
        {showTest && (
          <div className="stat">
            <strong>{testAcc}/6</strong>
            <span>new (test) fruits correct</span>
          </div>
        )}
      </div>
      <div role="status" className={`feedback ${acc === best ? 'ok' : 'info'}`}>
        {acc === best
          ? `That’s the best any single cut-off can do: ${best}/12. Some lemons are sweeter than some oranges, so no rule is perfect. That’s normal for real data!`
          : 'Keep sliding: fruits with a red ✕ are on the wrong side of your rule.'}
      </div>
      <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setShowTest((s) => !s)} aria-pressed={showTest}>
        {showTest ? 'Hide test fruits' : 'Test it on 6 new fruits'}
      </button>
      {showTest && (
        <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
          Dashed fruits in the lower row are test data your rule never saw. A rule that’s great on training data isn’t always great on new data.
        </p>
      )}
    </div>
  );
}
