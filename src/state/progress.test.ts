import { describe, expect, it } from 'vitest';
import {
  initialProgress,
  reduce,
  totalXp,
  levelFor,
  lessonComplete,
  moduleProgress,
  unlockedBadges,
  maxXp,
  parseStored,
  type Curriculum,
} from './progress';

const cur: Curriculum = [
  { id: 'fundamentals', lessons: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }] },
  { id: 'tools', lessons: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }] },
  { id: 'ethics', lessons: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }] },
];

function finishLesson(state = initialProgress(), id: string, correct = 3) {
  state = reduce(state, { type: 'activity', lessonId: id, score: 1 });
  return reduce(state, { type: 'quiz', lessonId: id, correct, total: 3 });
}

describe('xp', () => {
  it('starts at zero', () => {
    expect(totalXp(initialProgress(), cur)).toBe(0);
  });
  it('awards 30 for an activity and 10 per correct quiz answer', () => {
    let s = reduce(initialProgress(), { type: 'activity', lessonId: 'a1', score: 0.5 });
    expect(totalXp(s, cur)).toBe(30);
    s = reduce(s, { type: 'quiz', lessonId: 'a1', correct: 2, total: 3 });
    expect(totalXp(s, cur)).toBe(50);
  });
  it('keeps the best quiz attempt, never lowers xp', () => {
    let s = finishLesson(undefined, 'a1', 3);
    s = reduce(s, { type: 'quiz', lessonId: 'a1', correct: 1, total: 3 });
    expect(s.lessons.a1.quizBest).toBe(3);
    expect(s.lessons.a1.quizAttempts).toBe(2);
    expect(totalXp(s, cur)).toBe(60);
  });
  it('repeating an activity does not double-award', () => {
    let s = reduce(initialProgress(), { type: 'activity', lessonId: 'a1', score: 1 });
    s = reduce(s, { type: 'activity', lessonId: 'a1', score: 1 });
    expect(totalXp(s, cur)).toBe(30);
  });
  it('adds a 50 xp bonus when a module is complete', () => {
    let s = initialProgress();
    for (const id of ['a1', 'a2', 'a3']) s = finishLesson(s, id);
    expect(totalXp(s, cur)).toBe(3 * 60 + 50);
  });
  it('max xp is 690 for 9 lessons', () => {
    expect(maxXp(cur)).toBe(690);
  });
});

describe('completion', () => {
  it('needs both activity and a passing quiz (2 of 3)', () => {
    let s = reduce(initialProgress(), { type: 'quiz', lessonId: 'a1', correct: 3, total: 3 });
    expect(lessonComplete(s, 'a1')).toBe(false);
    s = reduce(s, { type: 'activity', lessonId: 'a1', score: 1 });
    expect(lessonComplete(s, 'a1')).toBe(true);
    const low = finishLesson(undefined, 'a2', 1);
    expect(lessonComplete(low, 'a2')).toBe(false);
  });
  it('reports module progress as a fraction', () => {
    const s = finishLesson(undefined, 'b2');
    expect(moduleProgress(s, cur[1])).toEqual({ done: 1, total: 3, pct: 1 / 3 });
  });
});

describe('levels', () => {
  it('maps xp to levels', () => {
    expect(levelFor(0).name).toBe('Curious');
    expect(levelFor(79).name).toBe('Curious');
    expect(levelFor(80).name).toBe('Explorer');
    expect(levelFor(690).name).toBe('AI Pro');
    expect(levelFor(690).next).toBeNull();
    expect(levelFor(100).next?.min).toBe(200);
  });
});

describe('badges', () => {
  it('unlocks first-steps and perfect-score', () => {
    const s = finishLesson(undefined, 'a1', 3);
    const b = unlockedBadges(s, cur);
    expect(b).toContain('first-steps');
    expect(b).toContain('perfect-score');
    expect(b).not.toContain('fundamentals-grad');
  });
  it('perfect-score requires a perfect FIRST attempt', () => {
    let s = reduce(initialProgress(), { type: 'quiz', lessonId: 'a1', correct: 2, total: 3 });
    s = reduce(s, { type: 'quiz', lessonId: 'a1', correct: 3, total: 3 });
    expect(unlockedBadges(s, cur)).not.toContain('perfect-score');
  });
  it('unlocks prompt-pro from a full-score prompt activity', () => {
    const s = reduce(initialProgress(), { type: 'activity', lessonId: 'b2', score: 1, kind: 'prompt-builder' });
    expect(unlockedBadges(s, cur)).toContain('prompt-pro');
  });
  it('unlocks module grads, quiz streak and portal master', () => {
    let s = initialProgress();
    for (const m of cur) for (const l of m.lessons) s = finishLesson(s, l.id, 2);
    const b = unlockedBadges(s, cur);
    expect(b).toEqual(
      expect.arrayContaining(['fundamentals-grad', 'tools-grad', 'ethics-grad', 'quiz-streak', 'portal-master']),
    );
  });
});

describe('reset + storage', () => {
  it('reset clears everything', () => {
    const s = reduce(finishLesson(undefined, 'a1'), { type: 'reset' });
    expect(s).toEqual(initialProgress());
  });
  it('parseStored survives garbage', () => {
    expect(parseStored('not json')).toEqual(initialProgress());
    expect(parseStored(null)).toEqual(initialProgress());
    expect(parseStored('{"version":99}')).toEqual(initialProgress());
    const good = finishLesson(undefined, 'a1');
    expect(parseStored(JSON.stringify(good))).toEqual(good);
  });
});
