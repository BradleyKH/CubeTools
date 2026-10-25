import { Alg } from 'cubing/alg';
import type { KPattern, KPuzzle } from 'cubing/kpuzzle';
import { cube2x2x2 } from 'cubing/puzzles';
import { beforeAll, describe, expect, it } from 'vitest';
import { casesIn, cllGroups, eg1Groups, eg2Groups, type CaseGroup2x2 } from './advanced-2x2-algs';

// The 2x2x2 KPuzzle has one CORNERS orbit: positions 0-3 are the U ring and 4-7 the D ring,
// in turning order. It has no centers, so every comparison first removes whole-cube rotation.
type BottomState = 'solved' | 'adjacent' | 'diagonal' | 'other';

const ROTATIONS = ['', 'x', 'x2', "x'", 'z', "z'"].flatMap((a) =>
  ['', 'y', 'y2', "y'"].map((b) => `${a} ${b}`.trim()),
);
const QUARTERS = ['', 'U', 'U2', "U'"];
const D_QUARTERS = ['', 'D', 'D2', "D'"];
const Y_QUARTERS = ['', 'y', 'y2', "y'"];

let kpuzzle: KPuzzle;
let solved: KPattern;

beforeAll(async () => {
  kpuzzle = await cube2x2x2.kpuzzle();
  solved = kpuzzle.defaultPattern();
});

const corners = (pattern: KPattern) => pattern.patternData.CORNERS;
const invert = (alg: string) => Alg.fromString(alg).invert().toString();

/** Rotates the cube so the D ring holds the four D pieces, each with its D sticker down. */
function bottomDown(pattern: KPattern): KPattern | undefined {
  for (const rotation of ROTATIONS) {
    const rotated = rotation ? pattern.applyAlg(rotation) : pattern;
    const { pieces, orientation } = corners(rotated);
    if ([4, 5, 6, 7].every((i) => pieces[i] >= 4 && orientation[i] === 0)) return rotated;
  }
  return undefined;
}

/** How the D ring is permuted, up to a D-layer adjustment. */
function ringState(ring: number[]): BottomState {
  for (let shift = 0; shift < 4; shift++) {
    const t = ring.map((piece) => (piece - shift + 4) % 4);
    const moved = t.flatMap((piece, i) => (piece === i ? [] : [i]));
    if (moved.length === 0) return 'solved';
    const [a, b] = moved;
    if (moved.length === 2 && t[a] === b && t[b] === a) return b - a === 2 ? 'diagonal' : 'adjacent';
  }
  return 'other';
}

function bottomState(alg: string): BottomState {
  const pattern = bottomDown(solved.applyAlg(alg));
  if (!pattern) return 'other';
  return ringState(corners(pattern).pieces.slice(4).map((piece) => piece - 4));
}

/**
 * A canonical id for the case an algorithm solves, taken over every pre- and post-AUF, final
 * D adjustment, and y-axis viewpoint, with rotation removed. It is built from the algorithm's
 * effect on a solved cube rather than from the case itself: the case's first face may be any
 * color, while the effect always ends with the D pieces forming a face.
 */
function caseKey(alg: string): string {
  let best: string | undefined;
  for (const y of Y_QUARTERS)
    for (const pre of QUARTERS)
      for (const post of QUARTERS)
        for (const d of D_QUARTERS) {
          const solve = [y, pre, alg, post, d, y && invert(y)].filter(Boolean).join(' ');
          const down = bottomDown(solved.applyAlg(solve));
          if (!down) continue;
          const aligned =
            Y_QUARTERS.map((r) => (r ? down.applyAlg(r) : down)).find((p) => corners(p).pieces[4] === 4) ?? down;
          const { pieces, orientation } = corners(aligned);
          const key = `${pieces.join('')}/${orientation.join('')}`;
          if (best === undefined || key < best) best = key;
        }
  if (best === undefined) throw new Error(`No canonical case for ${alg}`);
  return best;
}

/**
 * The last-layer orientation an algorithm solves: the U-ring twists of the case it starts from,
 * as the smallest rotation of the ring so U turns do not matter. Some algorithms finish solved but
 * rotated, so the case is rebuilt from the inverse after each starting rotation until the D pieces form the bottom.
 */
function topOrientation(alg: string): string | undefined {
  for (const rotation of ROTATIONS) {
    const pattern = bottomDown(solved.applyAlg(`${rotation} ${invert(alg)}`.trim()));
    if (!pattern) continue;
    const ring = corners(pattern).orientation.slice(0, 4);
    return ring.map((_, shift) => [...ring.slice(shift), ...ring.slice(0, shift)].join('')).sort()[0];
  }
  return undefined;
}

// One textbook OLL per orientation group, used to label each group's twist pattern.
const ORIENTATION_REFERENCES: Record<string, string> = {
  Sune: "R U R' U R U2 R'",
  'Anti-Sune': "R U2 R' U' R U' R'",
  Pi: "R U2 R2 U' R2 U' R2 U2 R",
  H: "R2 U2 R U2 R2",
  L: "F R' F' R U R U' R'",
  T: "R U R' U' R' F R F'",
  U: "F R U R' U' F'",
  Oriented: '',
};

const SETS: [string, CaseGroup2x2[], BottomState, number][] = [
  ['CLL', cllGroups, 'solved', 42],
  ['EG-1', eg1Groups, 'adjacent', 43],
  ['EG-2', eg2Groups, 'diagonal', 43],
];

describe('orientation references', () => {
  it('name eight distinct twist patterns', () => {
    const patterns = Object.values(ORIENTATION_REFERENCES).map((alg) => topOrientation(alg));
    expect(patterns).not.toContain(undefined);
    expect(new Set(patterns).size).toBe(patterns.length);
  });
});

describe.each(SETS)('%s', (_name, groups, bottom, count) => {
  const cases = casesIn(groups);

  it(`has ${count} cases with unique ids`, () => {
    expect(cases).toHaveLength(count);
    expect(new Set(cases.map((c) => c.id)).size).toBe(count);
  });

  it('every algorithm parses', () => {
    for (const c of cases) {
      expect(c.algs.length, c.id).toBeGreaterThan(0);
      for (const alg of c.algs) expect(() => Alg.fromString(alg), `${c.id}: ${alg}`).not.toThrow();
    }
  });

  it(`every algorithm leaves the bottom layer ${bottom === 'solved' ? 'solved' : `with a ${bottom} swap`}`, () => {
    for (const c of cases) {
      for (const alg of c.algs) expect(bottomState(alg), `${c.id}: ${alg}`).toBe(bottom);
    }
  });

  it('alternates solve the same case as the primary, and no two cases match', () => {
    const seen = new Map<string, string>();
    for (const c of cases) {
      const [primary, ...alternates] = c.algs.map(caseKey);
      alternates.forEach((key, i) => expect(key, `${c.id}: ${c.algs[i + 1]}`).toBe(primary));
      expect(seen.get(primary), `${c.id} duplicates ${seen.get(primary)}`).toBeUndefined();
      seen.set(primary, c.id);
    }
  });

  it('every case sits in the group for its last-layer orientation', () => {
    for (const group of groups) {
      const reference = ORIENTATION_REFERENCES[group.name];
      expect(reference, `no orientation reference for group ${group.name}`).toBeDefined();
      const expected = topOrientation(reference);
      for (const c of group.cases) {
        for (const alg of c.algs) expect(topOrientation(alg), `${c.id}: ${alg}`).toBe(expected);
      }
    }
  });
});
