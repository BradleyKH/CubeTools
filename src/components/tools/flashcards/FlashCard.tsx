import { useEffect, useState } from 'react';
import { cube3x3x3 } from 'cubing/puzzles';
import type { AlgCase, AlgSet } from '@/data/algsets';
import type { DisplayMode } from '@/lib/flashcard-storage';
import { invertAlg, isLastLayerStickering, type Stickering } from '@/lib/cube';
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

const ROTATIONS = ['', 'x', 'x2', "x'", 'z', "z'"].flatMap((a) =>
  ['', 'y', 'y2', "y'"].map((b) => `${a} ${b}`.trim()),
);
const SLICES = ['', 'M', 'M2', "M'"];

function stickeringFor(set: AlgSet, item: AlgCase): Stickering {
  const group = set.groups.find((g) => g.cases.includes(item));
  return group?.stickering ?? set.stickering;
}

const setupCache = new Map<string, Promise<string>>();

/**
 * The inverse of `alg`, adjusted when the algorithm's rotations, wide turns, or slice turns
 * would leave another center on top (E perm's `x'`, J perm's `r ... l'`): twisty-player draws
 * the face whose center is on top, so the setup starts with the rotation that brings the
 * algorithm's frame back to yellow-up, and Roux algorithms that leave the M slice turned get
 * it realigned. Setups that keep the U center on top are left alone, so F2L algorithms that
 * open with `y` show their case from that turned viewpoint.
 */
function caseSetup(alg: string): Promise<string> {
  let pending = setupCache.get(alg);
  if (!pending) {
    pending = (async () => {
      const inverse = invertAlg(alg);
      const kpuzzle = await cube3x3x3.kpuzzle();
      const solve = (moves: string) => kpuzzle.defaultPattern().applyAlg(moves).patternData;
      if (solve(inverse).CENTERS.pieces[0] === 0) return inverse;
      for (const rotation of ROTATIONS) {
        for (const slice of SLICES) {
          const setup = `${rotation} ${inverse} ${slice}`.trim();
          const state = solve(setup);
          // Centers home and the four D-layer corners (indices 4 to 7) in place.
          const centersHome = state.CENTERS.pieces.every((piece, i) => piece === i);
          const bottomHome = state.CORNERS.pieces.slice(4).every((piece, i) => piece === i + 4);
          if (centersHome && bottomHome) return setup;
        }
      }
      return inverse;
    })().catch(() => invertAlg(alg));
    setupCache.set(alg, pending);
  }
  return pending;
}

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
  const stickering = stickeringFor(set, item);
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
