import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { curriculum } from '../data/modules';
import { badgeById } from '../data/badges';
import {
  initialProgress,
  levelFor,
  maxXp,
  parseStored,
  reduce,
  totalXp,
  unlockedBadges,
  type Action,
  type Progress,
} from './progress';

export const STORAGE_KEY = 'neuronquest.progress.v1';

export interface Toast {
  id: number;
  kind: 'xp' | 'badge' | 'level' | 'info';
  title: string;
  body?: string;
}

interface Ctx {
  progress: Progress;
  xp: number;
  max: number;
  level: ReturnType<typeof levelFor>;
  badges: string[];
  canSave: boolean;
  dispatch: (a: Action) => void;
  toasts: Toast[];
  dismiss: (id: number) => void;
}

const ProgressCtx = createContext<Ctx | null>(null);

function readStorage(): { state: Progress; canSave: boolean } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return { state: parseStored(raw), canSave: true };
  } catch {
    return { state: initialProgress(), canSave: false };
  }
}

let toastSeq = 1;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [{ state: loaded, canSave: initialCanSave }] = useState(readStorage);
  const [progress, setProgress] = useState<Progress>(loaded);
  const [canSave, setCanSave] = useState(initialCanSave);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const progressRef = useRef(progress);

  useEffect(() => {
    if (!canSave) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      setCanSave(false);
    }
  }, [progress, canSave]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastSeq++;
    setToasts((ts) => [...ts.slice(-3), { ...t, id }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 5000);
  }, []);

  const dispatch = useCallback(
    (action: Action) => {
      const before = progressRef.current;
      const after = reduce(before, action);
      progressRef.current = after;
      setProgress(after);
      if (action.type === 'reset') {
        push({ kind: 'info', title: 'Progress reset', body: 'Fresh start! Your XP and badges are cleared.' });
        return;
      }
      const xpBefore = totalXp(before, curriculum);
      const xpAfter = totalXp(after, curriculum);
      if (xpAfter > xpBefore) {
        push({ kind: 'xp', title: `+${xpAfter - xpBefore} XP`, body: `You now have ${xpAfter} XP.` });
      }
      const lvBefore = levelFor(xpBefore);
      const lvAfter = levelFor(xpAfter);
      if (lvAfter.index > lvBefore.index) {
        push({ kind: 'level', title: `Level up: ${lvAfter.name}!`, body: lvAfter.next ? `Next level at ${lvAfter.next.min} XP.` : 'You reached the top level.' });
      }
      const had = new Set(unlockedBadges(before, curriculum));
      for (const id of unlockedBadges(after, curriculum)) {
        if (!had.has(id) && badgeById[id]) {
          push({ kind: 'badge', title: `Badge unlocked: ${badgeById[id].name}`, body: badgeById[id].description });
        }
      }
    },
    [push],
  );

  const dismiss = useCallback((id: number) => setToasts((ts) => ts.filter((t) => t.id !== id)), []);

  const value = useMemo<Ctx>(() => {
    const xp = totalXp(progress, curriculum);
    return {
      progress,
      xp,
      max: maxXp(curriculum),
      level: levelFor(xp),
      badges: unlockedBadges(progress, curriculum),
      canSave,
      dispatch,
      toasts,
      dismiss,
    };
  }, [progress, canSave, dispatch, toasts, dismiss]);

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
