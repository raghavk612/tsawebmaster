import { useState } from 'react';
import { CircleCheck, CircleX, Info, Lightbulb, MousePointerClick, RotateCw, Sparkles, TriangleAlert } from 'lucide-react';
import type { Section } from '../data/types';
import { Widget, widgetTitles } from '../widgets';

const calloutIcon = { tip: Lightbulb, warn: TriangleAlert, fact: Info };

function FlipCards({ heading, items }: { heading?: string; items: { term: string; detail: string }[] }) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const toggle = (i: number) => setFlipped((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]));
  return (
    <>
      {heading && <h2>{heading}</h2>}
      <p className="hint-line">
        <MousePointerClick size={16} aria-hidden="true" /> Tap each card to flip it · {flipped.length}/{items.length} revealed
      </p>
      <div className="flip-grid">
        {items.map((it, i) => {
          const on = flipped.includes(i);
          return (
            <button key={it.term} className={`flip ${on ? 'on' : ''}`} onClick={() => toggle(i)} aria-pressed={on} data-testid="flip-card">
              <span className="flip-inner">
                <span className="flip-front" aria-hidden={on}>
                  <strong>{it.term}</strong>
                  <RotateCw size={16} aria-hidden="true" />
                </span>
                <span className="flip-back" aria-hidden={!on}>
                  <small>{it.term}</small>
                  {it.detail}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function CompareTabs({ heading, columns }: { heading?: string; columns: { title: string; points: string[] }[] }) {
  const [tab, setTab] = useState(0);
  return (
    <>
      {heading && <h2>{heading}</h2>}
      <div className="seg-tabs" role="tablist" aria-label={heading ?? 'Compare'}>
        {columns.map((c, i) => (
          <button key={c.title} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>
            {c.title}
          </button>
        ))}
      </div>
      <div className="card compare-panel" role="tabpanel" key={tab}>
        <ul>
          {columns[tab].points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Checkpoint({
  section,
  onAnswer,
}: {
  section: Extract<Section, { kind: 'checkpoint' }>;
  onAnswer?: () => void;
}) {
  const [pick, setPick] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const right = pick === section.answer;
  return (
    <div className="checkpoint" data-testid="checkpoint" data-answered={pick !== null && right}>
      <p className="checkpoint-label">
        <Sparkles size={16} aria-hidden="true" /> Quick check
      </p>
      <p className="checkpoint-q" id={`cp-${section.question.length}`}>{section.question}</p>
      <div className="choices" role="group" aria-labelledby={`cp-${section.question.length}`}>
        {section.choices.map((c, i) => {
          const state = pick === i ? (i === section.answer ? 'correct' : 'wrong') : pick !== null && right && i === section.answer ? 'correct' : '';
          return (
            <button
              key={c}
              className={`choice ${state}`}
              disabled={right}
              onClick={() => {
                setPick(i);
                setTries((t) => t + 1);
                if (i === section.answer) onAnswer?.();
              }}
            >
              {c}
              {state === 'correct' && <CircleCheck className="mark" size={20} color="var(--ok)" aria-hidden="true" />}
              {state === 'wrong' && <CircleX className="mark" size={20} color="var(--bad)" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
      {pick !== null && (
        <div className={`feedback ${right ? 'ok' : 'bad'}`} role="status">
          {right ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
          <span>
            <strong>{right ? (tries === 1 ? 'Nailed it! ' : 'Got it! ') : 'Not quite, try another answer. '}</strong>
            {right && section.explain}
          </span>
        </div>
      )}
    </div>
  );
}

export function SectionView({ section, onAnswer }: { section: Section; onAnswer?: () => void }) {
  switch (section.kind) {
    case 'text':
      return (
        <>
          {section.heading && <h2>{section.heading}</h2>}
          {section.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </>
      );
    case 'callout': {
      const Icon = calloutIcon[section.tone];
      return (
        <aside className={`callout callout-${section.tone}`}>
          <Icon size={22} aria-hidden="true" />
          <div>
            <strong>{section.title}</strong>
            <p>{section.body}</p>
          </div>
        </aside>
      );
    }
    case 'list':
      return <FlipCards heading={section.heading} items={section.items} />;
    case 'compare':
      return <CompareTabs heading={section.heading} columns={section.columns} />;
    case 'checkpoint':
      return <Checkpoint section={section} onAnswer={onAnswer} />;
    case 'widget':
      return (
        <section className="widget" data-testid={`widget-${section.widget}`}>
          <h2 className="widget-title">{section.heading ?? widgetTitles[section.widget]}</h2>
          {section.caption && <p className="muted">{section.caption}</p>}
          <Widget id={section.widget} />
        </section>
      );
  }
}
