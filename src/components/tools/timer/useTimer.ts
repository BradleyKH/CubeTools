import { useCallback, useEffect, useRef, useState } from 'react';
import {
  finishInspection,
  inspectionDisplay,
  inspectionDurationMs,
  startInspection,
  tickInspection,
  type InspectionState,
} from '@/lib/timer/inspection';
import type { InspectionSetting, Penalty } from '@/lib/timer/types';

/** Holding and ready are input states layered on top of these by `useHoldToStart`. */
export type TimerPhase = 'idle' | 'inspecting' | 'running' | 'stopped';

export interface InspectionView {
  value: number | '+2' | 'DNF';
  /** Warnings passed so far: 0, 1 (8 s call), or 2 (12 s call). */
  warnings: number;
}

interface Options {
  inspection: InspectionSetting;
  /** `ms` is the raw clock time; an inspection DNF reports 0. */
  onFinish: (ms: number, penalty: Penalty) => void;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return reduced;
}

export function useTimer({ inspection, onFinish }: Options) {
  const [phase, setPhase] = useState<TimerPhase>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [inspectionView, setInspectionView] = useState<InspectionView | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const reducedMotion = usePrefersReducedMotion();

  const phaseRef = useRef<TimerPhase>('idle');
  const inspectionRef = useRef<InspectionState | null>(null);
  const startedAt = useRef(0);
  const penaltyRef = useRef<Penalty>('none');
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const go = useCallback((next: TimerPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const endInspection = useCallback(() => {
    inspectionRef.current = null;
    setInspectionView(null);
  }, []);

  const recordInspectionDnf = useCallback(() => {
    endInspection();
    go('stopped');
    setAnnouncement('DNF, inspection time exceeded');
    onFinishRef.current(0, 'DNF');
  }, [endInspection, go]);

  const beginInspection = useCallback(() => {
    const duration = inspectionDurationMs(inspection);
    if (duration === null || phaseRef.current === 'running' || phaseRef.current === 'inspecting') return;
    const now = performance.now();
    inspectionRef.current = startInspection(duration, now);
    setInspectionView({ value: inspectionDisplay(inspectionRef.current, now), warnings: 0 });
    setAnnouncement('Inspection started');
    go('inspecting');
  }, [inspection, go]);

  const start = useCallback(() => {
    if (phaseRef.current === 'running') return;
    const now = performance.now();
    let penalty: Penalty = 'none';
    if (phaseRef.current === 'inspecting' && inspectionRef.current) {
      const result = finishInspection(inspectionRef.current, now);
      if (result.penalty === 'DNF') {
        recordInspectionDnf();
        return;
      }
      penalty = result.penalty;
      endInspection();
    }
    penaltyRef.current = penalty;
    startedAt.current = now;
    setElapsedMs(0);
    go('running');
  }, [endInspection, go, recordInspectionDnf]);

  const stop = useCallback(() => {
    if (phaseRef.current !== 'running') return;
    const ms = Math.floor(performance.now() - startedAt.current);
    setElapsedMs(ms);
    go('stopped');
    onFinishRef.current(ms, penaltyRef.current);
  }, [go]);

  const cancel = useCallback(() => {
    if (phaseRef.current !== 'inspecting') return;
    endInspection();
    setAnnouncement('Inspection cancelled');
    go('idle');
  }, [endInspection, go]);

  useEffect(() => {
    if (phase !== 'running') return;
    let frame = 0;
    let lastPaint = -Infinity;
    // Reduced motion repaints at 10 Hz so the digits do not flicker every frame.
    const interval = reducedMotion ? 100 : 0;
    const loop = (now: number) => {
      if (now - lastPaint >= interval) {
        lastPaint = now;
        setElapsedMs(Math.max(0, now - startedAt.current));
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [phase, reducedMotion]);

  // An interval rather than animation frames, so a background tab still reaches the DNF.
  useEffect(() => {
    if (phase !== 'inspecting') return;
    const tick = () => {
      const current = inspectionRef.current;
      if (!current) return;
      const now = performance.now();
      const { state, events } = tickInspection(current, now);
      inspectionRef.current = state;
      if (state.phase === 'dnf') {
        recordInspectionDnf();
        return;
      }
      for (const event of events) {
        if (event.type === 'warning') setAnnouncement(`${event.atSeconds} seconds`);
        else if (event.type === 'plus2') setAnnouncement('Plus 2');
      }
      const value = inspectionDisplay(state, now);
      const warnings = state.warned.length;
      setInspectionView((prev) => (prev && prev.value === value && prev.warnings === warnings ? prev : { value, warnings }));
    };
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, [phase, recordInspectionDnf]);

  return { phase, elapsedMs, inspectionView, announcement, reducedMotion, beginInspection, start, stop, cancel };
}
