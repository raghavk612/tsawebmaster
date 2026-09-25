# Neuron Quest: AI Learning Portal (TSA Webmaster 2026–27)

An interactive AI learning portal for high school students (grades 9–12), built for the
TSA High School Webmaster theme: **Artificial Intelligence (AI) learning portal**.

## What's inside

| Requirement (from the brief) | Where it lives |
|---|---|
| 3+ educational modules: fundamentals, tools/techniques, ethics | `/learn/fundamentals`, `/learn/tools`, `/learn/ethics` (3 lessons each) |
| Gamification + progress tracking | XP, 6 levels, 8 badges, progress rings, `/dashboard` |
| 3+ separate pages linked from home | Home, Learn, 3 Module pages, 9 Lessons, Dashboard, Glossary, About, References, Work Log |
| Student copyright checklist page | `/references#copyright` |
| Student work log page | `/work-log` |

Lessons unfold step by step: short chunks, quick-check questions that gate **Continue**, flip cards,
and a hands-on explorable (neuron builder, temperature dial, bias simulator, etc.), then an
activity and a 3-question quiz. Nickname **profiles** (no password, stored on the device) keep
each student's progress separate and feed a device leaderboard.

Each lesson ends with an interactive activity and a 3-question quiz. There are six activity types:
sort, **train a real naive-Bayes spam filter**, next-token prediction, prompt builder,
spot-the-hallucination, and ethics scenarios.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests (progress engine + spam model)
npm run test:e2e     # builds, then runs Playwright browser tests (needs: pip install playwright)
```

## Deploy (GitHub Pages)

The site is published at https://raghavk612.github.io/tsawebmaster/.
GitHub Pages publishes the built files from the `gh-pages` branch. To update the
deployment, run `npm ci`, `npm test`, and `npm run build -- --base /tsawebmaster/`,
copy `dist/index.html` to `dist/404.html`, add `dist/.nojekyll`, and publish the
contents of `dist` to `gh-pages`. Source pushes to `main` do not redeploy automatically.
The build uses the Pages base path, and `404.html` loads the app for direct lesson
links (GitHub Pages returns HTTP 404 for these routes, but the app renders normally).

## Deploy (Vercel)

Import the GitHub repo at vercel.com and accept the defaults (Vite, output folder `dist`).
`vercel.json` already routes every URL to the app, so direct links to lessons work.

## Before you submit: edit these

- `src/data/site.ts`: chapter name, team ID, team roles.
- `src/data/worklog.ts`: add a row for **every** work session (date, who, task, hours).
- Put your signed TSA Student Copyright Checklist PDF in `public/docs/` and set
  `copyrightChecklistPdf: '/docs/your-file.pdf'` in `site.ts` (same for `workLogPdf`).
- `src/data/references.ts`: add any new sources or assets you use.

## Project structure

```
src/
  data/          lesson content, badges, glossary, references, work log, site config
  state/         progress engine (pure functions + tests) and React provider
  activities/    the six interactive activity types
  components/    layout, quiz, progress ring, etc.
  pages/         one file per route
tests/e2e/       Playwright end-to-end tests
design-spec.md   design tokens and UI rules
```
