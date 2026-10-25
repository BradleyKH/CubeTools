import { useEffect, useState } from 'react';
import type { AlgCase, AlgSet } from '@/data/algsets';
import type { DisplayMode } from '@/lib/flashcard-storage';
import { isLastLayerStickering } from '@/lib/cube';
import { caseSetup, caseStickering } from '@/lib/flashcard-setup';
import TwistyView from '@/components/tools/TwistyView';
import AlgChooser from './AlgChooser';
import { caseLabel } from './useFlashcards';

interface FlashCardProps {
  set: AlgSet;
  item: AlgCase;
  algIndex: number;
  displayMode: DisplayMode;
  revealed: boolean;
  onReveal: () => void;
  onChooseAlg: (index: number) => void;
}

const hiddenClass = 'invisible';

function useCaseSetup(alg: string): string | undefined {
  const [resolved, setResolved] = useState<{ alg: string; setup: string }>();
  useEffect(() => {
    let live = true;
    void caseSetup(alg).then((setup) => live && setResolved({ alg, setup }));
    return () => {
      live = false;
    };
  }, [alg]);
  return resolved?.alg === alg ? resolved.setup : undefined;
}

export default function FlashCard({
  set,
  item,
  algIndex,
  displayMode,
  revealed,
  onReveal,
  onChooseAlg,
}: FlashCardProps) {
  const alg = item.algs[algIndex];
  const label = caseLabel(set, item);
  const showCase = displayMode !== 'alg-to-case' || revealed;
  const showAlg = displayMode !== 'case-to-alg' || revealed;
  const stickering = caseStickering(set, item);
  const view = isLastLayerStickering(stickering) ? '2D' : '3D';
  const setup = useCaseSetup(alg);

  return (
    <div
      className="rounded-xl border bg-card p-4 text-center text-card-foreground shadow-sm sm:p-6"
      onClick={revealed ? undefined : onReveal}
    >
      <div className="relative mx-auto w-fit">
        {/* The diagram stays mounted while hidden so revealing it does not rebuild the player. */}
        <div className={showCase ? undefined : hiddenClass} aria-hidden={!showCase}>
          {setup === undefined ? (
            <div className="aspect-square w-64 max-w-full" />
          ) : (
            <TwistyView
              setup={setup}
              stickering={stickering}
              view={view}
              size="lg"
              label={showCase ? `${label} case diagram` : 'Hidden case'}
            />
          )}
        </div>
        {!showCase && (
          <div className="absolute inset-0 grid place-items-center rounded-lg border-2 border-dashed text-muted-foreground">
            Which case?
          </div>
        )}
      </div>
      <p className={`mt-2 font-medium ${showCase ? '' : hiddenClass}`}>{label}</p>

      <div className="mt-4 min-h-12" aria-live="polite">
        {showAlg ? (
          <code className="font-mono text-lg break-words sm:text-xl">{alg}</code>
        ) : (
          <p className="text-muted-foreground">Recall the algorithm, then reveal it.</p>
        )}
      </div>
      {showAlg && showCase && (
        <AlgChooser item={item} value={algIndex} onChange={onChooseAlg} />
      )}
    </div>
  );
}
