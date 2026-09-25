import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { glossary } from '../data/glossary';
import { useTitle } from '../components/useTitle';

export default function Glossary() {
  useTitle('Glossary');
  const [q, setQ] = useState('');
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
    return s ? list.filter((t) => t.term.toLowerCase().includes(s) || t.definition.toLowerCase().includes(s)) : list;
  }, [q]);

  return (
    <div className="container">
      <header className="page-head">
        <span className="eyebrow">Reference</span>
        <h1>AI glossary</h1>
        <p>{glossary.length} key terms in plain English, each linked to the lesson that teaches it.</p>
      </header>
      <div className="search">
        <Search size={20} aria-hidden="true" />
        <label htmlFor="gsearch" className="sr-only">Search terms</label>
        <input id="gsearch" type="search" placeholder="Search terms, e.g. token" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="sr-only" role="status">{results.length} terms shown</p>
      {results.length === 0 ? (
        <div className="empty card">
          <p style={{ fontWeight: 700, color: 'var(--ink)' }}>No terms match "{q}".</p>
          <button className="btn btn-secondary" onClick={() => setQ('')}>Clear search</button>
        </div>
      ) : (
        <div className="glossary">
          {results.map((t) => (
            <article className="card" key={t.term} data-testid="term">
              <h3>{t.term}</h3>
              <p>{t.definition}</p>
              {t.lesson && <Link to={`/learn/${t.lesson.module}/${t.lesson.lesson}`}>Learn more in the lesson →</Link>}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
