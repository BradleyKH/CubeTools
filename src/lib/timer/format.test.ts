import { describe, expect, it } from 'vitest';
import { formatMs, formatStat, parseTime } from './format';

describe('formatMs', () => {
  it.each([
    [9870, '9.87'],
    [9879, '9.87'],
    [0, '0.00'],
    [500, '0.50'],
    [59990, '59.99'],
    [60000, '1:00.00'],
    [62340, '1:02.34'],
    [600000, '10:00.00'],
    [3605000, '1:00:05.00'],
  ])('%i -> %s', (ms, text) => {
    expect(formatMs(ms)).toBe(text);
  });

  it('formats penalties', () => {
    expect(formatMs(7870, '+2')).toBe('9.87+');
    expect(formatMs(58500, '+2')).toBe('1:00.50+');
    expect(formatMs(9870, 'DNF')).toBe('DNF');
    expect(formatMs(Infinity)).toBe('DNF');
  });

  it('handles invalid input', () => {
    expect(formatMs(NaN)).toBe('-');
    expect(formatMs(-5)).toBe('-');
  });

  it('formatStat', () => {
    expect(formatStat(null)).toBe('-');
    expect(formatStat(Infinity)).toBe('DNF');
    expect(formatStat(11000)).toBe('11.00');
  });
});

describe('parseTime', () => {
  it.each([
    ['9.87', 9870, 'none'],
    [' 9.87 ', 9870, 'none'],
    ['9.8', 9800, 'none'],
    ['9.876', 9870, 'none'],
    ['1:02.34', 62340, 'none'],
    ['1:02', 62000, 'none'],
    ['1:00:05.5', 3605500, 'none'],
    ['987', 9870, 'none'],
    ['10234', 62340, 'none'],
    ['5', 50, 'none'],
    ['9.87+', 7870, '+2'],
    ['9.87+2', 9870, '+2'],
    ['DNF', 0, 'DNF'],
    ['dnf(9.87)', 9870, 'DNF'],
  ])('%j -> %i %s', (input, ms, penalty) => {
    expect(parseTime(input)).toEqual({ ok: true, ms, penalty });
  });

  it.each(['', 'abc', '1:75.00', '9.87.6', '-3', '0', '0.00', '1:2:3:4', '9970', 'DNF(x)', '1.50+'])(
    'rejects %j',
    (input) => {
      expect(parseTime(input).ok).toBe(false);
    },
  );

  it('round trips with formatMs', () => {
    for (const ms of [9870, 62340, 3605000]) {
      const parsed = parseTime(formatMs(ms));
      expect(parsed).toEqual({ ok: true, ms, penalty: 'none' });
    }
    expect(parseTime(formatMs(7870, '+2'))).toEqual({ ok: true, ms: 7870, penalty: '+2' });
  });
});
