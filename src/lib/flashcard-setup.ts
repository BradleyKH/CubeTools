import { cube3x3x3 } from 'cubing/puzzles';
import type { AlgCase, AlgSet } from '@/data/algsets';
import { invertAlg, type Stickering } from '@/lib/cube';

const ROTATIONS = ['', 'x', 'x2', "x'", 'z', "z'"].flatMap((a) =>
  ['', 'y', 'y2', "y'"].map((b) => `${a} ${b}`.trim()),
);
const SLICES = ['', 'M', 'M2', "M'"];

/** The stickering for a case: its group's override, else the set's. */
export function caseStickering(set: AlgSet, item: AlgCase): Stickering {
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
export function caseSetup(alg: string): Promise<string> {
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
