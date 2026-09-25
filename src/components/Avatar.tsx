import { AVATARS } from '../state/profiles';

/** Original robot avatars: colored head, antenna, and one of four faces. */
export function Avatar({ id, size = 36, title }: { id: string; size?: number; title?: string }) {
  const a = AVATARS.find((x) => x.id === id) ?? AVATARS[0];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <line x1="20" y1="4" x2="20" y2="10" stroke={a.color} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="4" r="3" fill="var(--xp-bright)" />
      <rect x="5" y="10" width="30" height="26" rx="10" fill={a.color} />
      <rect x="9" y="15" width="22" height="15" rx="7" fill="#fff" />
      {a.face === 'cool' ? (
        <rect x="11" y="18" width="18" height="5" rx="2.5" fill="var(--ink)" />
      ) : a.face === 'wink' ? (
        <>
          <circle cx="15.5" cy="20.5" r="2.2" fill="var(--ink)" />
          <path d="M22.5 20.5 h5" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="15.5" cy="20.5" r="2.2" fill="var(--ink)" />
          <circle cx="24.5" cy="20.5" r="2.2" fill="var(--ink)" />
        </>
      )}
      {a.face === 'grin' ? (
        <path d="M15 25 q5 4 10 0 z" fill="var(--ink)" />
      ) : (
        <path d="M15.5 25.5 q4.5 3 9 0" stroke="var(--ink)" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}
