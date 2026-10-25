import { useEffect, useMemo, useState } from 'react';
import type { AlgCase, AlgSet } from '@/data/algsets';
import {
  loadSetPrefs,
  saveSetPrefs,
  type DisplayMode,
  type SetPrefs,
  type StudyMode,
} from '@/lib/flashcard-storage';
import { dueCards, newCard, review, type Grade } from '@/lib/srs';

export const DISPLAY_MODES: { value: DisplayMode; label: string }[] = [
  { value: 'case-to-alg', label: 'Show case, recall algorithm' },
  { value: 'alg-to-case', label: 'Show algorithm, recall case' },
  { value: 'both', label: 'Show both' },
];

export const GRADES: { value: Grade; label: string; key: string }[] = [
  { value: 'again', label: 'Again', key: '1' },
  { value: 'hard', label: 'Hard', key: '2' },
  { value: 'good', label: 'Good', key: '3' },
  { value: 'easy', label: 'Easy', key: '4' },
];

/** Display name for a case: its own name, or the set name and case number. */
export function caseLabel(set: AlgSet, item: AlgCase): string {
  return item.name ?? `${set.name} ${item.id.slice(item.id.lastIndexOf('-') + 1)}`;
}

export function allCaseIds(set: AlgSet): string[] {
  return set.groups.flatMap((group) => group.cases.map((c) => c.id));
}

/** Case ids selected for study, in set order. */
export function activeCaseIds(set: AlgSet, prefs: SetPrefs): string[] {
  const all = allCaseIds(set);
  const chosen = new Set(prefs.selectedCaseIds);
  for (const group of set.groups) {
    if (prefs.selectedGroupIds.includes(group.id)) group.cases.forEach((c) => chosen.add(c.id));
  }
  return all.filter((id) => chosen.has(id));
}

function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const drillOrder = (ids: string[], shuffle: boolean) => (shuffle ? shuffled(ids) : ids);

interface State {
  setId: string;
  prefs: SetPrefs;
  /** Drill order of the active case ids. */
  order: string[];
  index: number;
  revealed: boolean;
  /** `performance.now()` when the current card was shown. */
  shownAt: number;
  recognitionMs?: number;
  /** Clock used to pick due review cards; advanced after each grade. */
  reviewNow: number;
}

function initialState(set: AlgSet): State {
  const prefs = loadSetPrefs(set.id);
  // A set opened for the first time, or saved with nothing ticked, starts with every case.
  if (prefs.selectedCaseIds.length === 0 && prefs.selectedGroupIds.length === 0) {
    prefs.selectedCaseIds = allCaseIds(set);
    prefs.selectedGroupIds = set.groups.map((g) => g.id);
  }
  return {
    setId: set.id,
    prefs,
    order: drillOrder(activeCaseIds(set, prefs), prefs.shuffle),
    index: 0,
    revealed: false,
    shownAt: performance.now(),
    reviewNow: Date.now(),
  };
}

/** Resets per-card fields for a newly shown card. */
const freshCard = (state: State): State => ({
  ...state,
  revealed: false,
  recognitionMs: undefined,
  shownAt: performance.now(),
});

export function useFlashcards(set: AlgSet) {
  const [stored, setState] = useState(() => initialState(set));
  let state = stored;
  if (stored.setId !== set.id) {
    state = initialState(set);
    setState(state);
  }
  const { prefs } = state;

  useEffect(() => {
    saveSetPrefs(state.setId, state.prefs);
  }, [state.setId, state.prefs]);

  const casesById = useMemo(() => {
    const map = new Map<string, AlgCase>();
    set.groups.forEach((group) => group.cases.forEach((c) => map.set(c.id, c)));
    return map;
  }, [set]);

  const activeIds = useMemo(() => activeCaseIds(set, prefs), [set, prefs]);

  const reviewQueue = useMemo(
    () => dueCards(prefs.cards, activeIds, state.reviewNow),
    [prefs.cards, activeIds, state.reviewNow],
  );

  const isReview = prefs.studyMode === 'review';
  const currentId = isReview ? reviewQueue[0] : state.order[state.index];
  const current = currentId ? casesById.get(currentId) : undefined;
  const revealed = state.revealed || prefs.displayMode === 'both';

  // While nothing is due, wake up when the earliest scheduled card comes due.
  const nextDueAt = useMemo(() => {
    const dues = activeIds.map((id) => prefs.cards[id]?.due ?? 0).filter((d) => d > state.reviewNow);
    return dues.length ? Math.min(...dues) : undefined;
  }, [activeIds, prefs.cards, state.reviewNow]);

  useEffect(() => {
    if (!isReview || current || nextDueAt === undefined) return;
    const timer = window.setTimeout(
      () => setState((s) => ({ ...freshCard(s), reviewNow: Date.now() })),
      Math.min(nextDueAt - Date.now() + 50, 60_000),
    );
    return () => window.clearTimeout(timer);
  }, [isReview, current, nextDueAt]);

  function updatePrefs(change: Partial<SetPrefs>, reorder = false): void {
    setState((s) => {
      const nextPrefs = { ...s.prefs, ...change };
      if (!reorder) return { ...s, prefs: nextPrefs };
      return {
        ...freshCard(s),
        prefs: nextPrefs,
        order: drillOrder(activeCaseIds(set, nextPrefs), nextPrefs.shuffle),
        index: 0,
        reviewNow: Date.now(),
      };
    });
  }

  function reveal(): void {
    setState((s) =>
      s.revealed ? s : { ...s, revealed: true, recognitionMs: Math.round(performance.now() - s.shownAt) },
    );
  }

  function step(delta: 1 | -1): void {
    setState((s) => {
      const total = s.order.length;
      if (total === 0) return s;
      return { ...freshCard(s), index: (s.index + delta + total) % total };
    });
  }

  function grade(value: Grade): void {
    if (!isReview || !currentId || !revealed) return;
    setState((s) => {
      const card = s.prefs.cards[currentId] ?? newCard(currentId);
      const now = Date.now();
      const graded = review(card, value, now, s.recognitionMs);
      return {
        ...freshCard(s),
        prefs: { ...s.prefs, cards: { ...s.prefs.cards, [currentId]: graded } },
        reviewNow: now,
      };
    });
  }

  /** Space, Enter, and Right arrow: reveal the answer, then move on in drill mode. */
  function advance(): void {
    if (!current) return;
    if (!revealed) reveal();
    else if (!isReview) step(1);
  }

  function setSelection(caseIds: string[]): void {
    const chosen = new Set(caseIds);
    const fullGroups = set.groups.filter((g) => g.cases.every((c) => chosen.has(c.id))).map((g) => g.id);
    updatePrefs({ selectedCaseIds: allCaseIds(set).filter((id) => chosen.has(id)), selectedGroupIds: fullGroups }, true);
  }

  function setDisplayMode(displayMode: DisplayMode): void {
    setState((s) => ({ ...freshCard(s), prefs: { ...s.prefs, displayMode } }));
  }

  function cycleDisplayMode(): void {
    const i = DISPLAY_MODES.findIndex((m) => m.value === prefs.displayMode);
    setDisplayMode(DISPLAY_MODES[(i + 1) % DISPLAY_MODES.length].value);
  }

  function setPreferredAlg(caseId: string, index: number): void {
    updatePrefs({ preferredAlgIndex: { ...prefs.preferredAlgIndex, [caseId]: index } });
  }

  const algIndex = current ? Math.min(prefs.preferredAlgIndex[current.id] ?? 0, current.algs.length - 1) : 0;

  return {
    prefs,
    activeIds,
    current,
    algIndex,
    revealed,
    position: { index: state.index, total: state.order.length },
    reviewQueue,
    reviewNow: state.reviewNow,
    nextDueAt,
    reveal,
    advance,
    next: () => step(1),
    prev: () => step(-1),
    grade,
    setSelection,
    setDisplayMode,
    cycleDisplayMode,
    setShuffle: (shuffle: boolean) => updatePrefs({ shuffle }, true),
    toggleShuffle: () => updatePrefs({ shuffle: !prefs.shuffle }, true),
    setStudyMode: (studyMode: StudyMode) => updatePrefs({ studyMode }, true),
    setPreferredAlg,
  };
}

export type Flashcards = ReturnType<typeof useFlashcards>;
