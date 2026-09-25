import { Link } from 'react-router-dom';
import { Accessibility, Code2, Lock, Palette } from 'lucide-react';
import { site, team } from '../data/site';
import { useTitle } from '../components/useTitle';

export default function About() {
  useTitle('About');
  return (
    <div className="container">
      <header className="page-head">
        <span className="eyebrow">{site.event}</span>
        <h1>About {site.name}</h1>
        <p>
          We built {site.name} for this year’s theme, an <strong>{site.theme}</strong>. The goal: help high school students understand AI, use it
          effectively for school, and use it ethically.
        </p>
      </header>

      <section aria-labelledby="why-h" className="grid grid-2">
        <div>
          <h2 id="why-h">Why we built it</h2>
          <p>
            AI tools showed up in our classes faster than anyone could explain them. Some students avoid AI entirely, some rely on it too much, and
            almost everyone is unsure what’s allowed. We wanted one place that explains the technology honestly, teaches practical skills, and
            makes the ethical questions concrete.
          </p>
          <p>
            Every lesson pairs a short reading with an activity where you <em>do</em> something: train a model, rebuild a prompt, catch a
            hallucination, or make a judgment call. Gamification (XP, levels, and badges) rewards finishing and understanding, not just clicking.
          </p>
        </div>
        <div className="card">
          <h2 style={{ fontSize: 22 }}>{site.chapter}</h2>
          <p className="muted">{site.teamId}</p>
          <ul className="check-list" style={{ marginTop: 'var(--s3)' }}>
            {team.map((m) => (
              <li key={m.role}>
                <span><strong>{m.role}:</strong> {m.focus}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="how-h">
        <h2 id="how-h">How we built it</h2>
        <div className="grid grid-2" style={{ marginTop: 'var(--s4)' }}>
          {[
            { icon: Code2, title: 'Technology', body: 'React + TypeScript with Vite and React Router, deployed on Vercel. Lesson content lives in data files, so adding a lesson requires no new code. The XP/badge engine is pure functions covered by automated unit tests, and every page is checked with Playwright browser tests.' },
            { icon: Lock, title: 'Privacy by design', body: 'No accounts, no analytics, no AI API calls. Progress is stored in your browser’s localStorage, and even the spam-filter activity trains its model locally on your device.' },
            { icon: Accessibility, title: 'Accessibility', body: 'All colors meet WCAG AA contrast. Every activity works with a keyboard (no drag-only interactions). We added a skip link, visible focus states, and screen-reader announcements for feedback and rewards, and the site respects reduced-motion settings.' },
            { icon: Palette, title: 'Design', body: 'Atkinson Hyperlegible (made by the Braille Institute for readability) for body text, Bricolage Grotesque for headings, and a color for each module. All illustrations are original SVG.' },
          ].map(({ icon: Icon, title, body }) => (
            <div className="card" key={title}>
              <Icon size={26} color="var(--primary)" aria-hidden="true" />
              <h3 style={{ marginTop: 'var(--s3)' }}>{title}</h3>
              <p className="muted" style={{ margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 'var(--s5)' }}>
          See our <Link to="/references">sources and copyright checklist</Link> and our <Link to="/work-log">work log</Link>.
        </p>
      </section>
    </div>
  );
}
