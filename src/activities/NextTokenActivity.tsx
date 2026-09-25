import { useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { NextTokenActivity as Cfg } from '../data/types';
import { type ActivityProps, Feedback, ScoreLine } from './shared';

export function NextTokenActivity({ config, onComplete }: ActivityProps<Cfg>) {
  const [round, setRound] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [hits, setHits] = useState(0);
  const [done, setDone] = useState(false);
  const r = config.rounds[round];
  const top = [...r.options].sort((a, b) => b.p - a.p)[0].word;

  const choose = (w: string) => {
    if (pick) return;
    setPick(w);
    if (w === top) setHits((h) => h + 1);
  };
  const next = () => {
    if (round + 1 < config.rounds.length) {
      setRound(round + 1);
      setPick(null);
    } else {
      setDone(true);
      onComplete(hits / config.rounds.length);
    }
  };
  const restart = () => {
    setRound(0);
    setPick(null);
    setHits(0);
    setDone(false);
  };

  if (done) {
    return (
      <div>
        <ScoreLine right={hits} total={config.rounds.length} noun="matched the model’s top pick" />
        <p style={{ marginTop: 'var(--s4)' }}>
          Notice that the model never "knows" the answer. It ranks what usually comes next. For "My favorite subject is ___" there’s no right
          answer, so the probabilities spread out. That’s also why chatbots can sound sure about things that are wrong.
        </p>
        <button className="btn btn-secondary" onClick={restart}>
          <RotateCcw size={18} aria-hidden="true" /> Play again
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="muted" style={{ marginBottom: 4 }}>
        Round {round + 1} of {config.rounds.length}
      </p>
      <p className="context">
        {r.context.replace('___', '')}
        <mark>{pick ?? '___'}</mark>
      </p>
      {!pick ? (
        <div className="seg" role="group" aria-label="Choose the next word">
          {r.options.map((o) => (
            <button key={o.word} className="choice" onClick={() => choose(o.word)}>
              {o.word}
            </button>
          ))}
        </div>
      ) : (
        <>
          <div aria-label="Model probabilities">
            {[...r.options]
              .sort((a, b) => b.p - a.p)
              .map((o) => (
                <div className={`prob-row ${o.word === top ? 'top' : ''}`} key={o.word}>
                  <strong>{o.word}</strong>
                  <div className="bar">
                    <span style={{ width: `${o.p * 100}%` }} />
                  </div>
                  <span>{Math.round(o.p * 100)}%</span>
                </div>
              ))}
          </div>
          <div role="status">
            <Feedback tone={pick === top ? 'ok' : 'info'}>
              {pick === top
                ? `Yes! "${top}" is the most likely next word.`
                : `The model’s top pick was "${top}". "${pick}" is possible, just less likely given its training text.`}
            </Feedback>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 'var(--s4)' }} onClick={next}>
            {round + 1 < config.rounds.length ? 'Next sentence' : 'Finish'} <ArrowRight size={18} aria-hidden="true" />
          </button>
        </>
      )}
      <p className="muted" style={{ fontSize: 14, marginTop: 'var(--s4)', marginBottom: 0 }}>
        Probabilities are illustrative examples, not output from a specific model.
      </p>
    </div>
  );
}
