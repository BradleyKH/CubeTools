import { effectiveMs } from './stats';
import { formatMs } from './format';
import {
  INSPECTION_SECONDS,
  PENALTIES,
  type InspectionSetting,
  type Penalty,
  type Session,
  type Solve,
  type TimerData,
  type TimerSettings,
} from './types';

export const STORAGE_KEY = 'cubetools.timer.v1';

export const MAX_HOLD_DELAY_MS = 2000;

export const DEFAULT_SETTINGS: TimerSettings = {
  inspection: 15,
  eventId: '333',
  holdDelayMs: 300,
  hideTimeWhileSolving: false,
};

/** Minimal slice of the Web Storage API, so tests can pass an in-memory store. */
export type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>;

/** `localStorage`, or null where it is missing or access throws (private mode, blocked site data). */
export function browserStorage(): KeyValueStorage | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createSession(name: string, eventId: string, now: number = Date.now()): Session {
  return { id: newId(), name, eventId, solves: [], createdAt: now };
}

export function defaultTimerData(now: number = Date.now()): TimerData {
  const session = createSession('Session 1', DEFAULT_SETTINGS.eventId, now);
  return { version: 1, sessions: [session], currentSessionId: session.id, settings: { ...DEFAULT_SETTINGS } };
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isString = (v: unknown): v is string => typeof v === 'string';

function sanitizeSolve(raw: unknown, fallbackEventId: string): Solve | null {
  if (!isRecord(raw) || !isString(raw.id) || !isFiniteNumber(raw.ms) || raw.ms < 0 || !isFiniteNumber(raw.at)) {
    return null;
  }
  const penalty: Penalty = PENALTIES.includes(raw.penalty as Penalty) ? (raw.penalty as Penalty) : 'none';
  const solve: Solve = {
    id: raw.id,
    ms: raw.ms,
    penalty,
    scramble: isString(raw.scramble) ? raw.scramble : '',
    eventId: isString(raw.eventId) ? raw.eventId : fallbackEventId,
    at: raw.at,
  };
  if (isString(raw.comment) && raw.comment !== '') solve.comment = raw.comment;
  return solve;
}

function sanitizeSession(raw: unknown): Session | null {
  if (!isRecord(raw) || !isString(raw.id)) return null;
  const eventId = isString(raw.eventId) ? raw.eventId : DEFAULT_SETTINGS.eventId;
  const solves = Array.isArray(raw.solves)
    ? raw.solves.map((s) => sanitizeSolve(s, eventId)).filter((s): s is Solve => s !== null)
    : [];
  return {
    id: raw.id,
    name: isString(raw.name) && raw.name.trim() !== '' ? raw.name : 'Session',
    eventId,
    solves,
    createdAt: isFiniteNumber(raw.createdAt) ? raw.createdAt : solves[0]?.at ?? Date.now(),
  };
}

function sanitizeSettings(raw: unknown): TimerSettings {
  const s = isRecord(raw) ? raw : {};
  const inspection: InspectionSetting =
    s.inspection === 'off' || INSPECTION_SECONDS.includes(s.inspection as (typeof INSPECTION_SECONDS)[number])
      ? (s.inspection as InspectionSetting)
      : DEFAULT_SETTINGS.inspection;
  return {
    inspection,
    eventId: isString(s.eventId) && s.eventId !== '' ? s.eventId : DEFAULT_SETTINGS.eventId,
    holdDelayMs:
      isFiniteNumber(s.holdDelayMs) && s.holdDelayMs >= 0 && s.holdDelayMs <= MAX_HOLD_DELAY_MS
        ? Math.round(s.holdDelayMs)
        : DEFAULT_SETTINGS.holdDelayMs,
    hideTimeWhileSolving:
      typeof s.hideTimeWhileSolving === 'boolean' ? s.hideTimeWhileSolving : DEFAULT_SETTINGS.hideTimeWhileSolving,
  };
}

/**
 * Coerces untrusted data into valid `TimerData`, dropping malformed sessions
 * and solves rather than rejecting the whole document. Returns null only when
 * the input is not a version 1 timer document at all.
 */
export function sanitizeTimerData(raw: unknown): TimerData | null {
  if (!isRecord(raw) || raw.version !== 1) return null;
  const sessions: Session[] = [];
  for (const item of Array.isArray(raw.sessions) ? raw.sessions : []) {
    const session = sanitizeSession(item);
    if (session && !sessions.some((s) => s.id === session.id)) sessions.push(session);
  }
  const settings = sanitizeSettings(raw.settings);
  if (sessions.length === 0) sessions.push(createSession('Session 1', settings.eventId));
  const currentSessionId =
    isString(raw.currentSessionId) && sessions.some((s) => s.id === raw.currentSessionId)
      ? raw.currentSessionId
      : sessions[0].id;
  return { version: 1, sessions, currentSessionId, settings };
}

/** Reads saved timer data, falling back to defaults on missing, corrupt, or inaccessible storage. Never throws. */
export function loadTimerData(storage: KeyValueStorage | null = browserStorage()): TimerData {
  try {
    const text = storage?.getItem(STORAGE_KEY);
    if (text) return sanitizeTimerData(JSON.parse(text)) ?? defaultTimerData();
  } catch {
    // Corrupt JSON or a storage access error: start fresh.
  }
  return defaultTimerData();
}

/** Returns false when storage is unavailable or full. Never throws. */
export function saveTimerData(data: TimerData, storage: KeyValueStorage | null = browserStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function exportJson(data: TimerData): string {
  return JSON.stringify(data, null, 2);
}

export type ImportResult = { ok: true; data: TimerData } | { ok: false; error: string };

export function importJson(text: string): ImportResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'The file is not valid JSON.' };
  }
  const data = sanitizeTimerData(raw);
  return data ? { ok: true, data } : { ok: false, error: 'The file is not a Cube Tools timer export.' };
}

function csvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export const CSV_HEADER = ['Session', 'Event', 'No.', 'Time', 'Penalty', 'Result', 'Scramble', 'Date', 'Comment'];

/** One row per solve, oldest first within each session. `Time` is the raw clock time; `Result` includes the penalty. */
export function exportCsv(sessions: Session[]): string {
  const rows = [CSV_HEADER];
  for (const session of sessions) {
    session.solves.forEach((solve, i) => {
      rows.push([
        session.name,
        solve.eventId,
        String(i + 1),
        formatMs(solve.ms),
        solve.penalty,
        formatMs(effectiveMs(solve)),
        solve.scramble,
        new Date(solve.at).toISOString(),
        solve.comment ?? '',
      ]);
    });
  }
  return rows.map((row) => row.map(csvField).join(',')).join('\r\n') + '\r\n';
}
