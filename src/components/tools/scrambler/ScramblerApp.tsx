import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TooltipProvider } from '@/components/ui/tooltip';
import EventSelect from '@/components/tools/scrambler/EventSelect';
import ScrambleCard from '@/components/tools/scrambler/ScrambleCard';
import ScrambleChecker from '@/components/tools/scrambler/ScrambleChecker';
import { getEvent, type EventId } from '@/lib/events';
import { getScramble } from '@/lib/scramble';

const MAX_COUNT = 25;

export default function ScramblerApp() {
  const [eventId, setEventId] = useState<EventId>('333');
  const [count, setCount] = useState('5');
  const [results, setResults] = useState<string[]>([]);
  const [shown, setShown] = useState<EventId>('333');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);

  const parsedCount = Number(count);
  const countValid = Number.isInteger(parsedCount) && parsedCount >= 1 && parsedCount <= MAX_COUNT;

  async function generate() {
    if (!countValid) return;
    const token = ++request.current;
    setLoading(true);
    setError(null);
    try {
      const made: string[] = [];
      for (let i = 0; i < parsedCount; i++) {
        made.push(await getScramble(eventId));
        if (token !== request.current) return;
      }
      setResults(made);
      setShown(eventId);
    } catch {
      if (token === request.current) setError('Could not generate scrambles. Try again.');
    } finally {
      if (token === request.current) setLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-12">
        <section aria-labelledby="generator-heading" className="space-y-4">
          <h2 id="generator-heading" className="sr-only">
            Generate scrambles
          </h2>
          <form
            className="flex flex-wrap items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              void generate();
            }}
          >
            <div className="flex w-full flex-col gap-2 sm:w-auto">
              <Label htmlFor="scrambler-event">Event</Label>
              <EventSelect id="scrambler-event" value={eventId} onChange={setEventId} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="scrambler-count">Number of scrambles</Label>
              <input
                id="scrambler-count"
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_COUNT}
                value={count}
                onChange={(e) => setCount(e.target.value)}
                aria-invalid={!countValid}
                className="h-8 w-28 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30"
              />
            </div>
            <Button type="submit" disabled={loading || !countValid}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </form>
          {!countValid && <p className="text-sm text-destructive">Enter a whole number from 1 to {MAX_COUNT}.</p>}
          <p className="text-sm text-muted-foreground">
            Scrambles are random-state, like official WCA scrambles, so there is no length setting.
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div aria-live="polite" aria-busy={loading}>
            {loading && <p className="text-sm text-muted-foreground">Generating scrambles...</p>}
          </div>
          {results.length > 0 && (
            <ol className="space-y-3">
              {results.map((scramble, i) => (
                <ScrambleCard
                  key={`${shown}-${i}-${scramble}`}
                  index={i + 1}
                  scramble={scramble}
                  puzzle={getEvent(shown).puzzle}
                />
              ))}
            </ol>
          )}
        </section>
        <ScrambleChecker />
      </div>
    </TooltipProvider>
  );
}
