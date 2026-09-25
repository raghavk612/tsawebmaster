import type { Lesson, Module } from '../types';
import { fundamentals } from './fundamentals';
import { tools } from './tools';
import { ethics } from './ethics';

export const modules: Module[] = [fundamentals, tools, ethics];

export const curriculum = modules.map((m) => ({ id: m.id, lessons: m.lessons.map((l) => ({ id: l.id })) }));

export function findModule(id: string | undefined): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function findLesson(moduleId: string | undefined, lessonId: string | undefined) {
  const mod = findModule(moduleId);
  if (!mod) return undefined;
  const index = mod.lessons.findIndex((l) => l.id === lessonId);
  if (index < 0) return undefined;
  const lesson: Lesson = mod.lessons[index];
  return { mod, lesson, index, next: mod.lessons[index + 1], prev: mod.lessons[index - 1] };
}

export const allLessons = modules.flatMap((m) => m.lessons.map((l) => ({ mod: m, lesson: l })));
