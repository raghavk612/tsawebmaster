import { useState } from 'react';
import { CircleCheck, CircleX, Plus, Minus, RotateCcw } from 'lucide-react';
import type { PromptBuilderActivity as Cfg } from '../data/types';
import { type ActivityProps, Feedback } from './shared';

export function PromptBuilderActivity({ config, onComplete }: ActivityProps<Cfg>) {
  const [on, setOn] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const goodTotal = config.parts.filter((p) => p.good).length;
  const selected = config.parts.filter((p) => on.includes(p.id));
  const good = selected.filter((p) => p.good).length;
  const bad = selected.filter((p) => !p.good).length;
  const score = Math.max(0, (good - bad) / goodTotal);
  const missing = config.parts.filter((p) => p.good && !on.includes(p.id));

  const toggle = (id: string) => setOn((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));
  const check = () => {
    setChecked(true);
    onComplete(score);
  };

  return (
    <div>
      <p style={{ fontWeight: 700, marginBottom: 8 }}>Your prompt</p>
      <div className="prompt-preview" aria-live="polite">
        {selected.length === 0 && <span>{config.base}</span>}
        {selected.map((p) => (
          <span key={p.id} className={checked ? (p.good ? 'added' : 'bad-add') : 'added'}>
            {p.text}{' '}
          </span>
        ))}
      </div>
      <div className="meter">
        <span>Prompt strength</span>
        <div className="bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((good / goodTotal) * 100)} aria-label="Prompt strength">
          <span style={{ width: `${(good / goodTotal) * 100}%` }} />
        </div>
        <span>
          {good}/{goodTotal}
        </span>
      </div>
      <div className="parts">
        {config.parts.map((p) => {
          const isOn = on.includes(p.id);
          const state = checked && isOn ? (p.good ? 'correct' : 'wrong') : '';
          return (
            <button key={p.id} className={`choice part ${state}`} aria-pressed={isOn} disabled={checked} onClick={() => toggle(p.id)}>
              <span style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                {isOn ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                <span>
                  <small>{p.label}</small>
                  {p.text}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {!checked ? (
        <div className="btn-row" style={{ marginTop: 'var(--s4)' }}>
          <button className="btn btn-primary" onClick={check} disabled={selected.length === 0}>
            Check my prompt
          </button>
          {selected.length === 0 && <span className="muted">Add at least one building block</span>}
        </div>
      ) : (
        <div role="status" style={{ marginTop: 'var(--s4)' }}>
          {selected.map((p) => (
            <div className={`feedback ${p.good ? 'ok' : 'bad'}`} key={p.id}>
              {p.good ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
              <span>
                <strong>{p.label}: </strong>
                {p.why}
              </span>
            </div>
          ))}
          {missing.length > 0 && (
            <Feedback tone="info">
              <strong>Missing: </strong>
              {missing.map((m) => m.label).join(', ')}. Adding {missing.length === 1 ? 'it' : 'them'} would make the prompt even stronger.
            </Feedback>
          )}
          {score === 1 && (
            <Feedback tone="ok">
              <strong>Flawless prompt!</strong> Role, task, context, and format, with no traps.
            </Feedback>
          )}
          <button className="btn btn-secondary" style={{ marginTop: 'var(--s3)' }} onClick={() => setChecked(false)}>
            <RotateCcw size={18} aria-hidden="true" /> Edit prompt
          </button>
        </div>
      )}
    </div>
  );
}
