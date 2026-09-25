import { useMemo, useState } from 'react';
import { Brain, CircleCheck, CircleX, RotateCcw } from 'lucide-react';
import type { TrainSpamActivity as Cfg } from '../data/types';
import { type ActivityProps, Feedback } from './shared';
import { predict, trainModel } from './spamModel';

export function TrainSpamActivity({ config, onComplete }: ActivityProps<Cfg>) {
  const [labels, setLabels] = useState<(boolean | null)[]>(() => config.training.map(() => null));
  const [trained, setTrained] = useState(false);
  const allLabeled = labels.every((l) => l !== null);

  const model = useMemo(
    () => (trained ? trainModel(config.training.map((t, i) => ({ text: t.text, spam: labels[i] === true }))) : null),
    [trained, labels, config.training],
  );
  const results = model ? config.test.map((t) => ({ ...t, pred: predict(model, t.text) })) : [];
  const accuracy = results.filter((r) => r.pred.spam === r.spam).length;
  const labelErrors = labels.filter((l, i) => l !== config.training[i].spam).length;

  const train = () => {
    setTrained(true);
    const m = trainModel(config.training.map((t, i) => ({ text: t.text, spam: labels[i] === true })));
    const acc = config.test.filter((t) => predict(m, t.text).spam === t.spam).length;
    onComplete(acc / config.test.length);
  };

  return (
    <div>
      <h3 style={{ fontSize: 18 }}>Step 1 · Label the training data</h3>
      {config.training.map((t, i) => (
        <div className="msg" key={t.text} data-testid="train-msg">
          <p id={`tm-${i}`}>{t.text}</p>
          <div className="seg" role="group" aria-labelledby={`tm-${i}`}>
            {[true, false].map((v) => (
              <button
                key={String(v)}
                className="choice"
                aria-pressed={labels[i] === v}
                disabled={trained}
                onClick={() => setLabels((ls) => ls.map((x, j) => (j === i ? v : x)))}
              >
                {v ? 'Spam' : 'Not spam'}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!trained ? (
        <div className="btn-row" style={{ marginTop: 'var(--s4)' }}>
          <button className="btn btn-primary" onClick={train} disabled={!allLabeled}>
            <Brain size={18} aria-hidden="true" /> Train my model
          </button>
          {!allLabeled && <span className="muted">{labels.filter((l) => l === null).length} messages left to label</span>}
        </div>
      ) : (
        model && (
          <>
            <div className="model-box">
              <h3>What your model learned</h3>
              <p style={{ marginBottom: 8 }}>Words it now links with spam:</p>
              <div className="chips">
                {model.topSpam.map((w) => (
                  <span className="chip spam" key={w}>{w}</span>
                ))}
              </div>
              <p style={{ margin: '12px 0 8px' }}>Words it links with normal messages:</p>
              <div className="chips">
                {model.topHam.map((w) => (
                  <span className="chip ham" key={w}>{w}</span>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: 18, marginTop: 'var(--s5)' }}>Step 2 · Test on new messages</h3>
            {results.map((r) => {
              const ok = r.pred.spam === r.spam;
              return (
                <div className="msg" key={r.text} data-testid="test-msg">
                  <p>{r.text}</p>
                  <span className="pred" style={{ color: ok ? 'var(--ok)' : 'var(--bad)' }}>
                    {ok ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
                    Predicted {r.pred.spam ? 'Spam' : 'Not spam'} ({Math.round(r.pred.confidence * 100)}%)
                  </span>
                </div>
              );
            })}
            <div role="status">
              <Feedback tone={accuracy === results.length ? 'ok' : 'bad'}>
                <strong>
                  Test accuracy: {accuracy} / {results.length}.
                </strong>{' '}
                {labelErrors === 0
                  ? 'Clean labels made a model that generalizes to new messages.'
                  : `${labelErrors} of your training labels ${labelErrors === 1 ? 'was' : 'were'} different from the real answer, and the model learned those mistakes. Garbage in, garbage out!`}
              </Feedback>
            </div>
            <div className="btn-row" style={{ marginTop: 'var(--s3)' }}>
              <button className="btn btn-secondary" onClick={() => setTrained(false)}>
                <RotateCcw size={18} aria-hidden="true" /> Change labels and retrain
              </button>
            </div>
          </>
        )
      )}
    </div>
  );
}
