export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'footprints' | 'cpu' | 'wrench' | 'scale' | 'target' | 'wand' | 'flame' | 'crown';
  color: string;
}

export const badges: Badge[] = [
  { id: 'first-steps', name: 'First Steps', description: 'Complete your first lesson.', icon: 'footprints', color: 'var(--primary)' },
  { id: 'fundamentals-grad', name: 'Fundamentals Grad', description: 'Finish Module 1: How AI Works.', icon: 'cpu', color: 'var(--m1)' },
  { id: 'tools-grad', name: 'Toolsmith', description: 'Finish Module 2: AI Tools & Techniques.', icon: 'wrench', color: 'var(--m2)' },
  { id: 'ethics-grad', name: 'Ethics Champion', description: 'Finish Module 3: Using AI Ethically.', icon: 'scale', color: 'var(--m3)' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Ace any quiz on your first try.', icon: 'target', color: 'var(--xp)' },
  { id: 'prompt-pro', name: 'Prompt Pro', description: 'Build a flawless prompt in the Prompt Makeover.', icon: 'wand', color: 'var(--m2)' },
  { id: 'quiz-streak', name: 'Quiz Streak', description: 'Pass 5 lesson quizzes.', icon: 'flame', color: 'var(--m3)' },
  { id: 'portal-master', name: 'Portal Master', description: 'Complete all three modules.', icon: 'crown', color: 'var(--xp)' },
];

export const badgeById = Object.fromEntries(badges.map((b) => [b.id, b]));
