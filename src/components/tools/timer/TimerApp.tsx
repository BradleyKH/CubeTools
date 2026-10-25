import { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getScramble } from '@/lib/scramble';
import { isEventId, type EventId } from '@/lib/events';
import { createSession, loadTimerData, newId, saveTimerData } from '@/lib/timer/storage';
import type { Penalty, Session, Solve, TimerData, TimerSettings as Settings } from '@/lib/timer/types';
import ScramblePanel from './ScramblePanel';
import SessionPicker from './SessionPicker';
import SolveDialog from './SolveDialog';
import SolveList from './SolveList';
import StatsPanel from './StatsPanel';
import TimerDisplay from './TimerDisplay';
import TimerSettings from './TimerSettings';
import { isOutsideTimerFocus, useHoldToStart, type HoldMode } from './useHoldToStart';
import { useTimer } from './useTimer';

const SHORTCUTS: [string, string][] = [
  ['Space (hold, release)', 'Start the timer'],
  ['Space (inspection on)', 'Start inspection'],
  ['Any key', 'Stop the timer'],
  ['Esc', 'Cancel inspection'],
  ['Alt+2', 'Toggle +2 on the last solve'],
  ['Alt+D', 'Toggle DNF on the last solve'],
];

export default function TimerApp() {
  const [data, setData] = useState<TimerData>(() => loadTimerData());
  const [scramble, setScramble] = useState<string | null>(null);
  const [scrambleError, setScrambleError] = useState<string | null>(null);
  const [selectedSolveId, setSelectedSolveId] = useState<string | null>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    saveTimerData(data);
  }, [data]);

  const session = data.sessions.find((s) => s.id === data.currentSessionId) ?? data.sessions[0];
  const eventId: EventId = isEventId(session.eventId) ? session.eventId : '333';
  const { settings } = data;
  const inspectionOn = settings.inspection !== 'off';

  const updateCurrentSession = useCallback((fn: (s: Session) => Session) => {
    setData((d) => ({ ...d, sessions: d.sessions.map((s) => (s.id === d.currentSessionId ? fn(s) : s)) }));
  }, []);

  const scrambleToken = useRef(0);
  const loadScramble = useCallback((ev: EventId) => {
    const token = ++scrambleToken.current;
    setScramble(null);
    setScrambleError(null);
    getScramble(ev).then(
      (text) => token === scrambleToken.current && setScramble(text),
      () => token === scrambleToken.current && setScrambleError('Could not generate a scramble. Try Next.'),
    );
  }, []);

  useEffect(() => {
    loadScramble(eventId);
  }, [eventId, loadScramble]);

  // The finish callback fires from input handlers, so it reads the latest values through refs.
  const latest = useRef({ scramble, eventId });
  latest.current = { scramble, eventId };

  const onFinish = useCallback(
    (ms: number, penalty: Penalty) => {
      const { scramble: text, eventId: ev } = latest.current;
      const solve: Solve = { id: newId(), ms, penalty, scramble: text ?? '', eventId: ev, at: Date.now() };
      updateCurrentSession((s) => ({ ...s, solves: [...s.solves, solve] }));
      loadScramble(ev);
    },
    [updateCurrentSession, loadScramble],
  );

  const timer = useTimer({ inspection: settings.inspection, onFinish });

  const mode: HoldMode =
    timer.phase === 'running'
      ? 'stop'
      : selectedSolveId !== null
        ? 'off'
        : timer.phase === 'inspecting' || !inspectionOn
          ? 'hold'
          : 'tap';

  const timerAreaRef = useRef<HTMLDivElement>(null);
  const { hold, resetHold } = useHoldToStart({
    targetRef: timerAreaRef,
    mode,
    holdDelayMs: settings.holdDelayMs,
    onTap: timer.beginInspection,
    onStart: timer.start,
    onStop: timer.stop,
  });

  const togglePenalty = useCallback(
    (penalty: Exclude<Penalty, 'none'>) => {
      updateCurrentSession((s) => {
        const last = s.solves.at(-1);
        if (!last) return s;
        const next = last.penalty === penalty ? 'none' : penalty;
        setStatus(`Last solve penalty: ${next === 'none' ? 'none' : next}`);
        return { ...s, solves: [...s.solves.slice(0, -1), { ...last, penalty: next }] };
      });
    },
    [updateCurrentSession],
  );

  const phaseRef = useRef(timer.phase);
  phaseRef.current = timer.phase;
  const { cancel } = timer;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current === 'running') return;
      if (e.key === 'Escape') {
        if (phaseRef.current === 'inspecting') {
          cancel();
          resetHold();
        }
        return;
      }
      if (!e.altKey || e.ctrlKey || e.metaKey || isOutsideTimerFocus(e.target)) return;
      if (e.code === 'Digit2') togglePenalty('+2');
      else if (e.code === 'KeyD') togglePenalty('DNF');
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cancel, resetHold, togglePenalty]);

  const changeSettings = useCallback((patch: Partial<Settings>) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  useEffect(() => {
    if (!inspectionOn) cancel();
  }, [inspectionOn, cancel]);

  const selectedIndex = selectedSolveId ? session.solves.findIndex((s) => s.id === selectedSolveId) : -1;
  const selectedSolve = selectedIndex >= 0 ? session.solves[selectedIndex] : null;

  const nextScramble = useCallback(() => loadScramble(latest.current.eventId), [loadScramble]);

  return (
    <TooltipProvider>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-bold">Timer</h1>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Keyboard shortcuts">
                  <KeyboardIcon aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="block">
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  {SHORTCUTS.map(([keys, action]) => (
                    <div key={keys} className="contents">
                      <dt className="font-mono font-semibold">{keys}</dt>
                      <dd>{action}</dd>
                    </div>
                  ))}
                </dl>
              </TooltipContent>
            </Tooltip>
            <TimerSettings data={data} onSettingsChange={changeSettings} onImport={setData} />
          </div>
        </header>

        <SessionPicker
          sessions={data.sessions}
          currentId={session.id}
          eventId={eventId}
          onSwitch={(id) => setData((d) => ({ ...d, currentSessionId: id }))}
          onCreate={(name) =>
            setData((d) => {
              const created = createSession(name, eventId);
              return { ...d, sessions: [...d.sessions, created], currentSessionId: created.id };
            })
          }
          onRename={(id, name) => setData((d) => ({ ...d, sessions: d.sessions.map((s) => (s.id === id ? { ...s, name } : s)) }))}
          onDelete={(id) =>
            setData((d) => {
              const rest = d.sessions.filter((s) => s.id !== id);
              const sessions = rest.length > 0 ? rest : [createSession('Session 1', eventId)];
              return { ...d, sessions, currentSessionId: sessions[0].id };
            })
          }
          onEventChange={(ev) => {
            updateCurrentSession((s) => ({ ...s, eventId: ev }));
            changeSettings({ eventId: ev });
          }}
        />

        <ScramblePanel eventId={eventId} scramble={scramble} error={scrambleError} onNext={nextScramble} />

        <TimerDisplay
          ref={timerAreaRef}
          phase={timer.phase}
          hold={hold}
          elapsedMs={timer.elapsedMs}
          inspectionView={timer.inspectionView}
          lastSolve={session.solves.at(-1)}
          hideTimeWhileSolving={settings.hideTimeWhileSolving}
          reducedMotion={timer.reducedMotion}
          inspectionOn={inspectionOn}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <StatsPanel solves={session.solves} />
          <SolveList solves={session.solves} onSelect={setSelectedSolveId} />
        </div>

        <SolveDialog
          solve={selectedSolve}
          number={selectedIndex + 1}
          onClose={() => setSelectedSolveId(null)}
          onChange={(solve) => updateCurrentSession((s) => ({ ...s, solves: s.solves.map((x) => (x.id === solve.id ? solve : x)) }))}
          onDelete={(id) => {
            updateCurrentSession((s) => ({ ...s, solves: s.solves.filter((x) => x.id !== id) }));
            setSelectedSolveId(null);
          }}
        />

        <div className="sr-only" aria-live="assertive">
          {timer.announcement}
        </div>
        <div className="sr-only" role="status">
          {status}
        </div>
      </div>
    </TooltipProvider>
  );
}
