import type { WidgetId } from '../data/types';
import { FamilyTree } from './FamilyTree';
import { Threshold } from './Threshold';
import { Neuron } from './Neuron';
import { Temperature } from './Temperature';
import { PromptCompare } from './PromptCompare';
import { Bias } from './Bias';

export const widgetTitles: Record<WidgetId, string> = {
  'family-tree': 'Explore: the AI family tree',
  threshold: 'Explore: be the learning algorithm',
  neuron: 'Explore: wire up a neuron',
  temperature: 'Explore: the creativity dial',
  'prompt-compare': 'Explore: vague vs. specific',
  bias: 'Explore: the bias simulator',
};

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case 'family-tree': return <FamilyTree />;
    case 'threshold': return <Threshold />;
    case 'neuron': return <Neuron />;
    case 'temperature': return <Temperature />;
    case 'prompt-compare': return <PromptCompare />;
    case 'bias': return <Bias />;
  }
}
