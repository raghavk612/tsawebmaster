/**
 * Progress engine — pure functions, no React, no storage.
 * Only raw facts are stored (what the student did). XP, levels, completion
 * and badges are always *derived*, so they can never drift out of sync.
 */

export type Curriculum = { id: string; lessons: { id: string }[] }[];

export interface LessonProgress {
  activityDone: boolean;
  activityScore: number; // 0..1, best
  activityKind?: string;
  quizBest: number | null; // best number correct
  quizTotal: number;
  quizAttempts: number;
  quizPerfectFirstTry: boolean;
}

export interface Progress {
  version: 1;
  lessons: Record<string, LessonProgress>;
}

export type Action =
  | { type: 'activity'; lessonId: string; score: number; kind?: string }
  | { type: 'quiz'; lessonId: string; correct: number; total: number }
  | { type: 'reset' };

export const XP = { activity: 30, perCorrect: 10, moduleBonus: 50, quizLength: 3 } as const;
export const PASS_MARK = 2;

export const LEVELS = [
  { name: 'Curious', min: 0 },
  { name: 'Explorer', min: 80 },
  { name: 'Builder', min: 200 },
  { name: 'Analyst', min: 350 },
  { name: 'Innovator', min: 500 },
  { name: 'AI Pro', min: 650 },
] as const;

export type Level = { name: string; min: number; index: number; next: { name: string; min: number } | null };

export const initialProgress = (): Progress => ({ version: 1, lessons: {} });

const blankLesson = (): LessonProgress => ({
  activityDone: false,
  activityScore: 0,
  quizBest: null,
  quizTotal: XP.quizLength,
  quizAttempts: 0,
  quizPerfectFirstTry: false,
});

export function reduce(state: Progress, action: Action): Progress {
  if (action.type === 'reset') return initialProgress();
  const prev = state.lessons[action.lessonId] ?? blankLesson();
  let next: LessonProgress;
  if (action.type === 'activity') {
    next = {
      ...prev,
      activityDone: true,
      activityScore: Math.max(prev.activityScore, clamp01(action.score)),
      activityKind: action.kind ?? prev.activityKind,
    };
  } else {
    const correct = Math.max(0, Math.min(action.correct, action.total));
    next = {
      ...prev,
      quizBest: prev.quizBest === null ? correct : Math.max(prev.quizBest, correct),
      quizTotal: action.total,
      quizAttempts: prev.quizAttempts + 1,
      quizPerfectFirstTry:
        prev.quizPerfectFirstTry || (prev.quizAttempts === 0 && correct === action.total),
    };
  }
  return { ...state, lessons: { ...state.lessons, [action.lessonId]: next } };
}

const clamp01 = (n: number) => (Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0);

export function lessonComplete(state: Progress, lessonId: string): boolean {
  const l = state.lessons[lessonId];
  return !!l && l.activityDone && (l.quizBest ?? 0) >= PASS_MARK;
}

export function moduleProgress(state: Progress, mod: Curriculum[number]) {
  const done = mod.lessons.filter((l) => lessonComplete(state, l.id)).length;
  const total = mod.lessons.length;
  return { done, total, pct: total ? done / total : 0 };
}

export const moduleComplete = (state: Progress, mod: Curriculum[number]) =>
  moduleProgress(state, mod).done === mod.lessons.length;

export function lessonXp(state: Progress, lessonId: string): number {
  const l = state.lessons[lessonId];
  if (!l) return 0;
  return (l.activityDone ? XP.activity : 0) + (l.quizBest ?? 0) * XP.perCorrect;
}

export function totalXp(state: Progress, cur: Curriculum): number {
  let xp = 0;
  for (const m of cur) {
    for (const l of m.lessons) xp += lessonXp(state, l.id);
    if (moduleComplete(state, m)) xp += XP.moduleBonus;
  }
  return xp;
}

export function maxXp(cur: Curriculum): number {
  return cur.reduce(
    (sum, m) => sum + m.lessons.length * (XP.activity + XP.quizLength * XP.perCorrect) + XP.moduleBonus,
    0,
  );
}

export function levelFor(xp: number): Level {
  let index = 0;
  LEVELS.forEach((lv, i) => {
    if (xp >= lv.min) index = i;
  });
  const next = LEVELS[index + 1] ?? null;
  return { ...LEVELS[index], index, next };
}

/** Badge ids unlocked by the current state. Definitions/art live in data/badges.ts. */
export function unlockedBadges(state: Progress, cur: Curriculum): string[] {
  const out: string[] = [];
  const lessons = Object.values(state.lessons);
  const completed = cur.flatMap((m) => m.lessons).filter((l) => lessonComplete(state, l.id));
  const byId = Object.fromEntries(cur.map((m) => [m.id, m]));

  if (completed.length >= 1) out.push('first-steps');
  if (byId.fundamentals && moduleComplete(state, byId.fundamentals)) out.push('fundamentals-grad');
  if (byId.tools && moduleComplete(state, byId.tools)) out.push('tools-grad');
  if (byId.ethics && moduleComplete(state, byId.ethics)) out.push('ethics-grad');
  if (lessons.some((l) => l.quizPerfectFirstTry)) out.push('perfect-score');
  if (lessons.some((l) => l.activityKind === 'prompt-builder' && l.activityScore >= 1)) out.push('prompt-pro');
  if (lessons.filter((l) => (l.quizBest ?? 0) >= PASS_MARK).length >= 5) out.push('quiz-streak');
  if (cur.length > 0 && cur.every((m) => moduleComplete(state, m))) out.push('portal-master');
  return out;
}

/** Validate anything read from storage; fall back to a fresh state on any problem. */
export function parseStored(raw: string | null): Progress {
  if (!raw) return initialProgress();
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1 || typeof data.lessons !== 'object' || data.lessons === null) {
      return initialProgress();
    }
    const lessons: Record<string, LessonProgress> = {};
    for (const [id, v] of Object.entries(data.lessons as Record<string, Partial<LessonProgress>>)) {
      if (!v || typeof v !== 'object') continue;
      lessons[id] = {
        ...blankLesson(),
        activityDone: v.activityDone === true,
        activityScore: clamp01(Number(v.activityScore ?? 0)),
        ...(typeof v.activityKind === 'string' ? { activityKind: v.activityKind } : {}),
        quizBest: typeof v.quizBest === 'number' ? v.quizBest : null,
        quizTotal: typeof v.quizTotal === 'number' ? v.quizTotal : XP.quizLength,
        quizAttempts: typeof v.quizAttempts === 'number' ? v.quizAttempts : 0,
        quizPerfectFirstTry: v.quizPerfectFirstTry === true,
      };
    }
    return { version: 1, lessons };
  } catch {
    return initialProgress();
  }
}
