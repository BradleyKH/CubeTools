import { describe, expect, it } from 'vitest';
import {
  averageOf,
  best,
  bestAverage,
  dnfCount,
  effectiveMs,
  meanOf,
  rolling,
  sessionMean,
  sessionStats,
  solveCount,
  trimCount,
  worst,
} from './stats';
import type { Penalty, Solve } from './types';

let nextId = 0;
function solve(ms: number, penalty: Penalty = 'none'): Solve {
  nextId++;
  return { id: `s${nextId}`, ms, penalty, scramble: '', eventId: '333', at: nextId };
}
const times = (...ms: number[]) => ms.map((m) => solve(m));
const DNF = (ms = 10000) => solve(ms, 'DNF');

describe('effectiveMs', () => {
  it('truncates to hundredths and applies penalties', () => {
    expect(effectiveMs(solve(9876))).toBe(9870);
    expect(effectiveMs(solve(9876, '+2'))).toBe(11870);
    expect(effectiveMs(solve(9876, 'DNF'))).toBe(Infinity);
  });
});

describe('trimCount', () => {
  it('trims 5 percent rounded up', () => {
    expect(trimCount(5)).toBe(1);
    expect(trimCount(12)).toBe(1);
    expect(trimCount(50)).toBe(3);
    expect(trimCount(100)).toBe(5);
  });
});

describe('averageOf', () => {
  it('returns null with too few solves', () => {
    expect(averageOf(times(1000, 2000, 3000, 4000), 5)).toBeNull();
    expect(averageOf([], 5)).toBeNull();
  });

  it('ao5 with no DNFs drops best and worst', () => {
    // middle three: 10.00, 11.00, 12.00
    expect(averageOf(times(9000, 10000, 11000, 12000, 20000), 5)).toBe(11000);
  });

  it('ao5 with one DNF treats it as the worst', () => {
    expect(averageOf([...times(9000, 10000, 11000, 12000), DNF()], 5)).toBe(11000);
  });

  it('ao5 with two DNFs is DNF', () => {
    expect(averageOf([...times(9000, 10000, 11000), DNF(), DNF()], 5)).toBe(Infinity);
  });

  it('uses only the most recent n solves', () => {
    expect(averageOf([DNF(), DNF(), ...times(9000, 10000, 11000, 12000, 20000)], 5)).toBe(11000);
  });

  it('rounds the mean to the nearest hundredth, halves up', () => {
    // middle three: 10.00, 10.00, 10.01 -> 10.00333 -> 10.00
    expect(averageOf(times(1000, 10000, 10000, 10010, 99000), 5)).toBe(10000);
    // middle three: 10.00, 10.01, 10.01 -> 10.00667 -> 10.01
    expect(averageOf(times(1000, 10000, 10010, 10010, 99000), 5)).toBe(10010);
    // ao12 middle ten summing to 100.05 s -> 10.005 -> 10.01
    const middle = [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10050];
    expect(averageOf(times(1000, ...middle, 99000), 12)).toBe(10010);
  });

  it('truncates singles before averaging', () => {
    expect(averageOf(times(1000, 10009, 10009, 10009, 99000), 5)).toBe(10000);
  });

  it('ao12 trims one best and one worst', () => {
    const list = times(5000, 10000, 10000, 10000, 10000, 10000, 12000, 12000, 12000, 12000, 12000, 30000);
    expect(averageOf(list, 12)).toBe(11000);
  });

  it('ao12 with one DNF counts it as worst, two DNFs is DNF', () => {
    const base = [10000, 10000, 10000, 10000, 10000, 12000, 12000, 12000, 12000, 12000];
    expect(averageOf([solve(5000), ...times(...base), DNF()], 12)).toBe(11000);
    expect(averageOf([DNF(), ...times(...base), DNF()], 12)).toBe(Infinity);
  });

  it('+2 affects which solve is trimmed', () => {
    // 9.00+2 = 11.00, so 9.50 becomes the best and is trimmed instead.
    const list = [solve(9000, '+2'), ...times(9500, 10000, 10500, 20000)];
    // middle: 10.00, 10.50, 11.00
    expect(averageOf(list, 5)).toBe(10500);
    // Without the penalty, 9.00 is trimmed and the middle is 9.50, 10.00, 10.50.
    expect(averageOf(times(9000, 9500, 10000, 10500, 20000), 5)).toBe(10000);
  });

  it('+2 can make a solve the worst', () => {
    const list = [solve(19000, '+2'), ...times(9000, 10000, 11000, 20000)];
    // 21.00 is trimmed, 20.00 counts: middle 10.00, 11.00, 20.00
    expect(averageOf(list, 5)).toBe(13670);
  });

  it('ao100 trims five from each end and tolerates five DNFs', () => {
    const list = [...Array.from({ length: 95 }, () => solve(10000)), ...Array.from({ length: 5 }, () => DNF())];
    expect(averageOf(list, 100)).toBe(10000);
    expect(averageOf([DNF(), ...list.slice(1)].concat(DNF()).slice(-100), 100)).toBe(Infinity);
  });
});

describe('meanOf', () => {
  it('mo3 is the plain mean, DNF if any DNF', () => {
    expect(meanOf(times(9000, 10000, 11000), 3)).toBe(10000);
    expect(meanOf([...times(9000, 10000), DNF()], 3)).toBe(Infinity);
    expect(meanOf(times(9000, 10000), 3)).toBeNull();
  });
});

describe('rolling', () => {
  it('has length - n + 1 entries', () => {
    const list = times(1000, 2000, 3000, 4000, 5000, 6000, 7000);
    expect(rolling(list, 5)).toHaveLength(3);
    expect(rolling(list, 5)).toEqual([3000, 4000, 5000]);
    expect(rolling(list, 3, 'mean')).toHaveLength(5);
    expect(rolling(list, 12)).toEqual([]);
    expect(rolling(times(1000, 2000, 3000, 4000, 5000), 5)).toHaveLength(1);
  });
});

describe('singles and session stats', () => {
  const list = [...times(12000, 9000), solve(8000, '+2'), DNF(), solve(15000)];

  it('best and worst', () => {
    expect(best(list)).toBe(9000);
    expect(worst(list)).toBe(Infinity);
    expect(worst(times(9000, 12000))).toBe(12000);
    expect(best([DNF()])).toBe(Infinity);
    expect(best([])).toBeNull();
    expect(worst([])).toBeNull();
  });

  it('bestAverage picks the lowest rolling average', () => {
    const series = times(20000, 10000, 10000, 10000, 10000, 10000, 30000, 30000);
    expect(bestAverage(series, 5)).toBe(10000);
    expect(bestAverage(series.slice(0, 4), 5)).toBeNull();
  });

  it('session mean excludes DNFs; counts', () => {
    // 12.00, 9.00, 10.00, 15.00 -> 11.50
    expect(sessionMean(list)).toBe(11500);
    expect(sessionMean([DNF()])).toBeNull();
    expect(solveCount(list)).toBe(5);
    expect(dnfCount(list)).toBe(1);
  });

  it('sessionStats summarizes', () => {
    const stats = sessionStats(list);
    expect(stats.single).toEqual({ current: 15000, best: 9000 });
    // 12.00, 9.00, 10.00, DNF, 15.00: middle 10.00, 12.00, 15.00
    expect(stats.ao5.current).toBe(12330);
    expect(stats.ao12).toEqual({ current: null, best: null });
    expect(stats.mo3.current).toBe(Infinity);
    expect(stats.mo3.best).toBe(10330);
    expect(stats.count).toBe(5);
    expect(stats.dnfs).toBe(1);
    expect(sessionStats([]).single).toEqual({ current: null, best: null });
  });
});
