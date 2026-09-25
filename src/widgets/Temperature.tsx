import { useState } from 'react';
import { Dices, RotateCcw } from 'lucide-react';
import { sample, withTemperature } from './math';

const words = ['play', 'read', 'sleep', 'code', 'juggle'];
const base = [0.4, 0.25, 0.18, 0.12, 0.05];

export function Temperature() {
  const [t, setT] = useState(1);
  const [outs, setOuts] = useState<string[]>([]);
  const probs = withTemperature(base, t);
  const gen = () => setOuts((o) => [...o, words[sample(probs, Math.random())]].slice(-10));
  const mood = t < 0.5 ? 'Predictable: nearly always picks the top word.' : t > 1.4 ? 'Wild: rare words show up a lot more often.' : 'Balanced: usually likely words, with some variety.';

  return (
    <div>
      <p className="context" style={{ fontSize: 22 }}>
        After school I like to <mark>{outs[outs.length - 1] ?? '___'}</mark>
      </p>
      <label className="slider-row">
        <span>Temperature</span>
        <input type="range" min={0.2} max={2} step={0.1} value={t} onChange={(e) => setT(Number(e.target.value))} aria-valuetext={t.toFixed(1)} />
        <output>{t.toFixed(1)}</output>
      </label>
      <p className="muted" style={{ marginTop: -4 }}>{mood}</p>
      <div aria-label="Next-word probabilities">
        {words.map((w, i) => (
          <div className="prob-row" key={w}>
            <strong>{w}</strong>
            <div className="bar"><span style={{ width: `${probs[i] * 100}%` }} /></div>
            <span>{Math.round(probs[i] * 100)}%</span>
          </div>
        ))}
      </div>
      <div className="btn-row" style={{ marginTop: 16 }}>
        <button className="btn btn-primary" onClick={gen}><Dices size={18} aria-hidden="true" /> Generate a word</button>
        <button className="btn btn-ghost" onClick={() => { for (let i = 0; i < 10; i++) setOuts((o) => [...o, words[sample(withTemperature(base, t), Math.random())]].slice(-10)); }}>
          Generate 10
        </button>
        {outs.length > 0 && <button className="btn btn-ghost" onClick={() => setOuts([])}><RotateCcw size={16} aria-hidden="true" /> Clear</button>}
      </div>
      {outs.length > 0 && (
        <div className="chips" style={{ marginTop: 12 }} aria-live="polite" aria-label="Generated words">
          {outs.map((w, i) => <span className="chip pop" key={`${i}-${w}`}>{w}</span>)}
        </div>
      )}
      <p className="muted" style={{ fontSize: 14, marginTop: 12, marginBottom: 0 }}>
        Chatbots roll weighted dice like this for every token. "Temperature" is a real setting in many AI tools. Probabilities here are illustrative.
      </p>
    </div>
  );
}
