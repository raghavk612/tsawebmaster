import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { useProgress } from '../state/ProgressContext';
import { AVATARS, validateName } from '../state/profiles';
import { Avatar } from '../components/Avatar';
import { useTitle } from '../components/useTitle';

export default function SignIn() {
  useTitle('Sign in');
  const { profiles, profile, createProfile, signIn, deleteProfile, leaderboard, xp } = useProgress();
  const nav = useNavigate();
  const [mode, setMode] = useState<'pick' | 'create'>(profiles.length ? 'pick' : 'create');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string>(AVATARS[0].id);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const rows = leaderboard();
  const xpById = Object.fromEntries(rows.map((r) => [r.profile.id, r]));

  const liveError = touched ? validateName(name, { activeId: null, profiles }) : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const err = validateName(name, { activeId: null, profiles });
    setError(err);
    if (err) return;
    createProfile(name, avatar);
    nav('/dashboard');
  };

  return (
    <div className="container signin">
      <header className="page-head" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Your profile</span>
        <h1>{mode === 'create' ? 'Create your learner profile' : 'Who’s learning today?'}</h1>
        <p style={{ margin: '0 auto' }}>
          Profiles save your XP, badges, and lessons on this device, so classmates who share a computer each keep their own progress.
        </p>
      </header>

      <div className="seg-tabs" role="tablist" aria-label="Sign in options">
        <button role="tab" aria-selected={mode === 'pick'} onClick={() => setMode('pick')} disabled={!profiles.length}>
          Sign in{profiles.length ? ` (${profiles.length})` : ''}
        </button>
        <button role="tab" aria-selected={mode === 'create'} onClick={() => setMode('create')}>
          New profile
        </button>
      </div>

      {mode === 'pick' ? (
        <section className="profile-grid" aria-label="Profiles on this device">
          {profiles.map((p) => {
            const active = profile?.id === p.id;
            return (
              <div className={`profile-tile ${active ? 'active' : ''}`} key={p.id} data-testid="profile-tile">
                <button
                  className="profile-pick"
                  onClick={() => {
                    signIn(p.id);
                    nav('/dashboard');
                  }}
                  aria-label={`Sign in as ${p.name}`}
                >
                  <Avatar id={p.avatar} size={72} />
                  <strong>{p.name}</strong>
                  <span>
                    {xpById[p.id]?.xp ?? 0} XP · {xpById[p.id]?.level}
                  </span>
                  {active && <span className="tag">Signed in</span>}
                </button>
                {confirmDelete === p.id ? (
                  <div className="tile-confirm">
                    <span>Delete {p.name} and all progress?</span>
                    <button className="btn btn-danger" onClick={() => { deleteProfile(p.id); setConfirmDelete(null); }}>Delete</button>
                    <button className="btn btn-ghost" onClick={() => setConfirmDelete(null)}>Keep</button>
                  </div>
                ) : (
                  <button className="icon-btn" onClick={() => setConfirmDelete(p.id)} aria-label={`Delete profile ${p.name}`}>
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            );
          })}
          <button className="profile-tile add" onClick={() => setMode('create')}>
            <UserPlus size={32} aria-hidden="true" />
            <strong>Add a profile</strong>
          </button>
        </section>
      ) : (
        <form className="card signin-form" onSubmit={submit} noValidate>
          <div className="signin-preview" aria-hidden="true">
            <Avatar id={avatar} size={96} />
            <strong>{name.trim() || 'Your nickname'}</strong>
          </div>
          <label htmlFor="nick" className="field-label">Nickname</label>
          <p className="hint" id="nick-hint">2–20 characters. Use a nickname, not your full name.</p>
          <input
            id="nick"
            className={`field ${liveError || error ? 'invalid' : ''}`}
            value={name}
            maxLength={24}
            autoComplete="off"
            aria-describedby="nick-hint nick-err"
            aria-invalid={!!(liveError || error)}
            onChange={(e) => { setName(e.target.value); setTouched(true); setError(null); }}
            placeholder="e.g. PixelPanda"
          />
          <p className="field-error" id="nick-err" role="alert">{liveError ?? error ?? ''}</p>

          <fieldset className="avatar-pick">
            <legend className="field-label">Pick your robot</legend>
            {AVATARS.map((a) => (
              <label key={a.id} className={`avatar-opt ${avatar === a.id ? 'on' : ''}`}>
                <input type="radio" name="avatar" value={a.id} checked={avatar === a.id} onChange={() => setAvatar(a.id)} className="sr-only" />
                <Avatar id={a.id} size={48} title={`Robot ${a.id.replace('bot-', '')}`} />
              </label>
            ))}
          </fieldset>

          {!profile && xp > 0 && (
            <p className="feedback info" style={{ marginTop: 0 }}>You have {xp} XP as a guest. It will move into your new profile.</p>
          )}
          <button className="btn btn-primary btn-lg" type="submit" style={{ width: '100%' }}>
            Create profile & start <ArrowRight size={20} aria-hidden="true" />
          </button>
        </form>
      )}

      <p className="signin-note">
        <ShieldCheck size={18} aria-hidden="true" /> No email, no password, nothing leaves this device.{' '}
        <Link to="/learn">Or keep learning as a guest</Link>
      </p>
    </div>
  );
}
