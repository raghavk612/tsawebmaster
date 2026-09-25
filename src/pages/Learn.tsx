import { modules } from '../data/modules';
import { ModuleCard } from '../components/ModuleCard';
import { useTitle } from '../components/useTitle';

export default function Learn() {
  useTitle('Learn');
  return (
    <div className="container">
      <header className="page-head">
        <span className="eyebrow">Learning modules</span>
        <h1>Pick your path</h1>
        <p>
          Start with How AI Works if you’re new, then level up your skills in Tools &amp; Techniques and finish with Using AI Ethically. Complete a
          lesson by finishing its activity and scoring at least 2 out of 3 on its quiz.
        </p>
      </header>
      <div className="grid grid-3">
        {modules.map((m) => (
          <ModuleCard key={m.id} mod={m} />
        ))}
      </div>
    </div>
  );
}
