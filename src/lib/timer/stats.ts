import type { Solve } from './types';

/**
 * Stat values are milliseconds, `Infinity` for DNF, or `null` when there are
 * not enough solves to compute the stat.
 */
export type StatValue = number | null;

/** Truncates to hundredths, as WCA singles are recorded. */
export function truncateToHundredths(ms: number): number {
  return Math.floor(ms / 10) * 10;
}

export function effectiveMs(solve: Pick<Solve, 'ms' | 'penalty'>): number {
  if (solve.penalty === 'DNF') return Infinity;
  const ms = truncateToHundredths(solve.ms);
  return solve.penalty === '+2' ? ms + 2000 : ms;
}

/**
 * Mean of finite truncated times, rounded to the nearest hundredth with
 * halves rounded up. Integer arithmetic on centiseconds keeps exact halves
 * from drifting under floating point.
 */
function roundedMean(times: number[]): number {
  const sumCs = times.reduce((sum, ms) => sum + Math.round(ms / 10), 0);
  const k = times.length;
  return Math.floor((2 * sumCs + k) / (2 * k)) * 10;
}

/** Best and worst `ceil(n * 5%)` are trimmed: 1 each for ao5 and ao12, 5 for ao100. */
export function trimCount(n: number): number {
  return Math.ceil(n * 0.05);
}

function averageOfWindow(window: Solve[]): number {
  const n = window.length;
  const trim = trimCount(n);
  const times = window.map(effectiveMs).sort((a, b) => a - b);
  const dnfs = times.filter((t) => t === Infinity).length;
  if (dnfs > trim) return Infinity;
  return roundedMean(times.slice(trim, n - trim));
}

function meanOfWindow(window: Solve[]): number {
  const times = window.map(effectiveMs);
  if (times.some((t) => t === Infinity)) return Infinity;
  return roundedMean(times);
}

/** Trimmed average of the most recent `n` solves. */
export function averageOf(solves: Solve[], n: number): StatValue {
  if (n < 3 || solves.length < n) return null;
  return averageOfWindow(solves.slice(-n));
}

/** Untrimmed mean of the most recent `n` solves (mo3); any DNF makes it DNF. */
export function meanOf(solves: Solve[], n: number): StatValue {
  if (n < 1 || solves.length < n) return null;
  return meanOfWindow(solves.slice(-n));
}

/**
 * Averages (or means) of every window of `n` consecutive solves, oldest
 * first. The result has `solves.length - n + 1` entries, or none.
 */
export function rolling(solves: Solve[], n: number, kind: 'average' | 'mean' = 'average'): number[] {
  if (n < (kind === 'average' ? 3 : 1) || solves.length < n) return [];
  const fn = kind === 'average' ? averageOfWindow : meanOfWindow;
  const series: number[] = [];
  for (let end = n; end <= solves.length; end++) series.push(fn(solves.slice(end - n, end)));
  return series;
}

export function best(solves: Solve[]): StatValue {
  if (solves.length === 0) return null;
  return Math.min(...solves.map(effectiveMs));
}

export function worst(solves: Solve[]): StatValue {
  if (solves.length === 0) return null;
  return Math.max(...solves.map(effectiveMs));
}

export function bestAverage(solves: Solve[], n: number, kind: 'average' | 'mean' = 'average'): StatValue {
  const series = rolling(solves, n, kind);
  return series.length === 0 ? null : Math.min(...series);
}

/** Mean of every non-DNF solve. */
export function sessionMean(solves: Solve[]): StatValue {
  const times = solves.map(effectiveMs).filter((t) => t !== Infinity);
  return times.length === 0 ? null : roundedMean(times);
}

export function solveCount(solves: Solve[]): number {
  return solves.length;
}

export function dnfCount(solves: Solve[]): number {
  return solves.filter((s) => s.penalty === 'DNF').length;
}

export interface CurrentAndBest {
  current: StatValue;
  best: StatValue;
}

export interface SessionStats {
  single: CurrentAndBest;
  worst: StatValue;
  mo3: CurrentAndBest;
  ao5: CurrentAndBest;
  ao12: CurrentAndBest;
  ao100: CurrentAndBest;
  mean: StatValue;
  count: number;
  dnfs: number;
}

export function sessionStats(solves: Solve[]): SessionStats {
  const avg = (n: number): CurrentAndBest => ({ current: averageOf(solves, n), best: bestAverage(solves, n) });
  const last = solves.at(-1);
  return {
    single: { current: last ? effectiveMs(last) : null, best: best(solves) },
    worst: worst(solves),
    mo3: { current: meanOf(solves, 3), best: bestAverage(solves, 3, 'mean') },
    ao5: avg(5),
    ao12: avg(12),
    ao100: avg(100),
    mean: sessionMean(solves),
    count: solveCount(solves),
    dnfs: dnfCount(solves),
  };
}
