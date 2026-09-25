import { Link, useParams } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { findModule } from '../data/modules';
import { useProgress } from '../state/ProgressContext';
import { lessonComplete, lessonXp, moduleProgress, XP } from '../state/progress';
import { ProgressRing } from '../components/ProgressRing';
import { moduleStyle } from '../components/moduleStyle';
import { useTitle } from '../components/useTitle';
import NotFound from './NotFound';

export default function ModulePage() {
  const { moduleId } = useParams();
  const mod = findModule(moduleId);
  const { progress } = useProgress();
  useTitle(mod ? mod.title : 'Not found');
  if (!mod) return <NotFound />;

  const p = moduleProgress(progress, { id: mod.id, lessons: mod.lessons });
  const next = mod.lessons.find((l) => !lessonComplete(progress, l.id));

  return (
    <div className="container" style={moduleStyle(mod.id, mod.color)}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">Learn</Link> <span aria-hidden="true">/</span> <span>Module {mod.number}</span>
      </nav>
      <header className="module-hero">
        <div className="grow">
          <span className="eyebrow" style={{ color: mod.color }}>Module {mod.number}</span>
          <h1>{mod.title}</h1>
          <p style={{ fontSize: 20, color: 'var(--ink-2)', maxWidth: '52ch' }}>{mod.tagline} {mod.description}</p>
          {next && (
            <Link to={`/learn/${mod.id}/${next.id}`} className="btn btn-primary btn-lg">
              {p.done === 0 ? 'Start lesson 1' : `Continue: ${next.title}`} <ArrowRight size={20} aria-hidden="true" />
            </Link>
          )}
          {!next && <p className="tag" style={{ background: 'var(--ok-soft)', color: 'var(--ok)' }}>Module complete: +{XP.moduleBonus} XP bonus earned</p>}
        </div>
        <ProgressRing pct={p.pct} size={140} stroke={12} color={mod.color} label={`${p.done}/${p.total}`} />
      </header>

      <h2 style={{ fontSize: 24 }}>Lessons</h2>
      <ol className="lesson-list">
        {mod.lessons.map((l, i) => {
          const done = lessonComplete(progress, l.id);
          const lp = progress.lessons[l.id];
          const status = done ? `Complete · ${lessonXp(progress, l.id)} XP` : lp ? 'In progress' : `${l.minutes} min`;
          return (
            <li key={l.id}>
              <Link to={`/learn/${mod.id}/${l.id}`} className="card lesson-row" data-testid="lesson-row">
                <span className={`num ${done ? 'done' : ''}`} aria-hidden="true">
                  {done ? <Check size={20} /> : i + 1}
                </span>
                <span className="body">
                  <strong>{l.title}</strong>
                  <span>{l.summary}</span>
                </span>
                <span className="status">{status}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      <p className="muted" style={{ marginTop: 'var(--s5)' }}>
        Finish all {mod.lessons.length} lessons to earn a {XP.moduleBonus} XP bonus and the module badge.
      </p>
    </div>
  );
}
