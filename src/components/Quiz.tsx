import { useState, type ReactNode } from 'react';
import { CircleCheck, CircleX, RotateCcw, ArrowRight, Trophy } from 'lucide-react';
import type { QuizQuestion } from '../data/types';
import { PASS_MARK, XP } from '../state/progress';

interface Props {
  questions: QuizQuestion[];
  best: number | null;
  onFinish: (correct: number) => void;
  nextHref?: ReactNode;
}

export function Quiz({ questions, best, onFinish, nextHref }: Props) {
  const [started, setStarted] = useState(best === null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const restart = () => {
    setStarted(true);
    setI(0);
    setPicked(null);
    setChecked(false);
    setCorrect(0);
    setFinished(false);
  };

  if (!started) {
    return (
      <div>
        <p>
          Best score: <strong>{best} / {questions.length}</strong>.{' '}
          {(best ?? 0) >= PASS_MARK ? 'Passed!' : `Score ${PASS_MARK} or more to pass.`}
        </p>
        <div className="btn-row">
          <button className="btn btn-secondary" onClick={restart}>
            <RotateCcw size={18} aria-hidden="true" /> Retake quiz
          </button>
          {nextHref}
        </div>
      </div>
    );
  }

  if (finished) {
    const passed = correct >= PASS_MARK;
    return (
      <div className="quiz-result" role="status">
        <Trophy size={40} aria-hidden="true" color={passed ? 'var(--xp-bright)' : 'var(--ink-2)'} />
        <div className="big">
          {correct} / {questions.length}
        </div>
        <p className="muted">
          {passed
            ? `Nice work! You passed. Each correct answer is worth ${XP.perCorrect} XP (your best score counts).`
            : `You need ${PASS_MARK} correct to pass. Review the lesson above and try again.`}
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={restart}>
            <RotateCcw size={18} aria-hidden="true" /> Try again
          </button>
          {passed && nextHref}
        </div>
      </div>
    );
  }

  const q = questions[i];
  const isRight = picked === q.answer;

  const check = () => {
    if (picked === null) return;
    setChecked(true);
    if (isRight) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (i + 1 < questions.length) {
      setI(i + 1);
      setPicked(null);
      setChecked(false);
    } else {
      setFinished(true);
      onFinish(correct);
    }
  };

  return (
    <div>
      <div className="quiz-progress" aria-hidden="true">
        {questions.map((_, k) => (
          <span key={k} className={k <= i ? 'on' : ''} />
        ))}
      </div>
      <p className="muted" style={{ marginBottom: 4 }}>
        Question {i + 1} of {questions.length}
      </p>
      <p className="quiz-q" id={`q-${i}`}>{q.prompt}</p>
      <div className="choices" role="radiogroup" aria-labelledby={`q-${i}`}>
        {q.choices.map((c, k) => {
          const state = checked ? (k === q.answer ? 'correct' : k === picked ? 'wrong' : '') : '';
          return (
            <button
              key={k}
              role="radio"
              aria-checked={picked === k}
              className={`choice ${state}`}
              disabled={checked}
              onClick={() => setPicked(k)}
            >
              <span className="key" aria-hidden="true">{String.fromCharCode(65 + k)}</span>
              {c}
              {state === 'correct' && <CircleCheck className="mark" size={20} color="var(--ok)" aria-label="Correct answer" />}
              {state === 'wrong' && <CircleX className="mark" size={20} color="var(--bad)" aria-label="Your answer" />}
            </button>
          );
        })}
      </div>
      {checked && (
        <div className={`feedback ${isRight ? 'ok' : 'bad'}`} role="status">
          {isRight ? <CircleCheck size={18} aria-hidden="true" /> : <CircleX size={18} aria-hidden="true" />}
          <span>
            <strong>{isRight ? 'Correct! ' : 'Not quite. '}</strong>
            {q.explain}
          </span>
        </div>
      )}
      <div className="btn-row" style={{ marginTop: 'var(--s4)' }}>
        {!checked ? (
          <button className="btn btn-primary" onClick={check} disabled={picked === null}>
            Check answer
          </button>
        ) : (
          <button className="btn btn-primary" onClick={next}>
            {i + 1 < questions.length ? 'Next question' : 'See results'} <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
