import { Link } from 'react-router-dom';
import { useTitle } from '../components/useTitle';

export default function NotFound() {
  useTitle('Page not found');
  return (
    <div className="container empty" style={{ paddingTop: 'var(--s8)' }}>
      <p className="eyebrow">404</p>
      <h1>This page hallucinated.</h1>
      <p>We couldn’t find what you were looking for. Maybe the link was mistyped?</p>
      <div className="btn-row" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">Go home</Link>
        <Link to="/learn" className="btn btn-secondary">Browse modules</Link>
      </div>
    </div>
  );
}
