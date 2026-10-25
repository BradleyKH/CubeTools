import { useRef, useState, type ChangeEvent } from 'react';
import { DownloadIcon, SettingsIcon, UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { INSPECTION_SECONDS, type InspectionSetting, type TimerData, type TimerSettings as Settings } from '@/lib/timer/types';
import { exportCsv, exportJson, importJson, MAX_HOLD_DELAY_MS } from '@/lib/timer/storage';

interface Props {
  data: TimerData;
  onSettingsChange: (patch: Partial<Settings>) => void;
  onImport: (data: TimerData) => void;
}

function download(filename: string, text: string, type: string): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function stamp(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TimerSettings({ data, onSettingsChange, onImport }: Props) {
  const { settings } = data;
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<TimerData | null>(null);
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);
  const [delayText, setDelayText] = useState(String(settings.holdDelayMs));

  const readFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const result = importJson(await file.text());
    if (result.ok) {
      setPending(result.data);
      setMessage(null);
    } else {
      setPending(null);
      setMessage({ error: true, text: result.error });
    }
  };

  const commitDelay = (text: string) => {
    const n = Math.round(Number(text));
    const ms = Number.isFinite(n) ? Math.min(MAX_HOLD_DELAY_MS, Math.max(0, n)) : settings.holdDelayMs;
    setDelayText(String(ms));
    onSettingsChange({ holdDelayMs: ms });
  };

  const pendingSolves = pending?.sessions.reduce((sum, s) => sum + s.solves.length, 0) ?? 0;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) setDelayText(String(settings.holdDelayMs));
        else {
          setPending(null);
          setMessage(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Timer settings" title="Timer settings">
          <SettingsIcon aria-hidden="true" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Timer settings</DialogTitle>
          <DialogDescription>Settings and solves are saved in this browser.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="timer-inspection">Inspection</Label>
            <Select
              value={String(settings.inspection)}
              onValueChange={(v) => onSettingsChange({ inspection: (v === 'off' ? 'off' : Number(v)) as InspectionSetting })}
            >
              <SelectTrigger id="timer-inspection" className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                {INSPECTION_SECONDS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s} seconds{s === 15 ? ' (WCA)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="timer-hold-delay">Hold delay (ms)</Label>
            <input
              id="timer-hold-delay"
              type="number"
              inputMode="numeric"
              min={0}
              max={MAX_HOLD_DELAY_MS}
              step={50}
              value={delayText}
              onChange={(e) => setDelayText(e.target.value)}
              onBlur={(e) => commitDelay(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && commitDelay(e.currentTarget.value)}
              className="h-8 w-44 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="timer-hide-time">Hide time while solving</Label>
            <Switch
              id="timer-hide-time"
              checked={settings.hideTimeWhileSolving}
              onCheckedChange={(checked) => onSettingsChange({ hideTimeWhileSolving: checked })}
            />
          </div>

          <div className="grid gap-2 border-t border-border pt-4">
            <span className="text-sm font-medium">Data</span>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => download(`cubetools-timer-${stamp()}.json`, exportJson(data), 'application/json')}>
                <DownloadIcon aria-hidden="true" />
                Export JSON
              </Button>
              <Button variant="outline" size="sm" onClick={() => download(`cubetools-timer-${stamp()}.csv`, exportCsv(data.sessions), 'text/csv')}>
                <DownloadIcon aria-hidden="true" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                <UploadIcon aria-hidden="true" />
                Import JSON
              </Button>
              <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={readFile} />
            </div>
            {pending && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-3 text-sm">
                <span className="flex-1">
                  Replace all sessions with {pending.sessions.length} imported sessions ({pendingSolves} solves)?
                </span>
                <Button size="sm" variant="outline" onClick={() => setPending(null)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    onImport(pending);
                    setPending(null);
                    setMessage({ error: false, text: 'Import complete.' });
                  }}
                >
                  Replace
                </Button>
              </div>
            )}
            {message && (
              <p role="status" className={message.error ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>
                {message.text}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
