import type { Ref } from 'react';
import { cn } from '@/lib/utils';
import { formatMs } from '@/lib/timer/format';
import type { Solve } from '@/lib/timer/types';
import InspectionDisplay from './InspectionDisplay';
import type { InspectionView, TimerPhase } from './useTimer';
import type { HoldState } from './useHoldToStart';

interface Props {
  ref: Ref<HTMLDivElement>;
  phase: TimerPhase;
  hold: HoldState;
  elapsedMs: number;
  inspectionView: InspectionView | null;
  lastSolve: Solve | undefined;
  hideTimeWhileSolving: boolean;
  reducedMotion: boolean;
  inspectionOn: boolean;
}

export default function TimerDisplay({
  ref,
  phase,
  hold,
  elapsedMs,
  inspectionView,
  lastSolve,
  hideTimeWhileSolving,
  reducedMotion,
  inspectionOn,
}: Props) {
  const running = phase === 'running';
  const tone =
    hold === 'ready'
      ? 'text-green-600 dark:text-green-500'
      : hold === 'holding'
        ? 'text-red-600 dark:text-red-500'
        : 'text-foreground';

  let content;
  if (phase === 'inspecting' && inspectionView) {
    content = <InspectionDisplay view={inspectionView} hold={hold} />;
  } else {
    let text: string;
    if (running) {
      const live = formatMs(elapsedMs);
      text = hideTimeWhileSolving ? 'Solving' : reducedMotion ? live.slice(0, -1) : live;
    } else {
      text = lastSolve ? formatMs(lastSolve.ms, lastSolve.penalty) : '0.00';
    }
    content = (
      <span
        className={cn(
          'font-mono font-semibold tabular-nums motion-safe:transition-colors',
          running && hideTimeWhileSolving ? 'text-5xl text-muted-foreground' : 'text-7xl sm:text-8xl lg:text-9xl',
          tone,
        )}
        data-testid="timer-time"
      >
        {text}
      </span>
    );
  }

  const hint =
    phase === 'inspecting'
      ? 'Hold Space or touch and hold, then release to start. Esc cancels.'
      : inspectionOn
        ? 'Press Space or tap here to start inspection.'
        : 'Hold Space or touch and hold here, then release to start.';

  return (
    <div
      ref={ref}
      data-testid="timer-area"
      data-phase={phase}
      data-hold={hold}
      className={cn(
        'flex touch-none flex-col items-center justify-center gap-4 select-none',
        running
          ? 'fixed inset-0 z-50 bg-background'
          : 'min-h-[40vh] rounded-xl border border-border bg-card px-4 py-10',
      )}
    >
      {content}
      {!running && <p className="text-center text-sm text-muted-foreground">{hint}</p>}
      {running && <p className="sr-only">Press any key or touch to stop.</p>}
    </div>
  );
}
