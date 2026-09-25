import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import type { Module } from '../data/types';
import { useProgress } from '../state/ProgressContext';
import { moduleProgress } from '../state/progress';
import { ProgressRing } from './ProgressRing';
import { moduleStyle } from './moduleStyle';

export function ModuleCard({ mod }: { mod: Module }) {
  const { progress } = useProgress();
  const p = moduleProgress(progress, { id: mod.id, lessons: mod.lessons });
  const minutes = mod.lessons.reduce((s, l) => s + l.minutes, 0);
  const cta = p.done === 0 ? 'Start module' : p.done === p.total ? 'Review module' : 'Continue';
  return (
    <article className="card module-card" style={moduleStyle(mod.id, mod.color)} data-testid={`module-card-${mod.id}`}>
      <div className="module-card-top">
        <span className="module-num">Module {mod.number}</span>
        <ProgressRing pct={p.pct} size={56} stroke={6} color={mod.color} label={`${p.done}/${p.total}`} />
      </div>
      <h3>{mod.title}</h3>
      <p>{mod.description}</p>
      <div className="module-meta">
        <span><BookOpen size={16} aria-hidden="true" /> {mod.lessons.length} lessons</span>
        <span><Clock size={16} aria-hidden="true" /> ~{minutes} min</span>
      </div>
      <Link to={`/learn/${mod.id}`} className="btn btn-secondary" aria-label={`${cta}: ${mod.title}`}>
        {cta} <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}
