export interface LogEntry {
  date: string; // YYYY-MM-DD
  hours: number;
  who: string;
  task: string;
}

/** Keep this up to date every work session; judges review it. */
export const worklog: LogEntry[] = [
  { date: '2026-09-25', hours: 1, who: 'Whole team', task: 'Kickoff: reviewed the 2026–27 Webmaster brief, listed requirements, chose the concept and name, set up the repository.' },
];
