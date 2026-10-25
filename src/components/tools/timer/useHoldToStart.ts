import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/**
 * - `tap`: a press and release fires `onTap` (starts inspection).
 * - `hold`: holding past the delay arms the timer; releasing while armed fires `onStart`.
 * - `stop`: any key or touch fires `onStop` immediately.
 * - `off`: input is ignored.
 */
export type HoldMode = 'tap' | 'hold' | 'stop' | 'off';

export type HoldState = 'none' | 'holding' | 'ready';

interface Options {
  targetRef: RefObject<HTMLElement | null>;
  mode: HoldMode;
  holdDelayMs: number;
  onTap: () => void;
  onStart: () => void;
  onStop: () => void;
}

const TEXT_ENTRY = 'input, textarea, select, [contenteditable=""], [contenteditable="true"]';
const OWNS_INPUT = '[role="dialog"], [role="alertdialog"], [role="listbox"], [role="menu"]';
const INTERACTIVE = 'button, a[href], [role="button"], [role="combobox"], [role="switch"], [role="tab"]';

/** True when a key event belongs to a text field, dialog, or popup rather than the timer. */
export function isOutsideTimerFocus(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return target.closest(TEXT_ENTRY) !== null || target.closest(OWNS_INPUT) !== null;
}

/**
 * A keyboard user who tabbed to a control expects Space to activate it, but a
 * control that merely kept focus after a mouse click should not swallow the timer.
 */
function controlOwnsSpace(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const control = target.closest(INTERACTIVE);
  if (!control) return false;
  try {
    return control.matches(':focus-visible');
  } catch {
    return false;
  }
}

export function useHoldToStart({ targetRef, mode, holdDelayMs, onTap, onStart, onStop }: Options) {
  const [hold, setHold] = useState<HoldState>('none');

  const modeRef = useRef(mode);
  modeRef.current = mode;
  const delayRef = useRef(holdDelayMs);
  delayRef.current = holdDelayMs;
  const callbacks = useRef({ onTap, onStart, onStop });
  callbacks.current = { onTap, onStart, onStop };

  const pressMode = useRef<HoldMode | null>(null);
  const ready = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const swallowKey = useRef<string | null>(null);
  const swallowTouch = useRef(false);

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    pressMode.current = null;
    ready.current = false;
    setHold('none');
  }, []);

  useEffect(() => {
    const press = () => {
      const m = modeRef.current;
      if (m !== 'tap' && m !== 'hold') return;
      pressMode.current = m;
      ready.current = false;
      if (m === 'tap') return;
      setHold('holding');
      const arm = () => {
        ready.current = true;
        setHold('ready');
      };
      if (delayRef.current <= 0) arm();
      else timer.current = setTimeout(arm, delayRef.current);
    };

    const release = () => {
      const m = pressMode.current;
      const armed = ready.current;
      reset();
      if (m === 'tap') callbacks.current.onTap();
      else if (m === 'hold' && armed) callbacks.current.onStart();
    };

    const stop = () => {
      reset();
      callbacks.current.onStop();
    };

    const keydown = (e: KeyboardEvent) => {
      const m = modeRef.current;
      if (m === 'off') return;
      if (m === 'stop') {
        e.preventDefault();
        if (e.repeat) return;
        swallowKey.current = e.code;
        stop();
        return;
      }
      if (e.code !== 'Space' || e.altKey || e.ctrlKey || e.metaKey) return;
      if (isOutsideTimerFocus(e.target) || controlOwnsSpace(e.target)) return;
      e.preventDefault();
      if (e.repeat || pressMode.current !== null) return;
      press();
    };

    const keyup = (e: KeyboardEvent) => {
      if (swallowKey.current !== null && e.code === swallowKey.current) {
        swallowKey.current = null;
        e.preventDefault();
        return;
      }
      if (e.code !== 'Space' || pressMode.current === null) return;
      e.preventDefault();
      release();
    };

    const touchstart = (e: TouchEvent) => {
      const m = modeRef.current;
      if (m === 'off') return;
      // Without this the browser scrolls, zooms, or fires emulated mouse clicks.
      e.preventDefault();
      if (m === 'stop') {
        swallowTouch.current = true;
        stop();
        return;
      }
      if (pressMode.current === null && e.touches.length === 1) press();
    };

    const touchend = (e: TouchEvent) => {
      if (swallowTouch.current) {
        if (e.touches.length === 0) swallowTouch.current = false;
        e.preventDefault();
        return;
      }
      if (pressMode.current === null) return;
      e.preventDefault();
      release();
    };

    const touchcancel = () => {
      swallowTouch.current = false;
      reset();
    };

    const el = targetRef.current;
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', reset);
    el?.addEventListener('touchstart', touchstart, { passive: false });
    el?.addEventListener('touchend', touchend, { passive: false });
    el?.addEventListener('touchcancel', touchcancel);
    return () => {
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
      window.removeEventListener('blur', reset);
      el?.removeEventListener('touchstart', touchstart);
      el?.removeEventListener('touchend', touchend);
      el?.removeEventListener('touchcancel', touchcancel);
      clearTimeout(timer.current);
    };
  }, [targetRef, reset]);

  // A mode change mid-press (a dialog opening, inspection expiring) abandons the hold.
  useEffect(() => {
    if (pressMode.current !== null && pressMode.current !== mode) reset();
  }, [mode, reset]);

  return { hold, resetHold: reset };
}
