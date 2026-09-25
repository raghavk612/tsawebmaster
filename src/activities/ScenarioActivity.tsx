import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { ScenarioActivity as Cfg } from '../data/types';
import { type ActivityProps, Feedback, ScoreLine } from './shared';

export function ScenarioActivity({ config, onComplete }: ActivityProps<Cfg>) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [done, setDone] = useState(false);
  const sc = config.scenarios[i];

  const choose = (k: number) => {
    if (pick !== null) return;
    setPick(k);
    if (sc.options[k].best) setBest((b) => b + 1);
  };
  const next = () => {
    if (i + 1 < config.scenarios.length) {
      setI(i + 1);
      setPick(null);
    } else {
      setDone(true);
      onComplete(best / config.scenarios.length);
    }
  };

  if (done) {
    return (
      <div>
        <ScoreLine right={best} total={config.scenarios.length} noun="best choices" />
        <button
          className="btn btn-secondary"
          style={{ marginTop: 'var(--s3)' }}
          onClick={() => {
            setI(0);
            setPick(null);
            setBest(0);
            setDone(false);
          }}
        >
          <RotateCcw size={18} aria-hidden="true" /> Replay scenarios
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: 4 }}>
        Situation {i + 1} of {config.scenarios.length}
      </p>
      <p className="quiz-q" id={`sc-${i}`}>{sc.situation}</p>
      <div className="choices" role="group" aria-labelledby={`sc-${i}`}>
        {sc.options.map((o, k) => {
          const state = pick === null ? '' : o.best ? 'correct' : k === pick ? 'wrong' : '';
          return (
            <button key={k} className={`choice ${state}`} aria-pressed={pick === k} disabled={pick !== null} onClick={() => choose(k)}>
              <span className="key" aria-hidden="true">{String.fromCharCode(65 + k)}</span>
              {o.text}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <>
          <div role="status">
            <Feedback tone={sc.options[pick].best ? 'ok' : 'bad'}>
              <strong>{sc.options[pick].best ? 'Great call. ' : 'Think again. '}</strong>
              {sc.options[pick].feedback}
            </Feedback>
            {!sc.options[pick].best && (
              <Feedback tone="info">
                <strong>Best choice: </strong>
                {sc.options.find((o) => o.best)?.feedback}
              </Feedback>
            )}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'var(--s4)' }} onClick={next}>
            {i + 1 < config.scenarios.length ? 'Next situation' : 'Finish'} <ArrowRight size={18} aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );
}
