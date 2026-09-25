import { useState } from 'react';
import { CircleCheck, CircleX, RotateCcw } from 'lucide-react';
import type { SpotActivity as Cfg } from '../data/types';
import { type ActivityProps, ScoreLine } from './shared';

export function SpotActivity({ config, onComplete }: ActivityProps<Cfg>) {
  const [flagged, setFlagged] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const right = config.sentences.filter((s, i) => s.wrong === flagged.includes(i)).length;

  const toggle = (i: number) => setFlagged((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  const check = () => {
    setChecked(true);
    onComplete(right / config.sentences.length);
  };

  return (
    <div>
      <div className="ai-answer">
        <p className="q">{config.question}</p>
        {config.sentences.map((s, i) => {
          const state = checked ? (s.wrong === flagged.includes(i) ? 'correct' : 'wrong') : '';
          return (
            <button key={i} className={`sentence ${state}`} aria-pressed={flagged.includes(i)} disabled={checked} onClick={() => toggle(i)}>
              {s.text}
            </button>
          );
        })}
      </div>
      {!checked ? (
        <div className="btn-row" style={{ marginTop: 'var(--s4)' }}>
          <button className="btn btn-primary" onClick={check}>
            Check my picks
          </button>
          <span className="muted">
            {flagged.length} sentence{flagged.length === 1 ? '' : 's'} flagged
          </span>
        </div>
      ) : (
        <>
          <ul className="explain-list">
            {config.sentences.map((s, i) => {
              const ok = s.wrong === flagged.includes(i);
              return (
                <li key={i} className={`feedback ${ok ? 'ok' : 'bad'}`}>
                  {ok ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
                  <span>
                    <strong>{s.wrong ? 'Error. ' : 'Accurate. '}</strong>
                    {s.why}
                  </span>
                </li>
              );
            })}
          </ul>
          <div style={{ marginTop: 'var(--s4)' }}>
            <ScoreLine right={right} total={config.sentences.length} noun="sentences judged correctly" />
          </div>
          <button
            className="btn btn-secondary"
            style={{ marginTop: 'var(--s3)' }}
            onClick={() => {
              setFlagged([]);
              setChecked(false);
            }}
          >
            <RotateCcw size={18} aria-hidden="true" /> Try again
          </button>
        </>
      )}
    </div>
  );
}
