import { cn } from '@/lib/utils';
import type { InspectionView } from './useTimer';
import type { HoldState } from './useHoldToStart';

interface Props {
  view: InspectionView;
  hold: HoldState;
}

const WARNING_TEXT = ['', '8 seconds', '12 seconds'];

export default function InspectionDisplay({ view, hold }: Props) {
  const penalty = typeof view.value === 'string';
  const tone =
    hold === 'ready'
      ? 'text-green-600 dark:text-green-500'
      : hold === 'holding'
        ? 'text-red-600 dark:text-red-500'
        : penalty || view.warnings >= 2
          ? 'text-red-600 dark:text-red-500'
          : view.warnings === 1
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-foreground';

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Inspection</span>
      <span className={cn('font-mono text-7xl font-semibold tabular-nums sm:text-8xl', tone)} data-testid="inspection-value">
        {view.value}
      </span>
      <span className={cn('h-5 text-sm font-medium', tone)}>
        {penalty ? 'Start now for +2' : WARNING_TEXT[view.warnings]}
      </span>
    </div>
  );
}
