import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TwistyView from '@/components/tools/TwistyView';
import { formatMs } from '@/lib/timer/format';
import { PENALTIES, type Penalty, type Solve } from '@/lib/timer/types';
import { getEvent, isEventId } from '@/lib/events';

interface Props {
  solve: Solve | null;
  /** 1-based position in the session. */
  number: number;
  onClose: () => void;
  onChange: (solve: Solve) => void;
  onDelete: (id: string) => void;
}

const PENALTY_LABELS: Record<Penalty, string> = { none: 'OK', '+2': '+2', DNF: 'DNF' };

export default function SolveDialog({ solve: openSolve, number, onClose, onChange, onDelete }: Props) {
  // Keeps the content rendered (with its title) while the close animation plays.
  const lastSolve = useRef(openSolve);
  if (openSolve) lastSolve.current = openSolve;
  const solve = lastSolve.current;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    setShowDiagram(false);
  }, [solve?.id]);

  const event = solve && isEventId(solve.eventId) ? getEvent(solve.eventId) : null;

  return (
    <Dialog open={openSolve !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {solve && (
          <>
            <DialogHeader>
              <DialogTitle>
                Solve {number}: <span className="font-mono">{formatMs(solve.ms, solve.penalty)}</span>
              </DialogTitle>
              <DialogDescription>
                {event?.name ?? solve.eventId}, {new Date(solve.at).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm font-medium">Penalty</legend>
              <div className="flex gap-2" role="group">
                {PENALTIES.map((p) => (
                  <Button
                    key={p}
                    type="button"
                    variant={solve.penalty === p ? 'default' : 'outline'}
                    aria-pressed={solve.penalty === p}
                    onClick={() => onChange({ ...solve, penalty: p })}
                    data-penalty={p}
                  >
                    {PENALTY_LABELS[p]}
                  </Button>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <Label htmlFor="solve-comment">Comment</Label>
              <textarea
                id="solve-comment"
                rows={2}
                value={solve.comment ?? ''}
                onChange={(e) => {
                  const { comment: _old, ...rest } = solve;
                  onChange(e.target.value === '' ? rest : { ...rest, comment: e.target.value });
                }}
                className="w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Scramble</span>
                {solve.scramble && event && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowDiagram((v) => !v)}>
                    {showDiagram ? 'Hide diagram' : 'Show diagram'}
                  </Button>
                )}
              </div>
              <p className="font-mono text-sm break-words">{solve.scramble || 'No scramble recorded.'}</p>
              {showDiagram && event && (
                <TwistyView puzzle={event.puzzle} setup={solve.scramble} view="2D" size="md" label={`Scramble for solve ${number}`} className="mx-auto" />
              )}
            </div>

            <DialogFooter>
              {confirmDelete ? (
                <>
                  <span className="mr-auto self-center text-sm">Delete this solve?</span>
                  <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}>
                    Cancel
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => onDelete(solve.id)}>
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="destructive" onClick={() => setConfirmDelete(true)}>
                    Delete solve
                  </Button>
                  <Button type="button" onClick={onClose}>
                    Done
                  </Button>
                </>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
