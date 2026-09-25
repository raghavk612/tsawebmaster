import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Gamepad2, Trophy, ShieldCheck } from 'lucide-react';
import { modules } from '../data/modules';
import { badges } from '../data/badges';
import { ModuleCard } from '../components/ModuleCard';
import { HeroArt } from '../components/HeroArt';
import { useProgress } from '../state/ProgressContext';
import { nextLesson } from '../state/nextLesson';
import { useTitle } from '../components/useTitle';

export default function Home() {
  useTitle('');
  const { progress, xp, level, badges: earned } = useProgress();
  const next = nextLesson(progress);
  const started = xp > 0;
  const lessonCount = modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <>
      <section className="container hero">
        <div>
          <span className="eyebrow">Free AI course for grades 9–12</span>
          <h1>
            Understand AI. <em>Use it well.</em> Level up.
          </h1>
          <p className="hero-lede">
            Short, interactive lessons on how AI works, how to use it for school, and how to use it ethically. Earn XP and badges as you go.
          </p>
          <div className="btn-row">
            {next ? (
              <Link to={`/learn/${next.mod.id}/${next.lesson.id}`} className="btn btn-primary btn-lg">
                {started ? `Continue: ${next.lesson.title}` : 'Start learning'} <ArrowRight size={20} aria-hidden="true" />
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                See your achievements <Trophy size={20} aria-hidden="true" />
              </Link>
            )}
            <Link to="/learn" className="btn btn-secondary btn-lg">
              Browse modules
            </Link>
          </div>
          <div className="stat-strip" aria-label="Course at a glance">
            <div><strong>{modules.length}</strong>modules</div>
            <div><strong>{lessonCount}</strong>hands-on lessons</div>
            <div><strong>{badges.length}</strong>badges to earn</div>
            {started && (
              <div><strong>{xp} XP</strong>{level.name} · {earned.length} badges</div>
            )}
          </div>
        </div>
        <HeroArt />
      </section>

      <section className="container section" aria-labelledby="modules-h">
        <div className="section-head">
          <div>
            <h2 id="modules-h">Three modules, one goal: AI literacy</h2>
            <p>Take them in order, or jump to what you need.</p>
          </div>
          <Link to="/learn" className="btn btn-ghost">
            All modules <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-3">
          {modules.map((m) => (
            <ModuleCard key={m.id} mod={m} />
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="how-h">
        <h2 id="how-h">How it works</h2>
        <div className="grid grid-3" style={{ marginTop: 'var(--s5)' }}>
          {[
            { icon: BookOpen, title: 'Learn in 10 minutes', body: 'Each lesson is a short read with real examples, not jargon.' },
            { icon: Gamepad2, title: 'Practice by doing', body: 'Train a spam filter, rebuild a weak prompt, catch a chatbot’s hallucinations, and make tough ethical calls.' },
            { icon: Trophy, title: 'Earn XP and badges', body: 'Pass quizzes to complete lessons. Your dashboard tracks every module, level, and badge.' },
          ].map(({ icon: Icon, title, body }) => (
            <div className="card" key={title}>
              <Icon size={28} color="var(--primary)" aria-hidden="true" />
              <h3 style={{ marginTop: 'var(--s3)' }}>{title}</h3>
              <p className="muted" style={{ margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="card" style={{ display: 'flex', gap: 'var(--s4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ShieldCheck size={36} color="var(--m2)" aria-hidden="true" />
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{ marginBottom: 4 }}>No account. No tracking.</h3>
            <p className="muted" style={{ margin: 0 }}>
              Your progress is saved only in this browser. Nothing you type here is sent anywhere, which fits what Module 3 teaches about privacy.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
