import { describe, expect, it } from 'vitest';
import {
  emptyRegistry,
  validateName,
  addProfile,
  removeProfile,
  setActive,
  parseRegistry,
  progressKey,
  GUEST_KEY,
  AVATARS,
} from './profiles';

describe('validateName', () => {
  it('accepts 2–20 letters, numbers, spaces, _ and -', () => {
    expect(validateName('Ada')).toBeNull();
    expect(validateName('  robo_fan-9 ')).toBeNull();
  });
  it('rejects too short, too long, or odd characters', () => {
    expect(validateName('a')).toMatch(/at least 2/);
    expect(validateName('x'.repeat(21))).toMatch(/20 characters/);
    expect(validateName('hi<script>')).toMatch(/letters, numbers/);
  });
  it('rejects duplicates, ignoring case', () => {
    const reg = addProfile(emptyRegistry(), { name: 'Nova', avatar: AVATARS[0].id }, 'p1', 0);
    expect(validateName('nova', reg)).toMatch(/already/);
  });
});

describe('registry', () => {
  it('adds a trimmed profile and makes it active', () => {
    const reg = addProfile(emptyRegistry(), { name: '  Nova ', avatar: 'bot-violet' }, 'p1', 123);
    expect(reg.profiles).toEqual([{ id: 'p1', name: 'Nova', avatar: 'bot-violet', createdAt: 123 }]);
    expect(reg.activeId).toBe('p1');
  });
  it('switches and signs out', () => {
    let reg = addProfile(emptyRegistry(), { name: 'Nova', avatar: 'bot-violet' }, 'p1', 0);
    reg = addProfile(reg, { name: 'Zed', avatar: 'bot-green' }, 'p2', 0);
    expect(setActive(reg, 'p1').activeId).toBe('p1');
    expect(setActive(reg, null).activeId).toBeNull();
    expect(setActive(reg, 'nope').activeId).toBe(reg.activeId);
  });
  it('removing the active profile signs out', () => {
    const reg = addProfile(emptyRegistry(), { name: 'Nova', avatar: 'bot-violet' }, 'p1', 0);
    const out = removeProfile(reg, 'p1');
    expect(out.profiles).toHaveLength(0);
    expect(out.activeId).toBeNull();
  });
  it('progress keys: guest keeps the original key, profiles get their own', () => {
    expect(progressKey(null)).toBe(GUEST_KEY);
    expect(progressKey('p1')).toBe(`${GUEST_KEY}.p1`);
  });
  it('parseRegistry survives garbage and drops invalid rows', () => {
    expect(parseRegistry(null)).toEqual(emptyRegistry());
    expect(parseRegistry('{oops')).toEqual(emptyRegistry());
    const raw = JSON.stringify({ activeId: 'gone', profiles: [{ id: 'p1', name: 'Nova', avatar: 'bot-violet', createdAt: 1 }, { id: 5 }] });
    expect(parseRegistry(raw)).toEqual({ activeId: null, profiles: [{ id: 'p1', name: 'Nova', avatar: 'bot-violet', createdAt: 1 }] });
  });
});
