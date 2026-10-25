import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import TwistyView from '@/components/tools/TwistyView';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { viewFor } from '@/components/tools/scrambler/view';

interface ScrambleCardProps {
  index: number;
  scramble: string;
  puzzle: string;
}

export default function ScrambleCard({ index, scramble, puzzle }: ScrambleCardProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(scramble);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <li className="flex items-start gap-3 rounded-xl border bg-card p-4 text-card-foreground sm:gap-4">
      <span className="w-6 shrink-0 pt-0.5 text-sm tabular-nums text-muted-foreground">{index}.</span>
      <p className="min-w-0 flex-1 break-words font-mono text-sm leading-relaxed sm:text-base">{scramble}</p>
      <div className="flex shrink-0 flex-col items-center gap-2">
        <TwistyView
          puzzle={puzzle}
          setup={scramble}
          view={viewFor(puzzle)}
          size="sm"
          label={`Scrambled ${puzzle} for scramble ${index}`}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={copy} aria-label={`Copy scramble ${index}`}>
              {copied ? <CheckIcon /> : <CopyIcon />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy scramble to clipboard</TooltipContent>
        </Tooltip>
      </div>
    </li>
  );
}
