import { useState } from 'react';
import { CircleCheck, CircleX, RotateCcw } from 'lucide-react';
import type { SortActivity as Cfg } from '../data/types';
import { type ActivityProps, ScoreLine } from './shared';

export function SortActivity({ config, onComplete }: ActivityProps<Cfg>) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => config.items.map(() => null));
  const [checked, setChecked] = useState(false);
  const allAnswered = answers.every((a) => a !== null);
  const right = answers.filter((a, i) => a === config.items[i].bucket).length;

  const check = () => {
    setChecked(true);
    onComplete(right / config.items.length);
  };
  const reset = () => {
    setAnswers(config.items.map(() => null));
    setChecked(false);
  };

  return (
    <div>
      {config.items.map((item, i) => {
        const ok = answers[i] === item.bucket;
        return (
          <div className="sort-item" key={item.text} data-testid="sort-item">
            <p id={`sort-${i}`}>{item.text}</p>
            <div className="seg" role="group" aria-labelledby={`sort-${i}`}>
              {config.buckets.map((b, k) => {
                const state = checked ? (k === item.bucket ? 'correct' : k === answers[i] ? 'wrong' : '') : '';
                return (
                  <button
                    key={b}
                    className={`choice ${state}`}
                    aria-pressed={answers[i] === k}
                    disabled={checked}
                    onClick={() => setAnswers((a) => a.map((v, j) => (j === i ? k : v)))}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
            {checked && (
              <div className={`feedback ${ok ? 'ok' : 'bad'}`}>
                {ok ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
                <span>
                  <strong>{ok ? 'Correct. ' : `Answer: ${config.buckets[item.bucket]}. `}</strong>
                  {item.why}
                </span>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ marginTop: 'var(--s4)' }}>
        {checked ? (
          <>
            <ScoreLine right={right} total={config.items.length} />
            <div className="btn-row" style={{ marginTop: 'var(--s3)' }}>
              <button className="btn btn-secondary" onClick={reset}>
                <RotateCcw size={18} aria-hidden="true" /> Try again
              </button>
            </div>
          </>
        ) : (
          <div className="btn-row">
            <button className="btn btn-primary" onClick={check} disabled={!allAnswered}>
              Check answers
            </button>
            {!allAnswered && (
              <span className="muted">{answers.filter((a) => a === null).length} left to sort</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
