import { useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { neuronFires } from './math';

const goals = {
  AND: { label: 'only when it’s sunny AND the weekend', target: (a: number, b: number) => a === 1 && b === 1 },
  OR: { label: 'when it’s sunny OR the weekend (or both)', target: (a: number, b: number) => a === 1 || b === 1 },
};

export function Neuron() {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(1);
  const [b, setB] = useState(0.5);
  const [sunny, setSunny] = useState(1);
  const [weekend, setWeekend] = useState(0);
  const [goal, setGoal] = useState<keyof typeof goals>('AND');
  const sum = sunny * w1 + weekend * w2 + b;
  const fires = sum > 0;
  const rows = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([x1, x2]) => {
    const out = neuronFires([x1, x2], [w1, w2], b);
    return { x1, x2, out, ok: out === goals[goal].target(x1, x2) };
  });
  const solved = rows.every((r) => r.ok);

  const slider = (label: string, v: number, set: (n: number) => void, min: number, max: number) => (
    <label className="slider-row">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={0.5} value={v} onChange={(e) => set(Number(e.target.value))} />
      <output>{v > 0 ? `+${v}` : v}</output>
    </label>
  );

  return (
    <div>
      <div className="seg" role="group" aria-label="Challenge" style={{ marginBottom: 12 }}>
        {(Object.keys(goals) as (keyof typeof goals)[]).map((g) => (
          <button key={g} className="choice" aria-pressed={goal === g} onClick={() => setGoal(g)}>Challenge: {g}</button>
        ))}
      </div>
      <p>
        <strong>Goal:</strong> make the neuron say “Go to the beach!” {goals[goal].label}. Tune the <em>weights</em> and <em>bias</em>.
      </p>
      <div className="neuron-grid">
        <div className="neuron-inputs">
          <button className={`toggle ${sunny ? 'on' : ''}`} aria-pressed={!!sunny} onClick={() => setSunny(sunny ? 0 : 1)}>☀️ Sunny: {sunny ? 'yes (1)' : 'no (0)'}</button>
          <button className={`toggle ${weekend ? 'on' : ''}`} aria-pressed={!!weekend} onClick={() => setWeekend(weekend ? 0 : 1)}>📅 Weekend: {weekend ? 'yes (1)' : 'no (0)'}</button>
        </div>
        <svg viewBox="0 0 200 120" className="neuron-svg" aria-hidden="true">
          <line x1="10" y1="30" x2="110" y2="60" stroke={w1 >= 0 ? 'var(--m2)' : 'var(--m3)'} strokeWidth={1 + Math.abs(w1) * 2.5} opacity={sunny ? 1 : 0.25} />
          <line x1="10" y1="90" x2="110" y2="60" stroke={w2 >= 0 ? 'var(--m2)' : 'var(--m3)'} strokeWidth={1 + Math.abs(w2) * 2.5} opacity={weekend ? 1 : 0.25} />
          <line x1="110" y1="60" x2="190" y2="60" stroke="var(--line)" strokeWidth="4" />
          <circle cx="110" cy="60" r="26" className={`neuron-body ${fires ? 'fire' : ''}`} />
          <text x="110" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill={fires ? '#fff' : 'var(--ink)'}>Σ</text>
        </svg>
        <div className={`neuron-out ${fires ? 'go' : ''}`} role="status">
          {fires ? '🏖️ Go to the beach!' : '🏠 Stay home'}
        </div>
      </div>
      <p className="equation" aria-live="polite">
        ({sunny} × {w1}) + ({weekend} × {w2}) + {b} = <strong>{sum.toFixed(1)}</strong> {fires ? '> 0 → fire' : '≤ 0 → no fire'}
      </p>
      {slider('Weight: sunny', w1, setW1, -2, 2)}
      {slider('Weight: weekend', w2, setW2, -2, 2)}
      {slider('Bias', b, setB, -3, 2)}
      <table className="truth">
        <caption className="sr-only">Check every situation</caption>
        <thead><tr><th>Sunny</th><th>Weekend</th><th>Neuron says</th><th>Goal met?</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.x1}${r.x2}`}>
              <td>{r.x1 ? 'yes' : 'no'}</td>
              <td>{r.x2 ? 'yes' : 'no'}</td>
              <td>{r.out ? 'Go' : 'Stay'}</td>
              <td>{r.ok ? <CircleCheck size={18} color="var(--ok)" aria-label="yes" /> : <CircleX size={18} color="var(--bad)" aria-label="no" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div role="status" className={`feedback ${solved ? 'ok' : 'info'}`}>
        {solved
          ? `Solved! You just "trained" a neuron by hand. Real networks adjust millions of weights like these automatically.`
          : `${rows.filter((r) => r.ok).length}/4 situations correct. Hint: the bias sets how much evidence the neuron needs before it fires.`}
      </div>
    </div>
  );
}
