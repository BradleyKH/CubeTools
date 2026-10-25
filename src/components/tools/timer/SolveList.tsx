import { memo, useMemo } from 'react';
import { MessageSquareIcon } from 'lucide-react';
import { rolling } from '@/lib/timer/stats';
import { formatMs, formatStat } from '@/lib/timer/format';
import type { Solve } from '@/lib/timer/types';

interface Props {
  solves: Solve[];
  onSelect: (id: string) => void;
}

function SolveList({ solves, onSelect }: Props) {
  // rolling()[i] is the ao5 ending at solve i + 4.
  const ao5 = useMemo(() => rolling(solves, 5), [solves]);

  return (
    <section aria-labelledby="solves-heading" className="flex min-h-0 flex-col rounded-xl border border-border bg-card p-4">
      <h2 id="solves-heading" className="mb-3 text-sm font-medium text-muted-foreground">
        Solves
      </h2>
      {solves.length === 0 ? (
        <p className="text-sm text-muted-foreground">No solves in this session yet.</p>
      ) : (
        <ol className="max-h-80 overflow-y-auto text-sm tabular-nums" data-testid="solve-list">
          <li aria-hidden="true" className="grid grid-cols-[3rem_1fr_1fr_1.25rem] gap-2 px-2 pb-1 text-muted-foreground">
            <span>#</span>
            <span className="text-right">Time</span>
            <span className="text-right">ao5</span>
            <span />
          </li>
          {solves
            .map((solve, i) => ({ solve, i }))
            .reverse()
            .map(({ solve, i }) => (
              <li key={solve.id} className="border-t border-border">
                <button
                  type="button"
                  onClick={() => onSelect(solve.id)}
                  className="grid w-full grid-cols-[3rem_1fr_1fr_1.25rem] items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  aria-label={`Solve ${i + 1}: ${formatMs(solve.ms, solve.penalty)}${solve.comment ? ', has comment' : ''}. Edit`}
                  data-testid="solve-row"
                >
                  <span className="text-muted-foreground">{i + 1}</span>
                  <span className="text-right font-mono">{formatMs(solve.ms, solve.penalty)}</span>
                  <span className="text-right font-mono text-muted-foreground">{i >= 4 ? formatStat(ao5[i - 4]) : '-'}</span>
                  <span>{solve.comment && <MessageSquareIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />}</span>
                </button>
              </li>
            ))}
        </ol>
      )}
    </section>
  );
}

export default memo(SolveList);
