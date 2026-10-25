import { useState } from 'react';
import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EVENTS, getEvent, isEventId, type EventId } from '@/lib/events';
import type { Session } from '@/lib/timer/types';

interface Props {
  sessions: Session[];
  currentId: string;
  eventId: EventId;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onEventChange: (eventId: EventId) => void;
}

type NameDialog = { kind: 'create' | 'rename'; name: string } | null;

export default function SessionPicker({
  sessions,
  currentId,
  eventId,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
  onEventChange,
}: Props) {
  const [nameDialog, setNameDialog] = useState<NameDialog>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const current = sessions.find((s) => s.id === currentId);

  const submitName = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!nameDialog) return;
    const name = nameDialog.name.trim();
    if (name === '') return;
    if (nameDialog.kind === 'create') onCreate(name);
    else onRename(currentId, name);
    setNameDialog(null);
  };

  const nextName = () => {
    const used = new Set(sessions.map((s) => s.name));
    let n = sessions.length + 1;
    while (used.has(`Session ${n}`)) n++;
    return `Session ${n}`;
  };

  return (
    <div className="flex flex-wrap items-end gap-2">
      <div className="flex flex-col gap-1">
        <Label htmlFor="timer-session" className="text-xs text-muted-foreground">
          Session
        </Label>
        <Select value={currentId} onValueChange={onSwitch}>
          <SelectTrigger id="timer-session" className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
                <span className="text-muted-foreground">{isEventId(s.eventId) ? ` (${getEvent(s.eventId).name})` : ''}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="timer-event" className="text-xs text-muted-foreground">
          Event
        </Label>
        <Select value={eventId} onValueChange={(v) => onEventChange(v as EventId)}>
          <SelectTrigger id="timer-event" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENTS.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1">
        <Button variant="outline" size="icon" aria-label="New session" title="New session" onClick={() => setNameDialog({ kind: 'create', name: nextName() })}>
          <PlusIcon aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Rename session" title="Rename session" onClick={() => setNameDialog({ kind: 'rename', name: current?.name ?? '' })}>
          <PencilIcon aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Delete session" title="Delete session" onClick={() => setConfirmDelete(true)}>
          <Trash2Icon aria-hidden="true" />
        </Button>
      </div>

      <Dialog open={nameDialog !== null} onOpenChange={(open) => !open && setNameDialog(null)}>
        <DialogContent>
          <form onSubmit={submitName} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>{nameDialog?.kind === 'rename' ? 'Rename session' : 'New session'}</DialogTitle>
              <DialogDescription>
                {nameDialog?.kind === 'rename' ? 'Choose a new name for this session.' : 'The new session starts empty with the current event.'}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor="session-name">Name</Label>
              <input
                id="session-name"
                autoFocus
                maxLength={60}
                value={nameDialog?.name ?? ''}
                onChange={(e) => setNameDialog((d) => (d ? { ...d, name: e.target.value } : d))}
                className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setNameDialog(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!nameDialog || nameDialog.name.trim() === ''}>
                {nameDialog?.kind === 'rename' ? 'Rename' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete session?</DialogTitle>
            <DialogDescription>
              {current ? `"${current.name}" and its ${current.solves.length} solves will be removed. This cannot be undone.` : 'This cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(currentId);
                setConfirmDelete(false);
              }}
            >
              Delete session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
