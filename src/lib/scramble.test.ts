import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EVENTS, getEvent, isEventId } from '@/lib/events';
import { clearScrambleQueue, getScramble, parseScramble } from '@/lib/scramble';

describe('events', () => {
  it('lists the WCA ids with unique values and known puzzles', () => {
    expect(EVENTS.map((e) => e.id)).toEqual([
      '333', '222', '444', '555', '666', '777', '333oh', '333bf', 'pyram', 'skewb', 'minx', 'clock', 'sq1',
    ]);
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
  });

  it('maps events to cubing.js puzzle ids', () => {
    expect(getEvent('333oh').puzzle).toBe('3x3x3');
    expect(getEvent('sq1').puzzle).toBe('square1');
    expect(getEvent('pyram').puzzle).toBe('pyraminx');
  });

  it('recognizes event ids', () => {
    expect(isEventId('333')).toBe(true);
    expect(isEventId('999')).toBe(false);
  });
});

describe('parseScramble', () => {
  it('accepts and normalizes compact notation', () => {
    expect(parseScramble("RUR'U'", '3x3x3')).toEqual({ ok: true, alg: "R U R' U'" });
  });

  it('accepts wide and slice moves', () => {
    expect(parseScramble("Rw U2 M' x", '3x3x3').ok).toBe(true);
  });

  it('rejects empty input', () => {
    const result = parseScramble('   ');
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('rejects unparseable input', () => {
    const result = parseScramble('R U (R', '3x3x3');
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('getScramble', () => {
  beforeEach(clearScrambleQueue);

  it('prefetches the next scramble for the same event', async () => {
    let n = 0;
    const make = vi.fn(async () => `scramble ${++n}`);
    expect(await getScramble('333', make)).toBe('scramble 1');
    expect(make).toHaveBeenCalledTimes(2);
    expect(await getScramble('333', make)).toBe('scramble 2');
    expect(make).toHaveBeenCalledTimes(3);
  });

  it('keeps separate queues per event', async () => {
    const make = vi.fn(async (id: string) => `${id}-scramble`);
    expect(await getScramble('222', make)).toBe('222-scramble');
    expect(await getScramble('444', make)).toBe('444-scramble');
  });

  it('recovers after a failed generation', async () => {
    const make = vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue('ok');
    await expect(getScramble('333', make)).rejects.toThrow('boom');
    await expect(getScramble('333', make)).resolves.toBe('ok');
  });
});
