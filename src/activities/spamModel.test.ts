import { describe, expect, it } from 'vitest';
import { trainModel, predict, tokenize } from './spamModel';
import { fundamentals } from '../data/modules/fundamentals';
import type { TrainSpamActivity } from '../data/types';

const act = fundamentals.lessons[1].activity as TrainSpamActivity;

describe('spam model', () => {
  it('tokenizes into lowercase words, dropping short stopwords', () => {
    expect(tokenize('WIN a FREE iPhone!!')).toEqual(['win', 'free', 'iphone']);
  });
  it('with correct labels it classifies every test message correctly', () => {
    const model = trainModel(act.training.map((t) => ({ text: t.text, spam: t.spam })));
    const acc = act.test.filter((t) => predict(model, t.text).spam === t.spam).length;
    expect(acc).toBe(act.test.length);
  });
  it('with flipped labels it gets them wrong (garbage in, garbage out)', () => {
    const model = trainModel(act.training.map((t) => ({ text: t.text, spam: !t.spam })));
    const acc = act.test.filter((t) => predict(model, t.text).spam === t.spam).length;
    expect(acc).toBe(0);
  });
  it('reports the most spammy and hammy words', () => {
    const model = trainModel(act.training.map((t) => ({ text: t.text, spam: t.spam })));
    expect(model.topSpam).toContain('free');
    expect(model.topHam).toContain('notes');
  });
});
