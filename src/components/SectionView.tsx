import { Info, Lightbulb, TriangleAlert } from 'lucide-react';
import type { Section } from '../data/types';

const calloutIcon = { tip: Lightbulb, warn: TriangleAlert, fact: Info };

export function SectionView({ section }: { section: Section }) {
  switch (section.kind) {
    case 'text':
      return (
        <>
          {section.heading && <h2>{section.heading}</h2>}
          {section.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </>
      );
    case 'callout': {
      const Icon = calloutIcon[section.tone];
      return (
        <aside className={`callout callout-${section.tone}`}>
          <Icon size={22} aria-hidden="true" />
          <div>
            <strong>{section.title}</strong>
            <p>{section.body}</p>
          </div>
        </aside>
      );
    }
    case 'list':
      return (
        <>
          {section.heading && <h2>{section.heading}</h2>}
          <dl className="term-list">
            {section.items.map((it) => (
              <div key={it.term}>
                <dt>{it.term}</dt>
                <dd>{it.detail}</dd>
              </div>
            ))}
          </dl>
        </>
      );
    case 'compare':
      return (
        <>
          {section.heading && <h2>{section.heading}</h2>}
          <div className="compare">
            {section.columns.map((col) => (
              <div className="card" key={col.title}>
                <h3>{col.title}</h3>
                <ul>
                  {col.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      );
  }
}
