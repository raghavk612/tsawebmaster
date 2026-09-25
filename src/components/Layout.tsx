import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Award, BookOpen, LayoutDashboard, Library, Menu, Sparkles, Star, Users, X } from 'lucide-react';
import { LogoMark } from './Logo';
import { useProgress } from '../state/ProgressContext';
import { site } from '../data/site';

const links = [
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/glossary', label: 'Glossary', icon: Library },
  { to: '/about', label: 'About', icon: Users },
];

function Nav() {
  const { xp, level } = useProgress();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" aria-label={`${site.name} home`}>
          <LogoMark />
          <span>{site.name}</span>
        </Link>
        <button
          className="btn btn-ghost menu-btn"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="sr-only">Menu</span>
        </button>
        <nav aria-label="Main">
          <ul id="main-nav" className={`nav-links${open ? ' open' : ''}`}>
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to}>
                  <Icon size={18} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to="/dashboard" className="xp-pill" aria-label={`${xp} XP, level ${level.name}. Open dashboard`}>
                <Star size={16} aria-hidden="true" fill="currentColor" />
                {xp} XP · {level.name}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Link to="/" className="brand" style={{ fontSize: 18 }}>
            <LogoMark size={26} />
            {site.name}
          </Link>
          <p style={{ margin: '8px 0 0', maxWidth: '42ch' }}>
            A free AI learning portal for high school students. Built for the {site.event}.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul>
            <li><Link to="/learn">All modules</Link></li>
            <li><Link to="/glossary">Glossary</Link></li>
            <li><Link to="/about">About the team</Link></li>
            <li><Link to="/references">References &amp; copyright</Link></li>
            <li><Link to="/work-log">Work log</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

function Toasts() {
  const { toasts, dismiss } = useProgress();
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind === 'badge' ? 'badge-t' : ''}`} role="status">
          <span className="icon" aria-hidden="true">
            {t.kind === 'badge' ? <Award size={20} /> : <Sparkles size={20} />}
          </span>
          <div>
            <strong>{t.title}</strong>
            {t.body && <p>{t.body}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    // On client-side navigation, move focus to the new page so screen readers
    // announce it. Skip the first load so Tab still reaches the skip link first.
    if (first.current) {
      first.current = false;
      return;
    }
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

export function Layout() {
  const { canSave } = useProgress();
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      {!canSave && (
        <div className="notice" role="status">
          Your browser is blocking storage, so progress will reset when you close this tab.
        </div>
      )}
      <Nav />
      <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
        <Outlet />
      </main>
      <Footer />
      <Toasts />
    </>
  );
}
