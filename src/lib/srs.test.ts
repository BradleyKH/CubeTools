import { describe, expect, it } from 'vitest';
import { DAY_MS, MIN_EASE, RELEARN_MS, dueCards, newCard, review, type CardState } from './srs';

const NOW = 1_000_000_000_000;

describe('review', () => {
  it('starts a new card at one day on good and four on easy', () => {
    expect(review(newCard('a'), 'good', NOW).intervalDays).toBe(1);
    expect(review(newCard('a'), 'hard', NOW).intervalDays).toBe(1);
    expect(review(newCard('a'), 'easy', NOW).intervalDays).toBe(4);
  });

  it('grows intervals on repeated good reviews', () => {
    let s = newCard('a');
    const intervals: number[] = [];
    for (let i = 0; i < 5; i++) {
      s = review(s, 'good', NOW);
      intervals.push(s.intervalDays);
    }
    expect(intervals.slice(0, 3)).toEqual([1, 3, 8]);
    for (let i = 1; i < intervals.length; i++) expect(intervals[i]).toBeGreaterThan(intervals[i - 1]);
  });

  it('sets due from now and interval', () => {
    const s = review(newCard('a'), 'good', NOW);
    expect(s.due).toBe(NOW + DAY_MS);
  });

  it('orders easy above good above hard for a mature card', () => {
    const mature: CardState = { ...newCard('a'), reps: 4, intervalDays: 10, due: NOW };
    const h = review(mature, 'hard', NOW).intervalDays;
    const g = review(mature, 'good', NOW).intervalDays;
    const e = review(mature, 'easy', NOW).intervalDays;
    expect(h).toBeLessThan(g);
    expect(g).toBeLessThan(e);
  });

  it('resets on a lapse and counts it', () => {
    const mature: CardState = { ...newCard('a'), reps: 4, intervalDays: 10, due: NOW };
    const s = review(mature, 'again', NOW, 1234);
    expect(s.reps).toBe(0);
    expect(s.intervalDays).toBe(0);
    expect(s.lapses).toBe(1);
    expect(s.due).toBe(NOW + RELEARN_MS);
    expect(s.ease).toBeLessThan(mature.ease);
    expect(s.lastRecognitionMs).toBe(1234);
    expect(review(s, 'good', NOW).intervalDays).toBe(1);
  });

  it('does not count failing a new card as a lapse', () => {
    expect(review(newCard('a'), 'again', NOW).lapses).toBe(0);
  });

  it('never drops ease below the floor', () => {
    let s = newCard('a');
    for (let i = 0; i < 20; i++) s = review(s, 'again', NOW);
    expect(s.ease).toBe(MIN_EASE);
  });

  it('does not mutate the input and is deterministic', () => {
    const s = newCard('a');
    const copy = { ...s };
    expect(review(s, 'good', NOW)).toEqual(review(s, 'good', NOW));
    expect(s).toEqual(copy);
  });
});

describe('dueCards', () => {
  it('lists overdue cards oldest first, then new cards, skipping future ones', () => {
    const states: Record<string, CardState> = {
      old: { ...newCard('old'), reps: 2, intervalDays: 3, due: NOW - 2 * DAY_MS },
      older: { ...newCard('older'), reps: 2, intervalDays: 3, due: NOW - 5 * DAY_MS },
      later: { ...newCard('later'), reps: 2, intervalDays: 3, due: NOW + DAY_MS },
    };
    expect(dueCards(states, ['fresh1', 'later', 'old', 'fresh2', 'older'], NOW)).toEqual([
      'older',
      'old',
      'fresh1',
      'fresh2',
    ]);
  });

  it('treats a card due exactly now as due', () => {
    const states = { a: { ...newCard('a'), reps: 1, due: NOW } };
    expect(dueCards(states, ['a'], NOW)).toEqual(['a']);
  });
});
