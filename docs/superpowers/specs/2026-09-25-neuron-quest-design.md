# Neuron Quest — AI Learning Portal (TSA Webmaster 2026–27) — Design

## Goal
An interactive AI learning portal for high school students (grades 9–12) that
demystifies AI, showcases practical tools, and teaches effective + ethical use in
school. Built for the TSA Webmaster 2026–27 theme.

### Hard requirements (from the event brief)
- ≥ 3 learning modules: AI fundamentals, practical AI tools/techniques, ethical AI use.
- Gamification + progress tracking (XP, badges, progress dashboard) that visually
  tracks module completion.
- ≥ 3 separate pages (routes, not one long scroll), linked from the home page.
- Pages for the student **work log** and **copyright checklist** (state submission).

## Architecture
- Vite + React 19 + TypeScript, React Router (client routes), deployed on Vercel
  (`vercel.json` rewrites all paths to `index.html`).
- No backend, no accounts: progress lives in `localStorage`. No student data leaves
  the browser. If storage is unavailable, progress works in memory and a notice says
  it won't be saved.
- Content is data (`src/data/*.ts`); pages render it. Adding a lesson = editing data.

### Units
| Unit | Purpose |
|---|---|
| `src/state/progress.ts` | Pure functions: reducer, XP, level, module completion, badge rules. No React. Unit-tested with Vitest. |
| `src/state/ProgressContext.tsx` | React provider: loads/saves storage, dispatches actions, detects newly unlocked badges / level-ups and raises toasts. |
| `src/data/modules.ts` | 3 modules × 3 lessons: sections, activity config, 3-question quiz. |
| `src/data/badges.ts`, `glossary.ts`, `references.ts`, `worklog.ts`, `team.ts` | Static content. |
| `src/activities/*` | Six reusable activity types: `sort`, `train-spam`, `next-token`, `prompt-builder`, `spot`, `scenario`. Each calls `onComplete(score0to1)`. |
| `src/components/*` | Layout, nav, footer, Quiz, ProgressRing, XP bar, badge grid, toasts. |
| `src/pages/*` | Home, Learn hub, Module, Lesson, Dashboard, Glossary, About, References & Copyright, Work Log, 404. |

## Progress model
State: `{ version: 1, lessons: { [lessonId]: { activityDone, activityScore, quizBest, quizAttempts, quizPerfectFirstTry } } }`.
Everything else is **derived** (no stored XP that can drift):
- Activity complete: **+30 XP**. Quiz: **+10 XP per correct answer** (best attempt).
- Lesson complete = activity done **and** quiz best ≥ 2 of 3.
- Module complete (all 3 lessons): **+50 XP** bonus.
- Levels: Curious 0 · Explorer 80 · Builder 200 · Analyst 350 · Innovator 500 · AI Pro 650 (max 690).
- Badges (8): First Steps, Fundamentals Grad, Toolsmith, Ethics Champion, Perfect Score,
  Prompt Pro, Quiz Streak (5 quizzes passed), Portal Master (all modules).
- Reset: Dashboard button with a confirm step.

## UX rules applied
- Primary CTA per page is obvious ("Start Module 1" / "Continue where you left off").
- Every activity/quiz has idle, in-progress, correct/incorrect feedback, and done states.
- Feedback closure: XP toast says what you earned and what's next.
- Keyboard-operable activities (buttons, not drag-only), visible focus, AA contrast,
  `prefers-reduced-motion` respected, responsive down to 360px.

## Testing
- Vitest unit tests for the progress engine.
- Playwright E2E (Python): every route renders without console errors; completing a
  lesson awards XP and persists across reload; quiz scoring; badge unlock; reset;
  mobile viewport has no horizontal overflow.

## Out of scope (YAGNI)
Accounts/server sync, leaderboards, dark mode, live AI API calls (would need keys and
would send student input to a third party).
