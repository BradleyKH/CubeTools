import { useEffect, useState } from 'react';
import TwistyView from '@/components/tools/TwistyView';
import EventSelect from '@/components/tools/scrambler/EventSelect';
import { viewFor } from '@/components/tools/scrambler/view';
import { Label } from '@/components/ui/label';
import { getEvent, type EventId } from '@/lib/events';
import { parseScramble } from '@/lib/scramble';

type Status = { kind: 'empty' } | { kind: 'ok'; alg: string } | { kind: 'error'; message: string };

/** Syntax is not enough: a move can parse yet not exist on the chosen puzzle. */
async function checkOnPuzzle(text: string, puzzle: string): Promise<Status> {
  if (!text.trim()) return { kind: 'empty' };
  const parsed = parseScramble(text, puzzle);
  if (!parsed.ok) return { kind: 'error', message: parsed.error };
  try {
    const { puzzles } = await import('cubing/puzzles');
    const kpuzzle = await puzzles[puzzle].kpuzzle();
    kpuzzle.defaultPattern().applyAlg(parsed.alg);
    return { kind: 'ok', alg: parsed.alg };
  } catch (error) {
    return { kind: 'error', message: error instanceof Error ? error.message : 'Invalid scramble.' };
  }
}

export default function ScrambleChecker() {
  const [eventId, setEventId] = useState<EventId>('333');
  const [text, setText] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'empty' });
  const puzzle = getEvent(eventId).puzzle;

  useEffect(() => {
    let current = true;
    void checkOnPuzzle(text, puzzle).then((next) => {
      if (current) setStatus(next);
    });
    return () => {
      current = false;
    };
  }, [text, puzzle]);

  return (
    <section aria-labelledby="checker-heading" className="space-y-4">
      <div>
        <h2 id="checker-heading" className="text-xl font-semibold">
          Check a scramble
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a scramble to confirm every move is valid and see the state it produces.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="checker-event">Puzzle</Label>
        <EventSelect id="checker-event" value={eventId} onChange={setEventId} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="checker-text">Scramble</Label>
        <textarea
          id="checker-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-invalid={status.kind === 'error'}
          aria-describedby="checker-status"
          placeholder="R U R' U' ..."
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 font-mono text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
        />
      </div>
      <div id="checker-status" role="status" className="space-y-3">
        {status.kind === 'error' && <p className="text-sm text-destructive">{status.message}</p>}
        {status.kind === 'ok' && (
          <div className="flex flex-wrap items-start gap-4">
            <TwistyView puzzle={puzzle} setup={status.alg} view={viewFor(puzzle)} label="Scrambled state" />
            <p className="text-sm text-muted-foreground">Valid scramble. This is the state it produces.</p>
          </div>
        )}
      </div>
    </section>
  );
}
