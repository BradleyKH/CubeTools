import { Alg } from 'cubing/alg';
import { normalizeAlg } from '@/lib/cube';
import type { EventId } from '@/lib/events';

type Generate = (eventId: EventId) => Promise<string>;

/** Loaded on first use so pages that never scramble do not pull in cubing.js's scramble worker. */
const generate: Generate = async (eventId) => {
  const { randomScrambleForEvent } = await import('cubing/scramble');
  return (await randomScrambleForEvent(eventId)).toString();
};

const queue = new Map<EventId, Promise<string>>();

function start(eventId: EventId, make: Generate): Promise<string> {
  const pending = make(eventId);
  // A failed prefetch must not poison later calls.
  pending.catch(() => {
    if (queue.get(eventId) === pending) queue.delete(eventId);
  });
  return pending;
}

/**
 * Returns a random-state scramble for the event. The next scramble for the same event starts
 * generating immediately so it is ready when the current solve ends.
 */
export async function getScramble(eventId: EventId, make: Generate = generate): Promise<string> {
  const ready = queue.get(eventId) ?? start(eventId, make);
  queue.set(eventId, start(eventId, make));
  return ready;
}

/** Drops prefetched scrambles, for example when tests swap the generator. */
export function clearScrambleQueue(): void {
  queue.clear();
}

export type ParsedScramble =
  | { ok: true; alg: string; error?: undefined }
  | { ok: false; alg: string; error: string };

/** Validates a user-entered scramble. `puzzle` is accepted for call-site symmetry with events. */
export function parseScramble(text: string, _puzzle?: string): ParsedScramble {
  const alg = normalizeAlg(text);
  if (!alg) return { ok: false, alg, error: 'Enter a scramble.' };
  try {
    return { ok: true, alg: Alg.fromString(alg).toString() };
  } catch (error) {
    return { ok: false, alg, error: error instanceof Error ? error.message : 'Invalid scramble.' };
  }
}
