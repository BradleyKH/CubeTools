import { describe, expect, it } from 'vitest';
import {
  CSV_HEADER,
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  createSession,
  defaultTimerData,
  exportCsv,
  exportJson,
  importJson,
  loadTimerData,
  sanitizeTimerData,
  saveTimerData,
  sessionForEvent,
  type KeyValueStorage,
} from './storage';
import type { TimerData } from './types';

function memoryStorage(initial?: Record<string, string>): KeyValueStorage & { map: Map<string, string> } {
  const map = new Map(Object.entries(initial ?? {}));
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => void map.set(key, value),
  };
}

const throwingStorage: KeyValueStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

function sampleData(): TimerData {
  const session = createSession('Main', '333', 1000);
  session.solves.push(
    { id: 'a', ms: 9876, penalty: 'none', scramble: "R U R' U'", eventId: '333', at: 2000 },
    { id: 'b', ms: 11000, penalty: '+2', scramble: 'F2 B2', eventId: '333', at: 3000, comment: 'pop, "bad"' },
    { id: 'c', ms: 12000, penalty: 'DNF', scramble: 'L D', eventId: '333', at: 4000 },
  );
  const oh = createSession('OH', '333oh', 5000);
  return {
    version: 1,
    sessions: [session, oh],
    currentSessionId: oh.id,
    settings: { inspection: 'off', eventId: '333oh', holdDelayMs: 550, hideTimeWhileSolving: true },
  };
}

describe('load and save', () => {
  it('round trips through storage', () => {
    const storage = memoryStorage();
    const data = sampleData();
    expect(saveTimerData(data, storage)).toBe(true);
    expect(storage.map.has(STORAGE_KEY)).toBe(true);
    expect(loadTimerData(storage)).toEqual(data);
  });

  it('falls back to defaults when nothing is saved', () => {
    const data = loadTimerData(memoryStorage());
    expect(data.sessions).toHaveLength(1);
    expect(data.sessions[0].solves).toEqual([]);
    expect(data.currentSessionId).toBe(data.sessions[0].id);
    expect(data.settings).toEqual(DEFAULT_SETTINGS);
  });

  it.each(['{not json', 'null', '42', '[]', '{"version":2,"sessions":[]}', ''])(
    'falls back to defaults on corrupt data %j',
    (text) => {
      const data = loadTimerData(memoryStorage({ [STORAGE_KEY]: text }));
      expect(data.sessions).toHaveLength(1);
      expect(data.settings).toEqual(DEFAULT_SETTINGS);
    },
  );

  it('never throws when storage is unavailable', () => {
    expect(() => loadTimerData(throwingStorage)).not.toThrow();
    expect(loadTimerData(throwingStorage).sessions).toHaveLength(1);
    expect(loadTimerData(null).sessions).toHaveLength(1);
    expect(saveTimerData(sampleData(), throwingStorage)).toBe(false);
    expect(saveTimerData(sampleData(), null)).toBe(false);
  });
});

describe('sanitizeTimerData', () => {
  it('drops malformed solves and sessions and repairs settings', () => {
    const raw = {
      version: 1,
      currentSessionId: 'missing',
      settings: { inspection: 9, holdDelayMs: -1, hideTimeWhileSolving: 'yes', eventId: 222 },
      sessions: [
        'junk',
        { name: 'no id' },
        {
          id: 's1',
          name: '',
          eventId: '222',
          solves: [
            { id: 'ok', ms: 5000, penalty: 'bogus', at: 1 },
            { id: 'neg', ms: -1, penalty: 'none', at: 1 },
            { id: 'nan', ms: 'fast', penalty: 'none', at: 1 },
            { ms: 5000, penalty: 'none', at: 1 },
            null,
          ],
        },
        { id: 's1', name: 'duplicate', solves: [] },
      ],
    };
    const data = sanitizeTimerData(raw)!;
    expect(data.sessions).toHaveLength(1);
    expect(data.currentSessionId).toBe('s1');
    expect(data.sessions[0].name).toBe('Session');
    expect(data.sessions[0].solves).toEqual([
      { id: 'ok', ms: 5000, penalty: 'none', scramble: '', eventId: '222', at: 1 },
    ]);
    expect(data.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('creates a session when none survive', () => {
    const data = sanitizeTimerData({ version: 1, sessions: [] })!;
    expect(data.sessions).toHaveLength(1);
    expect(data.currentSessionId).toBe(data.sessions[0].id);
  });

  it('rejects non-documents', () => {
    expect(sanitizeTimerData(null)).toBeNull();
    expect(sanitizeTimerData({ sessions: [] })).toBeNull();
  });
});

describe('import and export', () => {
  it('JSON round trip', () => {
    const data = sampleData();
    expect(importJson(exportJson(data))).toEqual({ ok: true, data });
  });

  it('reports invalid imports', () => {
    expect(importJson('nope')).toMatchObject({ ok: false });
    expect(importJson('{"foo":1}')).toMatchObject({ ok: false });
  });

  it('exports CSV with escaping and penalties', () => {
    const csv = exportCsv(sampleData().sessions);
    const lines = csv.trimEnd().split('\r\n');
    expect(lines[0]).toBe(CSV_HEADER.join(','));
    expect(lines).toHaveLength(4);
    expect(lines[1]).toBe("Main,333,1,9.87,none,9.87,R U R' U',1970-01-01T00:00:02.000Z,");
    expect(lines[2]).toBe('Main,333,2,11.00,+2,13.00,F2 B2,1970-01-01T00:00:03.000Z,"pop, ""bad"""');
    expect(lines[3]).toBe('Main,333,3,12.00,DNF,DNF,L D,1970-01-01T00:00:04.000Z,');
  });

  it('exports only a header for empty sessions', () => {
    expect(exportCsv([createSession('Empty', '333')])).toBe(CSV_HEADER.join(',') + '\r\n');
  });

  it('defaultTimerData gives unique session ids', () => {
    expect(defaultTimerData().sessions[0].id).not.toBe(defaultTimerData().sessions[0].id);
  });
});

describe('sessionForEvent', () => {
  const solve = (at: number, eventId = '333') => ({ id: `s${at}`, ms: 1000, penalty: 'none' as const, scramble: '', eventId, at });

  it('changes an empty current session in place', () => {
    const data = defaultTimerData(1);
    const { data: next, outcome } = sessionForEvent(data, '222', 5);
    expect(outcome).toBe('changed');
    expect(next.sessions).toHaveLength(1);
    expect(next.sessions[0].eventId).toBe('222');
    expect(next.settings.eventId).toBe('222');
  });

  it('creates a named session and leaves the solved one alone', () => {
    const data = defaultTimerData(1);
    data.sessions[0].solves.push(solve(2), solve(3));
    const { data: next, outcome } = sessionForEvent(data, '222', 5);
    expect(outcome).toBe('created');
    expect(next.sessions).toHaveLength(2);
    expect(next.sessions[0].eventId).toBe('333');
    expect(next.sessions[0].solves).toHaveLength(2);
    expect(next.sessions[1].name).toBe('2x2x2 Session');
    expect(next.currentSessionId).toBe(next.sessions[1].id);
  });

  it('switches back to the most recent session for the event', () => {
    const data = defaultTimerData(1);
    data.sessions[0].solves.push(solve(2));
    const second = { ...createSession('Other', '333', 3), solves: [solve(10)] };
    const two = { ...createSession('Two', '222', 4), solves: [solve(6, '222')] };
    data.sessions.push(two, second);
    data.currentSessionId = two.id;
    const { data: next, outcome } = sessionForEvent(data, '333', 20);
    expect(outcome).toBe('switched');
    expect(next.currentSessionId).toBe(second.id);
    expect(next.sessions).toHaveLength(3);
  });

  it('prefers an existing session for the event over retagging an empty one', () => {
    const data = defaultTimerData(1);
    data.sessions[0].solves.push(solve(2));
    const empty = createSession('Empty', '222', 3);
    data.sessions.push(empty);
    data.currentSessionId = empty.id;
    const { data: next, outcome } = sessionForEvent(data, '333', 5);
    expect(outcome).toBe('switched');
    expect(next.currentSessionId).toBe(data.sessions[0].id);
    expect(next.sessions[1].eventId).toBe('222');
  });

  it('does nothing when the event already matches', () => {
    const { data: next, outcome } = sessionForEvent(defaultTimerData(1), '333', 5);
    expect(outcome).toBe('unchanged');
    expect(next.sessions).toHaveLength(1);
  });

  it('numbers the name when it is taken', () => {
    const data = defaultTimerData(1);
    data.sessions[0].solves.push(solve(2));
    data.sessions.push({ ...createSession('2x2x2 Session', '444', 3), solves: [solve(4, '444')] });
    const { data: next } = sessionForEvent(data, '222', 5);
    expect(next.sessions.at(-1)?.name).toBe('2x2x2 Session 2');
  });
});
