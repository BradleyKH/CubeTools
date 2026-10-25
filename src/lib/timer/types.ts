export type Penalty = 'none' | '+2' | 'DNF';

export const PENALTIES: readonly Penalty[] = ['none', '+2', 'DNF'];

export interface Solve {
  id: string;
  /** Raw time on the clock in milliseconds, before any penalty. */
  ms: number;
  penalty: Penalty;
  scramble: string;
  /** WCA event id, e.g. `333`. */
  eventId: string;
  /** Epoch milliseconds when the solve finished. */
  at: number;
  comment?: string;
}

export interface Session {
  id: string;
  name: string;
  eventId: string;
  /** Oldest first; stats treat the last element as the current solve. */
  solves: Solve[];
  createdAt: number;
}

export const INSPECTION_SECONDS = [8, 10, 12, 15, 20] as const;

export type InspectionSetting = 'off' | (typeof INSPECTION_SECONDS)[number];

export interface TimerSettings {
  inspection: InspectionSetting;
  /** Default event for new sessions. */
  eventId: string;
  holdDelayMs: number;
  hideTimeWhileSolving: boolean;
}

export interface TimerData {
  version: 1;
  sessions: Session[];
  currentSessionId: string;
  settings: TimerSettings;
}
