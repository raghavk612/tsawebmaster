import { useState } from 'react';

const parts = [
  { id: 'role', label: 'Role', text: 'Act as a patient biology tutor.', color: '#5536E8' },
  { id: 'task', label: 'Task', text: 'Explain how vaccines train the immune system', color: '#0B7A5C' },
  { id: 'context', label: 'Context', text: 'for a 9th grader who knows what cells are but not antibodies.', color: '#C23A2F' },
  { id: 'format', label: 'Format', text: 'Use one analogy and 3 short bullet points, then ask me one question.', color: '#B7791F' },
] as const;

const specificAnswer: { text: string; from: (typeof parts)[number]['id'] }[] = [
  { text: 'Great question! Let’s build on what you know about cells.', from: 'role' },
  { text: 'Think of a vaccine like a “wanted poster” for a germ: your body sees what the invader looks like without the real danger.', from: 'format' },
  { text: '• Antibodies are proteins your immune cells make to grab specific germs.', from: 'context' },
  { text: '• A vaccine shows your immune system a harmless piece or copy of a germ.', from: 'task' },
  { text: '• Memory cells remember it, so if the real germ shows up you respond much faster.', from: 'task' },
  { text: 'Quick check: why might you need a booster shot?', from: 'format' },
];

export function PromptCompare() {
  const [mode, setMode] = useState<'vague' | 'specific'>('vague');
  const [focus, setFocus] = useState<string | null>(null);
  return (
    <div>
      <div className="seg-tabs" role="tablist" aria-label="Prompt version">
        <button role="tab" aria-selected={mode === 'vague'} onClick={() => setMode('vague')}>Vague prompt</button>
        <button role="tab" aria-selected={mode === 'specific'} onClick={() => setMode('specific')}>Specific prompt</button>
      </div>
      <div className="chat">
        <div className="bubble me">
          {mode === 'vague' ? (
            'Tell me about vaccines.'
          ) : (
            parts.map((p) => (
              <button
                key={p.id}
                className={`seg-part ${focus === p.id ? 'on' : ''}`}
                style={{ ['--c' as string]: p.color }}
                onMouseEnter={() => setFocus(p.id)}
                onFocus={() => setFocus(p.id)}
                onClick={() => setFocus(focus === p.id ? null : p.id)}
                aria-pressed={focus === p.id}
              >
                <small>{p.label}</small> {p.text}{' '}
              </button>
            ))
          )}
        </div>
        <div className="bubble ai" aria-live="polite">
          {mode === 'vague' ? (
            <p style={{ margin: 0 }}>
              Vaccines are biological preparations that provide active acquired immunity to a particular infectious disease. They typically contain an agent
              resembling a disease-causing microorganism, often made from weakened or killed forms of the microbe, its toxins, or one of its surface proteins…
              <em className="muted"> (continues for 6 more paragraphs)</em>
            </p>
          ) : (
            specificAnswer.map((l, i) => {
              const c = parts.find((p) => p.id === l.from)!.color;
              return (
                <p key={i} className={`ans-line ${focus && focus !== l.from ? 'dim' : ''}`} style={{ ['--c' as string]: c }}>{l.text}</p>
              );
            })
          )}
        </div>
      </div>
      <p className="feedback info" role="status">
        {mode === 'vague'
          ? 'Accurate, but generic, too advanced, and hard to study from. Switch to the specific prompt.'
          : 'Hover or tap each colored part of the prompt to see which part of the answer it shaped.'}
      </p>
      <p className="muted" style={{ fontSize: 14, margin: '8px 0 0' }}>Example responses written by our team to illustrate typical AI output.</p>
    </div>
  );
}
