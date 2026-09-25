import type { Activity } from '../data/types';
import { SortActivity } from './SortActivity';
import { TrainSpamActivity } from './TrainSpamActivity';
import { NextTokenActivity } from './NextTokenActivity';
import { PromptBuilderActivity } from './PromptBuilderActivity';
import { SpotActivity } from './SpotActivity';
import { ScenarioActivity } from './ScenarioActivity';

export function ActivityRunner({ activity, onComplete }: { activity: Activity; onComplete: (score: number) => void }) {
  switch (activity.type) {
    case 'sort':
      return <SortActivity config={activity} onComplete={onComplete} />;
    case 'train-spam':
      return <TrainSpamActivity config={activity} onComplete={onComplete} />;
    case 'next-token':
      return <NextTokenActivity config={activity} onComplete={onComplete} />;
    case 'prompt-builder':
      return <PromptBuilderActivity config={activity} onComplete={onComplete} />;
    case 'spot':
      return <SpotActivity config={activity} onComplete={onComplete} />;
    case 'scenario':
      return <ScenarioActivity config={activity} onComplete={onComplete} />;
  }
}
