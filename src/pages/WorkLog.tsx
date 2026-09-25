import { FileText } from 'lucide-react';
import { worklog } from '../data/worklog';
import { site } from '../data/site';
import { useTitle } from '../components/useTitle';

const fmt = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function WorkLog() {
  useTitle('Work Log');
  const total = worklog.reduce((s, e) => s + e.hours, 0);
  return (
    <div className="container">
      <header className="page-head">
        <span className="eyebrow">{site.event}</span>
        <h1>Student work log</h1>
        <p>A record of our team’s work sessions on {site.name}, from the first brainstorm to launch.</p>
        {site.workLogPdf && (
          <a className="btn btn-secondary" href={site.workLogPdf} target="_blank" rel="noreferrer">
            <FileText size={18} aria-hidden="true" /> Official TSA work log (PDF)
          </a>
        )}
      </header>
      {worklog.length === 0 ? (
        <div className="empty card">No work sessions logged yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th scope="col">Date</th><th scope="col">Team member(s)</th><th scope="col">Task</th><th scope="col">Hours</th></tr>
            </thead>
            <tbody>
              {worklog.map((e, i) => (
                <tr key={i}>
                  <td style={{ whiteSpace: 'nowrap' }}>{fmt(e.date)}</td>
                  <td>{e.who}</td>
                  <td>{e.task}</td>
                  <td>{e.hours}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={3}>Total</td><td>{total}</td></tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
