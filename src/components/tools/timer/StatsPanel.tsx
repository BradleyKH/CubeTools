import { memo, useMemo } from 'react';
import { sessionStats, type CurrentAndBest } from '@/lib/timer/stats';
import { formatStat } from '@/lib/timer/format';
import type { Solve } from '@/lib/timer/types';

interface Props {
  solves: Solve[];
}

function StatsPanel({ solves }: Props) {
  const stats = useMemo(() => sessionStats(solves), [solves]);
  const rows: [string, CurrentAndBest][] = [
    ['Single', stats.single],
    ['ao5', stats.ao5],
    ['ao12', stats.ao12],
    ['ao100', stats.ao100],
  ];

  return (
    <section aria-labelledby="stats-heading" className="rounded-xl border border-border bg-card p-4">
      <h2 id="stats-heading" className="mb-3 text-sm font-medium text-muted-foreground">
        Statistics
      </h2>
      <table className="w-full text-sm tabular-nums" data-testid="stats-table">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th scope="col" className="pb-1 font-medium">
              <span className="sr-only">Stat</span>
            </th>
            <th scope="col" className="pb-1 text-right font-medium">Current</th>
            <th scope="col" className="pb-1 text-right font-medium">Best</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="border-t border-border" data-stat={label}>
              <th scope="row" className="py-1.5 text-left font-medium">{label}</th>
              <td className="py-1.5 text-right font-mono" data-cell="current">{formatStat(value.current)}</td>
              <td className="py-1.5 text-right font-mono" data-cell="best">{formatStat(value.best)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Mean</dt>
          <dd className="font-mono tabular-nums" data-stat="mean">{formatStat(stats.mean)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Solves</dt>
          <dd className="font-mono tabular-nums" data-stat="count">
            {stats.count}
            {stats.dnfs > 0 && <span className="text-muted-foreground"> ({stats.dnfs} DNF)</span>}
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default memo(StatsPanel);
