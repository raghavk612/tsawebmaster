import type { ReactNode } from 'react';
import { CircleCheck, CircleX, Info } from 'lucide-react';

export interface ActivityProps<T> {
  config: T;
  onComplete: (score: number) => void;
}

export function Feedback({ tone, children }: { tone: 'ok' | 'bad' | 'info'; children: ReactNode }) {
  const Icon = tone === 'ok' ? CircleCheck : tone === 'bad' ? CircleX : Info;
  return (
    <div className={`feedback ${tone}`}>
      <Icon size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export function ScoreLine({ right, total, noun = 'correct' }: { right: number; total: number; noun?: string }) {
  const tone = right === total ? 'ok' : right >= total / 2 ? 'info' : 'bad';
  return (
    <div role="status">
      <Feedback tone={tone}>
        <strong>
          {right} / {total} {noun}.
        </strong>{' '}
        {right === total ? 'Perfect!' : 'Read the explanations, then try again if you like.'}
      </Feedback>
    </div>
  );
}
