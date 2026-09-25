import type { CSSProperties } from 'react';
import type { ModuleId } from '../data/types';

const soft: Record<ModuleId, string> = { fundamentals: 'var(--m1-soft)', tools: 'var(--m2-soft)', ethics: 'var(--m3-soft)' };

export const moduleStyle = (id: ModuleId, color: string) =>
  ({ '--accent': color, '--soft': soft[id] }) as CSSProperties;
