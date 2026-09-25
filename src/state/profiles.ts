/**
 * Local "sign in": nickname profiles stored only on this device.
 * No passwords, no server. Several students can share one computer and
 * each keep their own progress. Pure functions; storage lives in the provider.
 */

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export interface Registry {
  activeId: string | null;
  profiles: Profile[];
}

export const REGISTRY_KEY = 'neuronquest.profiles.v1';
export const GUEST_KEY = 'neuronquest.progress.v1';

export const AVATARS = [
  { id: 'bot-violet', color: '#5536E8', face: 'smile' },
  { id: 'bot-green', color: '#0B7A5C', face: 'grin' },
  { id: 'bot-coral', color: '#C23A2F', face: 'wink' },
  { id: 'bot-gold', color: '#B7791F', face: 'smile' },
  { id: 'bot-ink', color: '#17142E', face: 'cool' },
  { id: 'bot-sky', color: '#1F6FB2', face: 'grin' },
  { id: 'bot-pink', color: '#B8327A', face: 'wink' },
  { id: 'bot-teal', color: '#0E7490', face: 'cool' },
] as const;

export const emptyRegistry = (): Registry => ({ activeId: null, profiles: [] });

export const progressKey = (profileId: string | null) => (profileId ? `${GUEST_KEY}.${profileId}` : GUEST_KEY);

export function validateName(raw: string, reg: Registry = emptyRegistry()): string | null {
  const name = raw.trim();
  if (name.length < 2) return 'Nicknames need at least 2 characters.';
  if (name.length > 20) return 'Keep nicknames to 20 characters or fewer.';
  if (!/^[\p{L}\p{N} _-]+$/u.test(name)) return 'Use only letters, numbers, spaces, _ or -.';
  if (reg.profiles.some((p) => p.name.toLowerCase() === name.toLowerCase())) return 'That nickname is already on this device. Pick another or sign in to it.';
  return null;
}

export function addProfile(reg: Registry, input: { name: string; avatar: string }, id: string, now: number): Registry {
  const profile: Profile = { id, name: input.name.trim(), avatar: input.avatar, createdAt: now };
  return { activeId: id, profiles: [...reg.profiles, profile] };
}

export function setActive(reg: Registry, id: string | null): Registry {
  if (id !== null && !reg.profiles.some((p) => p.id === id)) return reg;
  return { ...reg, activeId: id };
}

export function removeProfile(reg: Registry, id: string): Registry {
  return {
    activeId: reg.activeId === id ? null : reg.activeId,
    profiles: reg.profiles.filter((p) => p.id !== id),
  };
}

export function parseRegistry(raw: string | null): Registry {
  if (!raw) return emptyRegistry();
  try {
    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.profiles)) return emptyRegistry();
    const profiles: Profile[] = data.profiles.filter(
      (p: Partial<Profile>) =>
        p && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.avatar === 'string' && typeof p.createdAt === 'number',
    ).map((p: Profile) => ({ id: p.id, name: p.name, avatar: p.avatar, createdAt: p.createdAt }));
    const activeId = profiles.some((p) => p.id === data.activeId) ? (data.activeId as string) : null;
    return { activeId, profiles };
  } catch {
    return emptyRegistry();
  }
}
