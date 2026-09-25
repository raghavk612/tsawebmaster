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
import {
  addProfile,
  parseRegistry,
  progressKey,
  removeProfile,
  setActive,
  REGISTRY_KEY,
  type Profile,
  type Registry,
} from './profiles';

/** Kept for backwards compatibility: guest progress uses the original key. */
export const STORAGE_KEY = progressKey(null);

export interface Toast {
  id: number;
  kind: 'xp' | 'badge' | 'level' | 'info';
  title: string;
  body?: string;
}

export interface LeaderRow {
  profile: Profile;
  xp: number;
  level: string;
  badges: number;
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
  /** increments whenever a lesson/badge celebration should fire */
  celebrate: number;
  profile: Profile | null;
  profiles: Profile[];
  createProfile: (name: string, avatar: string) => Profile;
  signIn: (id: string) => void;
  signOut: () => void;
  deleteProfile: (id: string) => void;
  leaderboard: () => LeaderRow[];
}

const ProgressCtx = createContext<Ctx | null>(null);

function read(key: string): string | null {
  return window.localStorage.getItem(key);
}

function probeStorage(): boolean {
  try {
    const k = '__nq_probe__';
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

let toastSeq = 1;
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [canSave, setCanSave] = useState(probeStorage);
  const [registry, setRegistry] = useState<Registry>(() => (canSave ? parseRegistry(read(REGISTRY_KEY)) : parseRegistry(null)));
  const [progress, setProgress] = useState<Progress>(() =>
    canSave ? parseStored(read(progressKey(registry.activeId))) : initialProgress(),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [celebrate, setCelebrate] = useState(0);
  const progressRef = useRef(progress);
  const activeRef = useRef(registry.activeId);

  const save = useCallback(
    (key: string, value: unknown) => {
      if (!canSave) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        setCanSave(false);
      }
    },
    [canSave],
  );

  useEffect(() => save(progressKey(activeRef.current), progress), [progress, save]);
  useEffect(() => save(REGISTRY_KEY, registry), [registry, save]);

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    const id = toastSeq++;
    setToasts((ts) => [...ts.slice(-2), { ...t, id }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 5000);
  }, []);

  /** Load a profile's progress (or the guest's) and make it current. */
  const switchTo = useCallback(
    (reg: Registry) => {
      activeRef.current = reg.activeId;
      const next = canSave ? parseStored(read(progressKey(reg.activeId))) : initialProgress();
      progressRef.current = next;
      setRegistry(reg);
      setProgress(next);
    },
    [canSave],
  );

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
      if (xpAfter > xpBefore) push({ kind: 'xp', title: `+${xpAfter - xpBefore} XP`, body: `You now have ${xpAfter} XP.` });
      const lvBefore = levelFor(xpBefore);
      const lvAfter = levelFor(xpAfter);
      if (lvAfter.index > lvBefore.index) {
        push({ kind: 'level', title: `Level up: ${lvAfter.name}!`, body: lvAfter.next ? `Next level at ${lvAfter.next.min} XP.` : 'You reached the top level.' });
      }
      const had = new Set(unlockedBadges(before, curriculum));
      let newBadge = false;
      for (const id of unlockedBadges(after, curriculum)) {
        if (!had.has(id) && badgeById[id]) {
          newBadge = true;
          push({ kind: 'badge', title: `Badge unlocked: ${badgeById[id].name}`, body: badgeById[id].description });
        }
      }
      if (newBadge || lvAfter.index > lvBefore.index) setCelebrate((c) => c + 1);
    },
    [push],
  );

  const createProfile = useCallback(
    (name: string, avatar: string) => {
      const id = newId();
      const reg = addProfile(registry, { name, avatar }, id, Date.now());
      // A guest who already earned XP keeps it: move guest progress into the new profile.
      const guest = activeRef.current === null ? progressRef.current : null;
      if (guest && Object.keys(guest.lessons).length > 0) {
        save(progressKey(id), guest);
        save(progressKey(null), initialProgress());
      }
      switchTo(reg);
      const profile = reg.profiles[reg.profiles.length - 1];
      push({ kind: 'info', title: `Welcome, ${profile.name}!`, body: 'Your progress now saves to your profile.' });
      return profile;
    },
    [registry, save, switchTo, push],
  );

  const signIn = useCallback(
    (id: string) => {
      const reg = setActive(registry, id);
      switchTo(reg);
      const p = reg.profiles.find((x) => x.id === id);
      if (p) push({ kind: 'info', title: `Welcome back, ${p.name}!` });
    },
    [registry, switchTo, push],
  );

  const signOut = useCallback(() => {
    switchTo(setActive(registry, null));
    push({ kind: 'info', title: 'Signed out', body: 'You’re now learning as a guest.' });
  }, [registry, switchTo, push]);

  const deleteProfile = useCallback(
    (id: string) => {
      const reg = removeProfile(registry, id);
      if (canSave) {
        try {
          window.localStorage.removeItem(progressKey(id));
        } catch {
          /* ignore */
        }
      }
      if (registry.activeId === id) switchTo(reg);
      else setRegistry(reg);
    },
    [registry, canSave, switchTo],
  );

  const leaderboard = useCallback((): LeaderRow[] => {
    return registry.profiles
      .map((profile) => {
        const p = profile.id === registry.activeId ? progress : canSave ? parseStored(read(progressKey(profile.id))) : initialProgress();
        const xp = totalXp(p, curriculum);
        return { profile, xp, level: levelFor(xp).name, badges: unlockedBadges(p, curriculum).length };
      })
      .sort((a, b) => b.xp - a.xp || a.profile.name.localeCompare(b.profile.name));
  }, [registry, progress, canSave]);

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
      celebrate,
      profile: registry.profiles.find((p) => p.id === registry.activeId) ?? null,
      profiles: registry.profiles,
      createProfile,
      signIn,
      signOut,
      deleteProfile,
      leaderboard,
    };
  }, [progress, canSave, dispatch, toasts, dismiss, celebrate, registry, createProfile, signIn, signOut, deleteProfile, leaderboard]);

  return <ProgressCtx.Provider value={value}>{children}</ProgressCtx.Provider>;
}

export function useProgress(): Ctx {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
