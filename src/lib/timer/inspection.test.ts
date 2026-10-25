import { describe, expect, it } from 'vitest';
import {
  cancelInspection,
  finishInspection,
  inspectionDisplay,
  inspectionDurationMs,
  penaltyForElapsed,
  startInspection,
  tickInspection,
  warningOffsetsMs,
  type InspectionEvent,
} from './inspection';

const T0 = 1_000_000;

describe('penaltyForElapsed (15 s inspection)', () => {
  it.each([
    [0, 'none'],
    [14990, 'none'],
    [15000, 'none'],
    [15010, '+2'],
    [16990, '+2'],
    [17000, '+2'],
    [17010, 'DNF'],
    [60000, 'DNF'],
  ])('%i ms -> %s', (elapsed, penalty) => {
    expect(penaltyForElapsed(elapsed, 15000)).toBe(penalty);
  });
});

describe('finishInspection boundaries', () => {
  it.each([
    [14990, 'none', 'done'],
    [15000, 'none', 'done'],
    [17000, '+2', 'done'],
    [17010, 'DNF', 'dnf'],
  ])('starting the solve at %i ms gives %s', (elapsed, penalty, phase) => {
    const result = finishInspection(startInspection(15000, T0), T0 + elapsed);
    expect(result.penalty).toBe(penalty);
    expect(result.state.phase).toBe(phase);
  });

  it('is a no-op once inspection has ended', () => {
    const done = finishInspection(startInspection(15000, T0), T0 + 5000).state;
    expect(finishInspection(done, T0 + 30000)).toEqual({ state: done, penalty: 'none' });
  });
});

describe('tickInspection', () => {
  function run(durationMs: number, ticks: number[]) {
    let state = startInspection(durationMs, T0);
    const log: Array<[number, InspectionEvent]> = [];
    for (const t of ticks) {
      const result = tickInspection(state, T0 + t);
      state = result.state;
      for (const e of result.events) log.push([t, e]);
    }
    return { state, log };
  }

  it('emits 8 s and 12 s warnings once each, then +2, then DNF', () => {
    const ticks = Array.from({ length: 200 }, (_, i) => i * 100);
    const { state, log } = run(15000, ticks);
    expect(log).toEqual([
      [8000, { type: 'warning', atSeconds: 8 }],
      [12000, { type: 'warning', atSeconds: 12 }],
      [15100, { type: 'plus2' }],
      [17100, { type: 'dnf' }],
    ]);
    expect(state.phase).toBe('dnf');
    expect(state.penalty).toBe('DNF');
  });

  it('emits every crossed event in order on a late tick', () => {
    const { log } = run(15000, [20000]);
    expect(log.map(([, e]) => e.type)).toEqual(['warning', 'warning', 'plus2', 'dnf']);
  });

  it('stays in plus2 between 15 and 17 s', () => {
    const { state } = run(15000, [16000]);
    expect(state.phase).toBe('plus2');
    expect(finishInspection(state, T0 + 16500).penalty).toBe('+2');
  });

  it('does nothing after cancel', () => {
    const cancelled = cancelInspection(startInspection(15000, T0));
    expect(cancelled.phase).toBe('cancelled');
    expect(tickInspection(cancelled, T0 + 20000).events).toEqual([]);
  });
});

describe('durations and display', () => {
  it('maps settings to durations', () => {
    expect(inspectionDurationMs('off')).toBeNull();
    expect(inspectionDurationMs(8)).toBe(8000);
    expect(inspectionDurationMs(20)).toBe(20000);
  });

  it('places warnings 7 and 3 seconds before the limit', () => {
    expect(warningOffsetsMs(15000)).toEqual([8000, 12000]);
    expect(warningOffsetsMs(20000)).toEqual([13000, 17000]);
    expect(warningOffsetsMs(8000)).toEqual([1000, 5000]);
  });

  it('applies penalties relative to custom durations', () => {
    expect(penaltyForElapsed(10000, 10000)).toBe('none');
    expect(penaltyForElapsed(11000, 10000)).toBe('+2');
    expect(penaltyForElapsed(12010, 10000)).toBe('DNF');
  });

  it('counts down whole seconds, then shows +2 and DNF', () => {
    const state = startInspection(15000, T0);
    expect(inspectionDisplay(state, T0)).toBe(15);
    expect(inspectionDisplay(state, T0 + 500)).toBe(15);
    expect(inspectionDisplay(state, T0 + 1000)).toBe(14);
    expect(inspectionDisplay(state, T0 + 15000)).toBe(1);
    expect(inspectionDisplay(state, T0 + 15010)).toBe('+2');
    expect(inspectionDisplay(state, T0 + 17010)).toBe('DNF');
  });
});
