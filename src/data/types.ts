export type ModuleId = 'fundamentals' | 'tools' | 'ethics';

export type Section =
  | { kind: 'text'; heading?: string; body: string[] }
  | { kind: 'callout'; tone: 'tip' | 'warn' | 'fact'; title: string; body: string }
  | { kind: 'list'; heading?: string; items: { term: string; detail: string }[] }
  | { kind: 'compare'; heading?: string; columns: { title: string; points: string[] }[] }
  /** A quick, ungraded question that must be answered before continuing. */
  | { kind: 'checkpoint'; question: string; choices: string[]; answer: number; explain: string }
  /** An interactive explorable. */
  | { kind: 'widget'; widget: WidgetId; heading?: string; caption?: string };

export type WidgetId = 'family-tree' | 'threshold' | 'neuron' | 'temperature' | 'prompt-compare' | 'bias';

export interface QuizQuestion {
  prompt: string;
  choices: string[];
  answer: number;
  explain: string;
}

/* ---------- Activity configs ---------- */
export interface SortActivity {
  type: 'sort';
  title: string;
  instructions: string;
  buckets: string[];
  items: { text: string; bucket: number; why: string }[];
}
export interface TrainSpamActivity {
  type: 'train-spam';
  title: string;
  instructions: string;
  training: { text: string; spam: boolean }[];
  test: { text: string; spam: boolean }[];
}
export interface NextTokenActivity {
  type: 'next-token';
  title: string;
  instructions: string;
  rounds: { context: string; options: { word: string; p: number }[] }[];
}
export interface PromptBuilderActivity {
  type: 'prompt-builder';
  title: string;
  instructions: string;
  base: string;
  parts: { id: string; label: string; text: string; good: boolean; why: string }[];
}
export interface SpotActivity {
  type: 'spot';
  title: string;
  instructions: string;
  question: string;
  sentences: { text: string; wrong: boolean; why: string }[];
}
export interface ScenarioActivity {
  type: 'scenario';
  title: string;
  instructions: string;
  scenarios: {
    situation: string;
    options: { text: string; best: boolean; feedback: string }[];
  }[];
}
export type Activity =
  | SortActivity
  | TrainSpamActivity
  | NextTokenActivity
  | PromptBuilderActivity
  | SpotActivity
  | ScenarioActivity;

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  sections: Section[];
  activity: Activity;
  quiz: QuizQuestion[];
}

export interface Module {
  id: ModuleId;
  number: number;
  title: string;
  tagline: string;
  description: string;
  color: string;
  lessons: Lesson[];
}
