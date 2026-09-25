import { allLessons } from '../data/modules';
import { lessonComplete, type Progress } from './progress';

/** First lesson (in course order) that isn't complete yet, or null when everything is done. */
export function nextLesson(progress: Progress) {
  return allLessons.find(({ lesson }) => !lessonComplete(progress, lesson.id)) ?? null;
}
