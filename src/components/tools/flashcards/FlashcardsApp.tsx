import { useEffect, useRef, useState } from 'react';
import { KeyboardIcon } from 'lucide-react';
import { algSets, getAlgSet, legacyIndexToId, type AlgSetId } from '@/data/algsets';
import type { DisplayMode, StudyMode } from '@/lib/flashcard-storage';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import CaseFilter from './CaseFilter';
import FlashCard from './FlashCard';
import ProgressSummary from './ProgressSummary';
import ReviewControls from './ReviewControls';
import SetDetails from './SetDetails';
import SetPicker from './SetPicker';
import { DISPLAY_MODES, GRADES, useFlashcards } from './useFlashcards';

/** The set named by `?set=`, or by the legacy `#0`..`#6` hash; null when neither is valid. */
function setIdFromUrl(): { id: AlgSetId; legacy: boolean } | null {
  const fromQuery = getAlgSet(new URLSearchParams(window.location.search).get('set') ?? '');
  if (fromQuery) return { id: fromQuery.id, legacy: false };
  const hash = window.location.hash.slice(1);
  const legacyId = /^\d+$/.test(hash) ? legacyIndexToId[Number(hash)] : undefined;
  return legacyId ? { id: legacyId, legacy: true } : null;
}

const setUrl = (id: AlgSetId) => `${window.location.pathname}?set=${id}`;

const SHORTCUTS: [string, string][] = [
  ['Space, Enter, Right', 'Reveal, then next card'],
  ['Left', 'Previous card (drill)'],
  ['1 to 4', `Grade: ${GRADES.map((g) => g.label).join(', ')} (review)`],
  ['R', 'Shuffle on or off'],
  ['A', 'Cycle display mode'],
];

const TEXT_ENTRY = 'input, textarea, select, [contenteditable="true"]';
// Space and Enter already activate these natively, and arrows move within radio groups and menus.
const OWNS_ACTIVATION = 'button, a[href], input, [role="checkbox"], [role="radio"], [role="option"], summary';
const OWNS_ARROWS = '[role="radiogroup"], [role="listbox"], [role="menu"], [role="slider"], input, textarea';

export default function FlashcardsApp() {
  const [setId, setSetId] = useState<AlgSetId>(() => setIdFromUrl()?.id ?? algSets[0].id);
  const set = getAlgSet(setId) ?? algSets[0];
  const cards = useFlashcards(set);

  useEffect(() => {
    if (setIdFromUrl()?.legacy) window.history.replaceState(null, '', setUrl(setId));
    const onPop = () => setSetId(setIdFromUrl()?.id ?? algSets[0].id);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // Runs once: later set changes write the URL themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function chooseSet(id: AlgSetId): void {
    if (id === setId) return;
    window.history.pushState(null, '', setUrl(id));
    setSetId(id);
  }

  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(TEXT_ENTRY) || target?.closest('[role="dialog"], [role="listbox"]')) return;
      const c = cardsRef.current;
      const key = event.key;

      if (key === ' ' || key === 'Enter') {
        if (target?.closest(OWNS_ACTIVATION)) return;
        c.advance();
      } else if (key === 'ArrowRight' || key === 'ArrowLeft') {
        if (target?.closest(OWNS_ARROWS)) return;
        if (key === 'ArrowRight') c.advance();
        else if (c.prefs.studyMode === 'drill') c.prev();
      } else if (/^[1-4]$/.test(key)) {
        c.grade(GRADES[Number(key) - 1].value);
      } else if (key === 'r' || key === 'R') {
        c.toggleShuffle();
      } else if (key === 'a' || key === 'A') {
        c.cycleDisplayMode();
      } else {
        return;
      }
      event.preventDefault();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const { prefs, current } = cards;
  const isReview = prefs.studyMode === 'review';

  let status: string;
  if (isReview) status = `${cards.reviewQueue.length} to review`;
  else if (cards.position.total === 0) status = 'No cards';
  else status = `Card ${cards.position.index + 1} of ${cards.position.total}, ${prefs.shuffle ? 'shuffled' : 'in order'}`;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-3">
        <SetPicker value={set.id} onChange={chooseSet} />
        <ToggleGroup
          type="single"
          variant="outline"
          spacing={0}
          value={prefs.studyMode}
          onValueChange={(v) => v && cards.setStudyMode(v as StudyMode)}
          aria-label="Study mode"
        >
          <ToggleGroupItem value="drill">Drill</ToggleGroupItem>
          <ToggleGroupItem value="review">Review</ToggleGroupItem>
        </ToggleGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Keyboard shortcuts" className="ml-auto">
              <KeyboardIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="end">
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              {SHORTCUTS.map(([keys, action]) => (
                <div key={keys} className="contents">
                  <dt className="font-semibold">{keys}</dt>
                  <dd>{action}</dd>
                </div>
              ))}
            </dl>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <p className="font-medium" aria-live="polite">
              {status}
            </p>
            <div className="ml-auto flex flex-wrap items-center gap-4">
              {!isReview && (
                <Label className="font-normal">
                  <Switch checked={prefs.shuffle} onCheckedChange={cards.setShuffle} />
                  Shuffle
                </Label>
              )}
              <Select value={prefs.displayMode} onValueChange={(v) => cards.setDisplayMode(v as DisplayMode)}>
                <SelectTrigger aria-label="Display mode" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="end">
                  {DISPLAY_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {current ? (
            <>
              <FlashCard
                key={current.id}
                set={set}
                item={current}
                algIndex={cards.algIndex}
                displayMode={prefs.displayMode}
                revealed={cards.revealed}
                onReveal={cards.reveal}
                onChooseAlg={(i) => cards.setPreferredAlg(current.id, i)}
              />
              <ReviewControls
                studyMode={prefs.studyMode}
                revealed={cards.revealed}
                onReveal={cards.reveal}
                onNext={cards.next}
                onPrev={cards.prev}
                onGrade={cards.grade}
              />
            </>
          ) : (
            <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
              {isReview ? (
                <p>
                  Nothing is due right now.
                  {cards.nextDueAt !== undefined &&
                    ` The next card is due ${new Date(cards.nextDueAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}.`}{' '}
                  Switch to Drill to keep practicing.
                </p>
              ) : (
                <p>No cases are selected.</p>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <ProgressSummary set={set} activeIds={cards.activeIds} cards={prefs.cards} now={cards.reviewNow} />
          <SetDetails set={set} />
          <CaseFilter set={set} activeIds={cards.activeIds} onChange={cards.setSelection} />
        </aside>
      </div>
    </TooltipProvider>
  );
}
