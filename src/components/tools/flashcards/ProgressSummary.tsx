import type { AlgSet } from '@/data/algsets';
import type { CardState } from '@/lib/srs';
import { caseLabel } from './useFlashcards';

interface ProgressSummaryProps {
  set: AlgSet;
  activeIds: string[];
  cards: Record<string, CardState>;
  now: number;
}

const formatSeconds = (ms: number) => `${(ms / 1000).toFixed(1)} s`;

export default function ProgressSummary({ set, activeIds, cards, now }: ProgressSummaryProps) {
  let due = 0;
  let fresh = 0;
  let learned = 0;
  for (const id of activeIds) {
    const card = cards[id];
    if (!card || card.due === 0) fresh++;
    else if (card.due <= now) due++;
    if (card && card.reps > 0) learned++;
  }

  const names = new Map(set.groups.flatMap((g) => g.cases).map((c) => [c.id, caseLabel(set, c)]));
  const slowest = activeIds
    .map((id) => cards[id])
    .filter((c): c is CardState & { lastRecognitionMs: number } => c?.lastRecognitionMs !== undefined)
    .sort((a, b) => b.lastRecognitionMs - a.lastRecognitionMs)
    .slice(0, 3);

  const stats = [
    { label: 'Due', value: due },
    { label: 'New', value: fresh },
    { label: 'Learned', value: learned },
  ];

  return (
    <section aria-labelledby="progress-heading">
      <h2 id="progress-heading" className="text-lg font-semibold">
        Progress
      </h2>
      <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border p-2">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="text-xl font-semibold tabular-nums">{stat.value}</dd>
          </div>
        ))}
      </dl>
      {slowest.length > 0 && (
        <>
          <h3 className="mt-4 text-sm font-medium">Slowest to recognize</h3>
          <ol className="mt-1 space-y-1 text-sm">
            {slowest.map((card) => (
              <li key={card.caseId} className="flex justify-between gap-2">
                <span>{names.get(card.caseId) ?? card.caseId}</span>
                <span className="text-muted-foreground tabular-nums">{formatSeconds(card.lastRecognitionMs)}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </section>
  );
}
