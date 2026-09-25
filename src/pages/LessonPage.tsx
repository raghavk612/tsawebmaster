import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Circle, Clock, Gamepad2, ListChecks, LayoutDashboard } from 'lucide-react';
import { findLesson } from '../data/modules';
import { useProgress } from '../state/ProgressContext';
import { lessonComplete, lessonXp, PASS_MARK, XP } from '../state/progress';
import { SectionView } from '../components/SectionView';
import { ActivityRunner } from '../activities/ActivityRunner';
import { Quiz } from '../components/Quiz';
import { moduleStyle } from '../components/moduleStyle';
import { useTitle } from '../components/useTitle';
import NotFound from './NotFound';

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const found = findLesson(moduleId, lessonId);
  const { progress, dispatch } = useProgress();
  useTitle(found ? found.lesson.title : 'Not found');
  if (!found) return <NotFound />;

  const { mod, lesson, index, next, prev } = found;
  const lp = progress.lessons[lesson.id];
  const activityDone = !!lp?.activityDone;
  const quizPassed = (lp?.quizBest ?? 0) >= PASS_MARK;
  const complete = lessonComplete(progress, lesson.id);
  const maxLessonXp = XP.activity + lesson.quiz.length * XP.perCorrect;

  const nextLink = next ? (
    <Link to={`/learn/${mod.id}/${next.id}`} className="btn btn-primary">
      Next lesson: {next.title} <ArrowRight size={18} aria-hidden="true" />
    </Link>
  ) : (
    <Link to="/dashboard" className="btn btn-primary">
      Module finished: view dashboard <LayoutDashboard size={18} aria-hidden="true" />
    </Link>
  );

  const steps = [
    { label: 'Read the lesson', done: activityDone || (lp?.quizAttempts ?? 0) > 0 },
    { label: `Activity (+${XP.activity} XP)`, done: activityDone },
    { label: `Quiz: ${PASS_MARK}/${lesson.quiz.length} to pass`, done: quizPassed },
  ];

  return (
    <div className="container" style={moduleStyle(mod.id, mod.color)}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/learn">Learn</Link> <span aria-hidden="true">/</span>
        <Link to={`/learn/${mod.id}`}>Module {mod.number}: {mod.title}</Link> <span aria-hidden="true">/</span>
        <span aria-current="page">Lesson {index + 1}</span>
      </nav>

      <div className="lesson-layout">
        <article className="lesson-article">
          <span className="eyebrow" style={{ color: mod.color }}>
            Lesson {mod.number}.{index + 1} · <Clock size={14} aria-hidden="true" /> {lesson.minutes} min
          </span>
          <h1>{lesson.title}</h1>
          <p style={{ fontSize: 20, color: 'var(--ink-2)' }}>{lesson.summary}</p>

          {lesson.sections.map((s, i) => (
            <SectionView key={i} section={s} />
          ))}

          <section className="panel" aria-labelledby="activity-h" data-testid="activity">
            <div className="panel-head">
              <Gamepad2 size={24} color={mod.color} aria-hidden="true" />
              <h2 id="activity-h">{lesson.activity.title}</h2>
              <span className="tag">{activityDone ? 'Done ✓' : `+${XP.activity} XP`}</span>
            </div>
            <div className="panel-body">
              <p className="instructions">{lesson.activity.instructions}</p>
              <ActivityRunner
                key={lesson.id}
                activity={lesson.activity}
                onComplete={(score) => dispatch({ type: 'activity', lessonId: lesson.id, score, kind: lesson.activity.type })}
              />
            </div>
          </section>

          <section className="panel" aria-labelledby="quiz-h" data-testid="quiz">
            <div className="panel-head">
              <ListChecks size={24} color={mod.color} aria-hidden="true" />
              <h2 id="quiz-h">Check your understanding</h2>
              <span className="tag">{quizPassed ? 'Passed ✓' : `Up to +${lesson.quiz.length * XP.perCorrect} XP`}</span>
            </div>
            <div className="panel-body">
              <Quiz
                key={lesson.id}
                questions={lesson.quiz}
                best={lp?.quizBest ?? null}
                onFinish={(correct) => dispatch({ type: 'quiz', lessonId: lesson.id, correct, total: lesson.quiz.length })}
              />
            </div>
          </section>

          {complete && (
            <div className="done-banner" role="status" data-testid="lesson-complete">
              <Check size={22} aria-hidden="true" /> Lesson complete: {lessonXp(progress, lesson.id)} / {maxLessonXp} XP
              {nextLink}
            </div>
          )}
          {!complete && (activityDone || (lp?.quizAttempts ?? 0) > 0) && (
            <p className="muted" style={{ marginTop: 'var(--s4)' }}>
              {!activityDone ? 'Finish the activity to complete this lesson.' : `Score at least ${PASS_MARK} on the quiz to complete this lesson.`}
            </p>
          )}

          <div className="btn-row" style={{ justifyContent: 'space-between', marginTop: 'var(--s6)' }}>
            {prev ? (
              <Link to={`/learn/${mod.id}/${prev.id}`} className="btn btn-ghost">
                <ArrowLeft size={18} aria-hidden="true" /> {prev.title}
              </Link>
            ) : (
              <Link to={`/learn/${mod.id}`} className="btn btn-ghost">
                <ArrowLeft size={18} aria-hidden="true" /> Module overview
              </Link>
            )}
            {next && (
              <Link to={`/learn/${mod.id}/${next.id}`} className="btn btn-ghost">
                {next.title} <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
          </div>
        </article>

        <aside className="lesson-steps card" aria-label="Lesson checklist">
          <strong style={{ fontFamily: 'var(--font-head)', fontSize: 18 }}>Your checklist</strong>
          <ol>
            {steps.map((s) => (
              <li key={s.label} className={s.done ? 'done' : ''}>
                {s.done ? <Check size={18} aria-hidden="true" /> : <Circle size={18} aria-hidden="true" />}
                {s.label}
                <span className="sr-only">{s.done ? '(done)' : '(not done)'}</span>
              </li>
            ))}
          </ol>
          <p className="muted" style={{ fontSize: 14, margin: 'var(--s4) 0 0' }}>
            Lesson XP: <strong>{lessonXp(progress, lesson.id)}</strong> / {maxLessonXp}
          </p>
        </aside>
      </div>
    </div>
  );
}
