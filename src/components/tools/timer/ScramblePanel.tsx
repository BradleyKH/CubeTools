import { memo } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TwistyView from '@/components/tools/TwistyView';
import { getEvent, type EventId } from '@/lib/events';

interface Props {
  eventId: EventId;
  scramble: string | null;
  error: string | null;
  onNext: () => void;
}

function ScramblePanel({ eventId, scramble, error, onNext }: Props) {
  const event = getEvent(eventId);
  return (
    <section aria-labelledby="scramble-heading" className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 id="scramble-heading" className="text-sm font-medium text-muted-foreground">
            {event.name} scramble
          </h2>
          <Button variant="ghost" size="sm" onClick={onNext} disabled={scramble === null && error === null}>
            <RefreshCwIcon aria-hidden="true" />
            Next
          </Button>
        </div>
        <p className="font-mono text-base leading-relaxed break-words sm:text-lg" aria-live="polite" data-testid="scramble-text">
          {error ? <span className="text-destructive">{error}</span> : (scramble ?? <span className="text-muted-foreground">Generating scramble...</span>)}
        </p>
      </div>
      <TwistyView
        puzzle={event.puzzle}
        setup={scramble ?? ''}
        view="2D"
        size="md"
        label={`${event.name} scrambled state`}
        className="mx-auto shrink-0"
      />
    </section>
  );
}

export default memo(ScramblePanel);
