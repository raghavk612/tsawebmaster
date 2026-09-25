/**
 * Team + submission details. Edit these before submitting.
 * Participant IDs should be the chapter's real TSA IDs; never put student
 * full names on the public site unless your advisor approves.
 */
export const site = {
  name: 'Neuron Quest',
  chapter: 'TSA Chapter',
  teamId: 'Team ID: 2027-XXXX',
  event: 'TSA High School Webmaster 2026–27',
  theme: 'Artificial Intelligence (AI) learning portal',
  /** Path to the signed TSA Student Copyright Checklist PDF in /public, or null until it's added. */
  copyrightChecklistPdf: null as string | null,
  /** Path to the exported TSA work log PDF in /public, or null to show only the on-site log. */
  workLogPdf: null as string | null,
};

export const team = [
  { role: 'Team captain', focus: 'Project management, Module 3 research' },
  { role: 'Developer', focus: 'React build, progress engine, testing' },
  { role: 'Designer', focus: 'Design system, illustrations, accessibility' },
  { role: 'Content lead', focus: 'Module 1 & 2 research, quizzes' },
];
