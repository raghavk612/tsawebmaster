import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { modules } from '../data/modules';
import { badges } from '../data/badges';
import { useProgress } from '../state/ProgressContext';
import { lessonComplete, moduleProgress, LEVELS } from '../state/progress';
import { nextLesson } from '../state/nextLesson';
import { ProgressRing } from '../components/ProgressRing';
import { BadgeIcon } from '../components/BadgeIcon';
import { useTitle } from '../components/useTitle';

export default function Dashboard() {
  useTitle('Dashboard');
  const { progress, xp, max, level, badges: earned, dispatch } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const next = nextLesson(progress);
  const lessonsDone = modules.flatMap((m) => m.lessons).filter((l) => lessonComplete(progress, l.id)).length;
  const lessonsTotal = modules.reduce((s, m) => s + m.lessons.length, 0);
  const levelStart = level.min;
  const levelEnd = level.next?.min ?? max;
  const levelPct = level.next ? (xp - levelStart) / (levelEnd - levelStart) : 1;

  return (
    <div className="container">
      <header className="page-head">
        <span className="eyebrow">Progress dashboard</span>
        <h1>Your AI learning journey</h1>
        <p>Everything you’ve earned so far. Progress is saved in this browser only.</p>
      </header>

      <div className="dash-top">
        <section className="card" aria-labelledby="level-h">
          <div className="level-card">
            <div className="level-badge" aria-hidden="true">{level.index + 1}</div>
            <div className="grow">
              <p className="eyebrow" style={{ marginBottom: 4 }}>Level {level.index + 1} of {LEVELS.length}</p>
              <h2 id="level-h" data-testid="level-name">{level.name}</h2>
              <p className="muted" style={{ marginBottom: 8 }}>
                <strong data-testid="xp-total" style={{ color: 'var(--ink)' }}>{xp} XP</strong>
                {level.next ? ` · ${level.next.min - xp} XP to ${level.next.name}` : ' · Top level reached!'}
              </p>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(levelPct * 100)} aria-label="Progress to next level">
                <span style={{ width: `${levelPct * 100}%` }} />
              </div>
            </div>
          </div>
          <div className="mini-stats" style={{ marginTop: 'var(--s5)' }}>
            <div><strong>{lessonsDone}/{lessonsTotal}</strong><span>lessons</span></div>
            <div><strong>{earned.length}/{badges.length}</strong><span>badges</span></div>
            <div><strong>{Math.round((xp / max) * 100)}%</strong><span>of max XP</span></div>
          </div>
          {next && (
            <Link to={`/learn/${next.mod.id}/${next.lesson.id}`} className="btn btn-primary" style={{ marginTop: 'var(--s5)', width: '100%' }}>
              {xp === 0 ? 'Start your first lesson' : `Up next: ${next.lesson.title}`} <ArrowRight size={18} aria-hidden="true" />
            </Link>
          )}
        </section>

        <section className="card" aria-labelledby="mods-h">
          <h2 id="mods-h" style={{ fontSize: 24 }}>Modules</h2>
          {modules.map((m) => {
            const p = moduleProgress(progress, { id: m.id, lessons: m.lessons });
            return (
              <div className="module-progress" key={m.id} data-testid={`dash-module-${m.id}`}>
                <ProgressRing pct={p.pct} size={60} stroke={7} color={m.color} label={`${p.done}/${p.total}`} />
                <div className="grow">
                  <Link to={`/learn/${m.id}`}>Module {m.number}: {m.title}</Link>
                  <div className="muted" style={{ fontSize: 14 }}>
                    {p.done === p.total ? 'Complete' : p.done === 0 ? 'Not started' : `${p.done} of ${p.total} lessons done`}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      <section className="section" aria-labelledby="badges-h">
        <div className="section-head">
          <div>
            <h2 id="badges-h">Badges</h2>
            <p>{earned.length === 0 ? 'Complete your first lesson to earn your first badge.' : `${earned.length} of ${badges.length} unlocked.`}</p>
          </div>
        </div>
        <ul className="badges" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {badges.map((b) => {
            const has = earned.includes(b.id);
            return (
              <li key={b.id} className={`badge ${has ? '' : 'locked'}`} style={{ ['--c' as string]: b.color }} data-testid={`badge-${b.id}`} data-unlocked={has}>
                <div className="medal"><BadgeIcon icon={b.icon} /></div>
                <strong>{b.name}</strong>
                <p>{b.description}</p>
                <span className="state">{has ? 'Unlocked' : 'Locked'}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section" aria-labelledby="reset-h">
        <h2 id="reset-h" style={{ fontSize: 22 }}>Start over</h2>
        {!confirming ? (
          <button className="btn btn-secondary" onClick={() => setConfirming(true)} disabled={xp === 0 && Object.keys(progress.lessons).length === 0}>
            <RotateCcw size={18} aria-hidden="true" /> Reset my progress
          </button>
        ) : (
          <div className="confirm" role="alertdialog" aria-labelledby="confirm-t">
            <p id="confirm-t">This permanently clears all {xp} XP and {earned.length} badges in this browser. Are you sure?</p>
            <button className="btn btn-danger" onClick={() => { dispatch({ type: 'reset' }); setConfirming(false); }}>
              Yes, reset everything
            </button>
            <button className="btn btn-secondary" onClick={() => setConfirming(false)} autoFocus>
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
