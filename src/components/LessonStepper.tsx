import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, Gamepad2 } from 'lucide-react';
import type { Section } from '../data/types';
import { SectionView } from './SectionView';
import { prefersReducedMotion } from './motion';

/** Split a lesson into bite-sized steps: a new step starts after each checkpoint or widget. */
export function groupSteps(sections: Section[]): Section[][] {
  const steps: Section[][] = [[]];
  sections.forEach((s, i) => {
    steps[steps.length - 1].push(s);
    const interactive = s.kind === 'checkpoint' || s.kind === 'widget';
    if (interactive && i < sections.length - 1) steps.push([]);
  });
  return steps.filter((s) => s.length > 0);
}

interface Props {
  sections: Section[];
  /** start fully revealed (student already worked on this lesson) */
  startOpen: boolean;
  /** rendered once every step is revealed (activity + quiz) */
  practice: ReactNode;
  accent: string;
}

export function LessonStepper({ sections, startOpen, practice, accent }: Props) {
  const steps = useMemo(() => groupSteps(sections), [sections]);
  const [shown, setShown] = useState(startOpen ? steps.length + 1 : 1);
  const [answered, setAnswered] = useState<Set<number>>(() => new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const lastShown = useRef(shown);

  useEffect(() => {
    if (shown > lastShown.current) {
      const el = refs.current[shown - 1];
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      (el?.querySelector('h2, [data-focus]') as HTMLElement | null)?.focus?.({ preventScroll: true });
    }
    lastShown.current = shown;
  }, [shown]);

  const total = steps.length;
  const readingDone = shown > total;
  const pct = Math.min(1, (Math.min(shown, total) - (readingDone ? 0 : 1) + (readingDone ? 0 : 0.5)) / total);

  return (
    <>
      <div className="step-progress" aria-hidden={readingDone}>
        <div className="step-dots">
          {steps.map((_, i) => (
            <span key={i} className={i < shown - 1 || readingDone ? 'done' : i === shown - 1 ? 'now' : ''} style={{ ['--accent' as string]: accent }} />
          ))}
          <span className={`practice-dot ${readingDone ? 'now' : ''}`}><Gamepad2 size={14} aria-hidden="true" /></span>
        </div>
        <span className="step-label">{readingDone ? 'Practice time' : `Step ${shown} of ${total}`}</span>
        <div className="bar thin"><span style={{ width: `${(readingDone ? 1 : pct) * 100}%`, background: accent }} /></div>
      </div>

      {steps.map((group, i) => {
        if (i >= shown) return null;
        const gate = group[group.length - 1];
        const needsAnswer = gate.kind === 'checkpoint' && !answered.has(i);
        const isCurrent = i === shown - 1 && !readingDone;
        return (
          <div key={i} className="step" ref={(el) => { refs.current[i] = el; }} data-testid="lesson-step">
            {group.map((s, j) => (
              <SectionView key={j} section={s} onAnswer={() => setAnswered((a) => new Set(a).add(i))} />
            ))}
            {isCurrent && (
              <div className="continue-row">
                <button className="btn btn-primary btn-lg" disabled={needsAnswer} onClick={() => setShown(shown + 1)} data-testid="continue">
                  {i === total - 1 ? 'Start the practice' : 'Continue'} <ArrowDown size={20} aria-hidden="true" />
                </button>
                {needsAnswer && <span className="muted">Answer the quick check to continue</span>}
              </div>
            )}
          </div>
        );
      })}

      {readingDone && (
        <div className="step" ref={(el) => { refs.current[total] = el; }}>
          {practice}
        </div>
      )}
    </>
  );
}
