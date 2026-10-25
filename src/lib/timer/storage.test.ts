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
