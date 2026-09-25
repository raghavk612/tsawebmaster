import { CircleCheck, ExternalLink, FileText } from 'lucide-react';
import { assets, references } from '../data/references';
import { site } from '../data/site';
import { useTitle } from '../components/useTitle';

export default function References() {
  useTitle('References & Copyright');
  return (
    <div className="container">
      <header className="page-head">
        <span className="eyebrow">Sources &amp; permissions</span>
        <h1>References &amp; copyright checklist</h1>
        <p>Every source we researched and every third-party asset we used, with its license.</p>
      </header>

      <section aria-labelledby="refs-h">
        <h2 id="refs-h">Research sources</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Source</th><th scope="col">Publisher</th><th scope="col">Used for</th></tr>
            </thead>
            <tbody>
              {references.map((r) => (
                <tr key={r.url}>
                  <td>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      {r.title} <ExternalLink size={14} aria-label="(opens in new tab)" />
                    </a>
                  </td>
                  <td>{r.publisher}</td>
                  <td>{r.usedFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section" aria-labelledby="copy-h" id="copyright">
        <h2 id="copy-h">Student copyright checklist</h2>
        <div className="card" style={{ marginBottom: 'var(--s5)' }}>
          {site.copyrightChecklistPdf ? (
            <a className="btn btn-primary" href={site.copyrightChecklistPdf} target="_blank" rel="noreferrer">
              <FileText size={18} aria-hidden="true" /> View our signed TSA Student Copyright Checklist (PDF)
            </a>
          ) : (
            <p style={{ margin: 0 }}>
              <FileText size={18} aria-hidden="true" style={{ verticalAlign: '-3px' }} /> The signed TSA Student Copyright Checklist will be posted here
              before the state submission deadline.
            </p>
          )}
        </div>
        <ul className="check-list" style={{ marginBottom: 'var(--s5)' }}>
          {[
            'All lesson text, quizzes, activities, illustrations, and the logo are our original work.',
            'No copyrighted images, audio, or video are used anywhere on the site.',
            'Every third-party font, icon set, and code library is used under an open-source license listed below.',
            'Every fact-based claim is backed by a source listed in the table above.',
            'Case studies (e.g., Gender Shades, Reuters) are summarized in our own words and cited.',
          ].map((t) => (
            <li key={t}><CircleCheck size={18} aria-hidden="true" /> {t}</li>
          ))}
        </ul>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Asset</th><th scope="col">Creator / source</th><th scope="col">License / permission</th></tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a.item}>
                  <td>{a.item}</td>
                  <td>{a.source}</td>
                  <td>{a.url ? <a href={a.url} target="_blank" rel="noreferrer">{a.license}</a> : a.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
