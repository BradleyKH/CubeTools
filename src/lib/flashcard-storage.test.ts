import { describe, expect, it } from 'vitest';
import {
  FLASHCARD_STORAGE_KEY,
  defaultSetPrefs,
  loadSetPrefs,
  saveSetPrefs,
  type SetPrefs,
} from './flashcard-storage';

function memoryStorage(initial?: string) {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(FLASHCARD_STORAGE_KEY, initial);
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  };
}

const sample: SetPrefs = {
  selectedGroupIds: ['g1'],
  selectedCaseIds: ['oll-27', 'oll-28'],
  displayMode: 'both',
  shuffle: true,
  studyMode: 'review',
  preferredAlgIndex: { 'oll-27': 1 },
  cards: {
    'oll-27': {
      caseId: 'oll-27',
      ease: 2.3,
      intervalDays: 3,
      due: 5000,
      reps: 2,
      lapses: 1,
      lastRecognitionMs: 900,
    },
  },
};

describe('flashcard storage', () => {
  it('round trips per set without touching other sets', () => {
    const s = memoryStorage();
    expect(saveSetPrefs('oll', sample, s)).toBe(true);
    const other = { ...defaultSetPrefs(), shuffle: true };
    saveSetPrefs('pll', other, s);
    expect(loadSetPrefs('oll', s)).toEqual(sample);
    expect(loadSetPrefs('pll', s)).toEqual(other);
  });

  it('returns defaults for empty storage', () => {
    expect(loadSetPrefs('oll', memoryStorage())).toEqual(defaultSetPrefs());
  });

  it('falls back to defaults on corrupt JSON and recovers on save', () => {
    const s = memoryStorage('{not json');
    expect(loadSetPrefs('oll', s)).toEqual(defaultSetPrefs());
    expect(saveSetPrefs('oll', sample, s)).toBe(true);
    expect(loadSetPrefs('oll', s)).toEqual(sample);
  });

  it('ignores a different version', () => {
    const s = memoryStorage(JSON.stringify({ version: 99, sets: { oll: sample } }));
    expect(loadSetPrefs('oll', s)).toEqual(defaultSetPrefs());
  });

  it('drops invalid fields but keeps valid ones', () => {
    const bad = {
      ...sample,
      displayMode: 'sideways',
      studyMode: 7,
      selectedCaseIds: ['a', 3, null],
      preferredAlgIndex: { a: -1, b: 'x', c: 2 },
      cards: { a: { ease: 'x' }, b: sample.cards['oll-27'] },
    };
    const s = memoryStorage(JSON.stringify({ version: 1, sets: { oll: bad } }));
    const loaded = loadSetPrefs('oll', s);
    expect(loaded.displayMode).toBe('case-to-alg');
    expect(loaded.studyMode).toBe('drill');
    expect(loaded.selectedCaseIds).toEqual(['a']);
    expect(loaded.preferredAlgIndex).toEqual({ c: 2 });
    expect(Object.keys(loaded.cards)).toEqual(['b']);
    expect(loaded.cards.b.caseId).toBe('b');
  });

  it('never throws when storage is unavailable or failing', () => {
    expect(loadSetPrefs('oll', null)).toEqual(defaultSetPrefs());
    expect(saveSetPrefs('oll', sample, null)).toBe(false);
    const throwing = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('full');
      },
    };
    expect(loadSetPrefs('oll', throwing)).toEqual(defaultSetPrefs());
    expect(saveSetPrefs('oll', sample, throwing)).toBe(false);
  });
});
