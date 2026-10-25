import type { CardState } from './srs';

export const FLASHCARD_STORAGE_KEY = 'cubetools.flashcards.v1';
const VERSION = 1;

export type DisplayMode = 'case-to-alg' | 'alg-to-case' | 'both';
export type StudyMode = 'drill' | 'review';

export interface SetPrefs {
  selectedGroupIds: string[];
  selectedCaseIds: string[];
  displayMode: DisplayMode;
  shuffle: boolean;
  studyMode: StudyMode;
  preferredAlgIndex: Record<string, number>;
  cards: Record<string, CardState>;
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

const DISPLAY_MODES: DisplayMode[] = ['case-to-alg', 'alg-to-case', 'both'];
const STUDY_MODES: StudyMode[] = ['drill', 'review'];

export function defaultSetPrefs(): SetPrefs {
  return {
    selectedGroupIds: [],
    selectedCaseIds: [],
    displayMode: 'case-to-alg',
    shuffle: false,
    studyMode: 'drill',
    preferredAlgIndex: {},
    cards: {},
  };
}

function defaultStorage(): StorageLike | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

const stringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

function sanitizeCard(caseId: string, v: unknown): CardState | null {
  if (!isRecord(v)) return null;
  if (
    !isFiniteNumber(v.ease) ||
    !isFiniteNumber(v.intervalDays) ||
    !isFiniteNumber(v.due) ||
    !isFiniteNumber(v.reps) ||
    !isFiniteNumber(v.lapses)
  ) {
    return null;
  }
  const card: CardState = {
    caseId,
    ease: v.ease,
    intervalDays: v.intervalDays,
    due: v.due,
    reps: v.reps,
    lapses: v.lapses,
  };
  if (isFiniteNumber(v.lastRecognitionMs)) card.lastRecognitionMs = v.lastRecognitionMs;
  return card;
}

function sanitizePrefs(v: unknown): SetPrefs {
  const prefs = defaultSetPrefs();
  if (!isRecord(v)) return prefs;
  prefs.selectedGroupIds = stringArray(v.selectedGroupIds);
  prefs.selectedCaseIds = stringArray(v.selectedCaseIds);
  if (DISPLAY_MODES.includes(v.displayMode as DisplayMode)) {
    prefs.displayMode = v.displayMode as DisplayMode;
  }
  if (STUDY_MODES.includes(v.studyMode as StudyMode)) prefs.studyMode = v.studyMode as StudyMode;
  if (typeof v.shuffle === 'boolean') prefs.shuffle = v.shuffle;
  if (isRecord(v.preferredAlgIndex)) {
    for (const [id, idx] of Object.entries(v.preferredAlgIndex)) {
      if (Number.isInteger(idx) && (idx as number) >= 0) prefs.preferredAlgIndex[id] = idx as number;
    }
  }
  if (isRecord(v.cards)) {
    for (const [id, raw] of Object.entries(v.cards)) {
      const card = sanitizeCard(id, raw);
      if (card) prefs.cards[id] = card;
    }
  }
  return prefs;
}

function readSets(storage: StorageLike | null): Record<string, unknown> {
  if (!storage) return {};
  try {
    const raw = storage.getItem(FLASHCARD_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== VERSION || !isRecord(parsed.sets)) return {};
    return parsed.sets;
  } catch {
    return {};
  }
}

export function loadSetPrefs(setId: string, storage: StorageLike | null = defaultStorage()): SetPrefs {
  return sanitizePrefs(readSets(storage)[setId]);
}

/** Returns false when the write failed (storage unavailable or full). */
export function saveSetPrefs(
  setId: string,
  prefs: SetPrefs,
  storage: StorageLike | null = defaultStorage(),
): boolean {
  if (!storage) return false;
  try {
    const sets = { ...readSets(storage), [setId]: prefs };
    storage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify({ version: VERSION, sets }));
    return true;
  } catch {
    return false;
  }
}
