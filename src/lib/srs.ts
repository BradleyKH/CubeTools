export type Grade = 'again' | 'hard' | 'good' | 'easy';

export interface CardState {
  caseId: string;
  ease: number;
  intervalDays: number;
  /** Epoch ms when the card is next due; 0 for a card that has never been reviewed. */
  due: number;
  reps: number;
  lapses: number;
  lastRecognitionMs?: number;
}

export const DAY_MS = 86_400_000;
export const RELEARN_MS = 10 * 60_000;
export const INITIAL_EASE = 2.5;
export const MIN_EASE = 1.3;

export function newCard(caseId: string): CardState {
  return { caseId, ease: INITIAL_EASE, intervalDays: 0, due: 0, reps: 0, lapses: 0 };
}

const clampEase = (ease: number) => Math.max(MIN_EASE, Math.round(ease * 100) / 100);

export function review(
  state: CardState,
  grade: Grade,
  now: number,
  recognitionMs?: number,
): CardState {
  const next: CardState = { ...state };
  if (recognitionMs !== undefined) next.lastRecognitionMs = recognitionMs;

  if (grade === 'again') {
    // A lapse restarts the ladder so the next success returns to a one-day interval.
    next.lapses = state.reps > 0 ? state.lapses + 1 : state.lapses;
    next.reps = 0;
    next.intervalDays = 0;
    next.ease = clampEase(state.ease - 0.2);
    next.due = now + RELEARN_MS;
    return next;
  }

  let interval: number;
  if (state.reps === 0) {
    interval = grade === 'easy' ? 4 : 1;
  } else if (grade === 'hard') {
    interval = Math.max(state.intervalDays + 1, Math.ceil(state.intervalDays * 1.2));
  } else if (grade === 'good') {
    interval = state.reps === 1 ? 3 : Math.round(state.intervalDays * state.ease);
    interval = Math.max(interval, state.intervalDays + 1);
  } else {
    interval = Math.round(state.intervalDays * state.ease * 1.3);
    interval = Math.max(interval, state.intervalDays + 2);
  }

  if (grade === 'hard') next.ease = clampEase(state.ease - 0.15);
  if (grade === 'easy') next.ease = clampEase(state.ease + 0.15);
  next.reps = state.reps + 1;
  next.intervalDays = interval;
  next.due = now + interval * DAY_MS;
  return next;
}

/**
 * Case ids to study now: overdue cards (oldest due first), then new cards in
 * the order given. Cards scheduled for the future are left out.
 */
export function dueCards(
  states: Record<string, CardState>,
  caseIds: string[],
  now: number,
): string[] {
  const overdue: { id: string; due: number }[] = [];
  const fresh: string[] = [];
  for (const id of caseIds) {
    const state = states[id];
    if (!state || state.due === 0) fresh.push(id);
    else if (state.due <= now) overdue.push({ id, due: state.due });
  }
  overdue.sort((a, b) => a.due - b.due);
  return [...overdue.map((c) => c.id), ...fresh];
}
