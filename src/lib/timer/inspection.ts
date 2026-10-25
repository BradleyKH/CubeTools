import type { InspectionSetting, Penalty } from './types';

/** WCA allows starting up to 2 seconds past the inspection limit for a +2. */
export const PLUS_TWO_GRACE_MS = 2000;

export type InspectionPhase = 'inspecting' | 'plus2' | 'dnf' | 'done' | 'cancelled';

export interface InspectionState {
  phase: InspectionPhase;
  durationMs: number;
  startedAt: number;
  /** Warning offsets (ms after start) already emitted. */
  warned: number[];
  /** Penalty fixed by `finishInspection`, or `DNF` once inspection expires. */
  penalty: Penalty;
}

export type InspectionEvent =
  | { type: 'warning'; atSeconds: number }
  | { type: 'plus2' }
  | { type: 'dnf' };

export function inspectionDurationMs(setting: InspectionSetting): number | null {
  return setting === 'off' ? null : setting * 1000;
}

/**
 * Warnings sit 7 and 3 seconds before the limit, which for the standard 15 s
 * gives the "8 seconds" and "12 seconds" calls WCA judges make.
 */
export function warningOffsetsMs(durationMs: number): number[] {
  return [durationMs - 7000, durationMs - 3000].filter((ms) => ms > 0);
}

/** Penalty for starting the solve `elapsedMs` after inspection began. */
export function penaltyForElapsed(elapsedMs: number, durationMs: number): Penalty {
  if (elapsedMs <= durationMs) return 'none';
  if (elapsedMs <= durationMs + PLUS_TWO_GRACE_MS) return '+2';
  return 'DNF';
}

export function startInspection(durationMs: number, now: number): InspectionState {
  return { phase: 'inspecting', durationMs, startedAt: now, warned: [], penalty: 'none' };
}

function isActive(state: InspectionState): boolean {
  return state.phase === 'inspecting' || state.phase === 'plus2';
}

/**
 * Advances inspection to `now`, returning events crossed since the last tick
 * in time order. Call it from an animation frame or interval; once the phase
 * is `dnf` the attempt is over and should be recorded as DNF.
 */
export function tickInspection(
  state: InspectionState,
  now: number,
): { state: InspectionState; events: InspectionEvent[] } {
  if (!isActive(state)) return { state, events: [] };
  const elapsed = now - state.startedAt;
  const events: InspectionEvent[] = [];
  const warned = [...state.warned];
  for (const offset of warningOffsetsMs(state.durationMs)) {
    if (elapsed >= offset && !warned.includes(offset)) {
      warned.push(offset);
      events.push({ type: 'warning', atSeconds: offset / 1000 });
    }
  }
  const penalty = penaltyForElapsed(elapsed, state.durationMs);
  let phase: InspectionPhase = state.phase;
  if (penalty !== 'none' && phase === 'inspecting') {
    phase = 'plus2';
    events.push({ type: 'plus2' });
  }
  if (penalty === 'DNF') {
    phase = 'dnf';
    events.push({ type: 'dnf' });
  }
  return { state: { ...state, phase, warned, penalty: phase === 'dnf' ? 'DNF' : state.penalty }, events };
}

/** Ends inspection because the solve started at `now`; the returned penalty applies to that solve. */
export function finishInspection(state: InspectionState, now: number): { state: InspectionState; penalty: Penalty } {
  if (!isActive(state)) return { state, penalty: state.penalty };
  const penalty = penaltyForElapsed(now - state.startedAt, state.durationMs);
  return { state: { ...state, phase: penalty === 'DNF' ? 'dnf' : 'done', penalty }, penalty };
}

export function cancelInspection(state: InspectionState): InspectionState {
  return isActive(state) ? { ...state, phase: 'cancelled' } : state;
}

/**
 * What the inspection display shows: whole seconds remaining (counting down
 * from the duration, never below 1 while inside it), then `+2`, then `DNF`.
 */
export function inspectionDisplay(state: InspectionState, now: number): number | '+2' | 'DNF' {
  const elapsed = now - state.startedAt;
  const penalty = state.phase === 'dnf' ? 'DNF' : penaltyForElapsed(elapsed, state.durationMs);
  if (penalty !== 'none') return penalty;
  return Math.max(1, Math.ceil((state.durationMs - elapsed) / 1000));
}
