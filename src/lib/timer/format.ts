import type { Penalty } from './types';
import type { StatValue } from './stats';

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Formats a time truncated to hundredths: `9.87`, `1:02.34`, `1:00:05.00`.
 * With a `+2` penalty, `ms` is the raw clock time; the 2 seconds are added
 * and a `+` appended (`11.87+`). DNF and `Infinity` format as `DNF`.
 */
export function formatMs(ms: number, penalty: Penalty = 'none'): string {
  if (penalty === 'DNF' || ms === Infinity) return 'DNF';
  if (!Number.isFinite(ms) || ms < 0) return '-';
  const totalCs = Math.floor(ms / 10) + (penalty === '+2' ? 200 : 0);
  const cs = totalCs % 100;
  const totalSeconds = Math.floor(totalCs / 100);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  let text: string;
  if (h > 0) text = `${h}:${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
  else if (m > 0) text = `${m}:${pad2(s)}.${pad2(cs)}`;
  else text = `${s}.${pad2(cs)}`;
  return penalty === '+2' ? `${text}+` : text;
}

/** Formats a stat: `-` when not enough solves, `DNF` for `Infinity`. */
export function formatStat(value: StatValue): string {
  return value === null ? '-' : formatMs(value);
}

export type ParsedTime = { ok: true; ms: number; penalty: Penalty } | { ok: false; error: string };

/**
 * Parses a manually entered time. Accepts `9.87`, `1:02.34`, `1:02:03.4`,
 * bare digits read right to left as centiseconds, seconds, minutes
 * (`987` is 9.87, `10234` is 1:02.34), and `DNF` (optionally with a time,
 * as in `DNF(9.87)`). For a +2, `9.87+2` means 9.87 on the clock, while a
 * bare trailing `+` reads the `formatMs` output, so `9.87+` is 7.87 on the
 * clock plus 2. The returned `ms` is always the raw clock time.
 */
export function parseTime(input: string): ParsedTime {
  let text = input.trim().replace(/\s+/g, '');
  if (text === '') return { ok: false, error: 'Enter a time.' };

  const dnf = /^dnf(?:\((.*)\))?$/i.exec(text);
  if (dnf) {
    if (dnf[1] === undefined || dnf[1] === '') return { ok: true, ms: 0, penalty: 'DNF' };
    const inner = parseTime(dnf[1]);
    return inner.ok ? { ok: true, ms: inner.ms, penalty: 'DNF' } : inner;
  }

  let penalty: Penalty = 'none';
  let includesPenalty = false;
  const plus = /\+(2?)$/.exec(text);
  if (plus) {
    penalty = '+2';
    includesPenalty = plus[1] === '';
    text = text.slice(0, plus.index);
  }

  const parsed = /^\d+$/.test(text) ? parseDigits(text) : parseClock(text);
  if (parsed === null) return { ok: false, error: `"${input.trim()}" is not a time. Use a format like 9.87 or 1:02.34.` };
  const ms = includesPenalty ? parsed - 2000 : parsed;
  if (ms <= 0) return { ok: false, error: 'Time must be greater than zero.' };
  return { ok: true, ms, penalty };
}

function parseDigits(digits: string): number | null {
  const n = Number(digits);
  const cs = n % 100;
  const s = Math.floor(n / 100) % 100;
  const rest = Math.floor(n / 10000);
  const m = rest % 100;
  const h = Math.floor(rest / 100);
  if (s >= 60 || m >= 60) return null;
  return (((h * 60 + m) * 60 + s) * 100 + cs) * 10;
}

function parseClock(text: string): number | null {
  const match = /^(?:(?:(\d+):)?(\d{1,2}):)?(\d+)(?:\.(\d{1,3}))?$/.exec(text);
  if (!match) return null;
  const [, h, m, s, frac] = match;
  const hasMinutes = m !== undefined;
  const seconds = Number(s);
  if (hasMinutes && (seconds >= 60 || s.length > 2)) return null;
  if (h !== undefined && Number(m) >= 60) return null;
  const fracMs = frac === undefined ? 0 : Math.floor(Number(frac.padEnd(3, '0')) / 10) * 10;
  return ((Number(h ?? 0) * 60 + Number(m ?? 0)) * 60 + seconds) * 1000 + fracMs;
}
