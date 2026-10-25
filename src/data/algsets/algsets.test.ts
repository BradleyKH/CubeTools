import { Alg } from 'cubing/alg';
import type { KPattern, KPuzzle } from 'cubing/kpuzzle';
import { cube3x3x3 } from 'cubing/puzzles';
import { beforeAll, describe, expect, it } from 'vitest';
import { normalizeAlg, STICKERINGS } from '@/lib/cube';
import { caseSetup, caseStickering } from '@/lib/flashcard-setup';
import { algSets, legacyIndexToId } from './index';
import type { AlgCase, AlgSet, AlgSetId } from './types';

const EXPECTED_COUNTS: Record<AlgSetId, number> = {
  f2l: 41,
  oll2: 10,
  oll: 57,
  pll2: 6,
  pll: 21,
  cmll2: 9,
  cmll: 42,
};

// Piece indices in the cubing.js 3x3x3 KPuzzle. EDGES: UF UR UB UL, DF DR DB DL, FR FL BR BL.
// CORNERS: UFR URB UBL ULF, DRF DFL DLB DBR. CENTERS: U L F R B D.
interface Mask {
  /** Pieces that must be home and oriented. */
  edges: number[];
  corners: number[];
  /** Positions that only need orientation 0. */
  orientedEdges: number[];
  orientedCorners: number[];
  /** Roux masks ignore the M slice, so only the L and R centers fix the orientation. */
  roux: boolean;
}

const range = (from: number, to: number) => Array.from({ length: to - from }, (_, i) => from + i);
const mask = (m: Partial<Mask>): Mask => ({
  edges: [],
  corners: [],
  orientedEdges: [],
  orientedCorners: [],
  roux: false,
  ...m,
});

const MASKS = {
  full: mask({ edges: range(0, 12), corners: range(0, 8) }),
  // F2L algorithms may scramble the last layer and only target the front-right slot.
  f2lOtherSlots: mask({ edges: [4, 5, 6, 7, 9, 10, 11], corners: [5, 6, 7] }),
  f2l: mask({ edges: range(4, 12), corners: range(4, 8) }),
  eoll: mask({ edges: range(4, 12), corners: range(4, 8), orientedEdges: range(0, 4) }),
  oll: mask({ edges: range(4, 12), corners: range(4, 8), orientedEdges: range(0, 4), orientedCorners: range(0, 4) }),
  cpll: mask({ edges: range(4, 12), corners: range(0, 8), orientedEdges: range(0, 4) }),
  blocks: mask({ edges: [5, 7, 8, 9, 10, 11], corners: range(4, 8), roux: true }),
  cmllOrientation: mask({ edges: [5, 7, 8, 9, 10, 11], corners: range(4, 8), orientedCorners: range(0, 4), roux: true }),
  cmll: mask({ edges: [5, 7, 8, 9, 10, 11], corners: range(0, 8), roux: true }),
};

/** What an alternate must agree with the primary on, by set and group index. */
function sameCaseMask(setId: AlgSetId, groupIndex: number): Mask {
  switch (setId) {
    case 'f2l':
      return MASKS.f2l;
    case 'oll2':
      return groupIndex === 0 ? MASKS.eoll : MASKS.oll;
    case 'oll':
      return MASKS.oll;
    case 'pll2':
      return groupIndex === 0 ? MASKS.cpll : MASKS.full;
    case 'pll':
      return MASKS.full;
    case 'cmll2':
      return groupIndex === 0 ? MASKS.cmllOrientation : MASKS.cmll;
    case 'cmll':
      return MASKS.cmll;
  }
}

/** What every primary algorithm must leave untouched. */
function preservedMask(setId: AlgSetId): Mask {
  switch (setId) {
    case 'f2l':
      return MASKS.f2lOtherSlots;
    case 'oll2':
    case 'oll':
    case 'pll2':
      return MASKS.f2l;
    case 'pll':
      return MASKS.oll;
    case 'cmll2':
    case 'cmll':
      return MASKS.blocks;
  }
}

const ROTATIONS = ['', 'x', 'x2', "x'", 'z', "z'"].flatMap((a) =>
  ['', 'y', 'y2', "y'"].map((b) => `${a} ${b}`.trim()),
);
const AUFS = ['', 'U', 'U2', "U'"];

let kpuzzle: KPuzzle;
let solved: KPattern;

beforeAll(async () => {
  kpuzzle = await cube3x3x3.kpuzzle();
  solved = kpuzzle.defaultPattern();
});

function isUpright(pattern: KPattern, roux: boolean): boolean {
  const { CENTERS, CORNERS } = pattern.patternData;
  if (!roux) return CENTERS.pieces.every((piece, i) => piece === i);
  // M-slice moves displace the U/F/B/D centers, so use the L/R centers plus the D-layer corners.
  return CENTERS.pieces[1] === 1 && CENTERS.pieces[3] === 3 && [4, 5, 6, 7].every((i) => CORNERS.pieces[i] >= 4);
}

/** Rotates the whole cube back to the standard orientation. */
function upright(pattern: KPattern, roux: boolean): KPattern {
  for (const rotation of ROTATIONS) {
    const rotated = pattern.applyAlg(rotation);
    if (isUpright(rotated, roux)) return rotated;
  }
  throw new Error('No whole-cube rotation restores the orientation');
}

function matches(pattern: KPattern, m: Mask): boolean {
  const { EDGES, CORNERS } = pattern.patternData;
  return (
    m.edges.every((i) => EDGES.pieces[i] === i && EDGES.orientation[i] === 0) &&
    m.corners.every((i) => CORNERS.pieces[i] === i && CORNERS.orientation[i] === 0) &&
    m.orientedEdges.every((i) => EDGES.orientation[i] === 0) &&
    m.orientedCorners.every((i) => CORNERS.orientation[i] === 0)
  );
}

/**
 * The case an algorithm solves, held the way the solver holds it before starting. Algorithms
 * with a net rotation (`y`, `x'`, wide moves) end rotated, so the case is the inverse applied
 * to a solved cube already carrying that rotation.
 */
function caseFor(alg: string, roux: boolean): KPattern {
  const after = solved.applyAlg(alg);
  const net = ROTATIONS.find((r) => isUpright(after.applyAlg(Alg.fromString(r).invert()), roux));
  if (net === undefined) throw new Error(`No net rotation found for ${alg}`);
  return solved.applyAlg(net).applyAlg(Alg.fromString(alg).invert());
}

/** True when `alt`, after some pre-AUF, solves the primary's case up to a final AUF. */
function solvesSameCase(primary: string, alt: string, m: Mask): boolean {
  const start = caseFor(primary, m.roux);
  return AUFS.some((pre) => {
    const end = upright(start.applyAlg(pre).applyAlg(alt), m.roux);
    return AUFS.some((post) => matches(end.applyAlg(post), m));
  });
}

const allCases = (set: AlgSet) => set.groups.flatMap((group) => group.cases);

/**
 * What TwistyView draws for a flashcard: its `z2` (when the stickering turns yellow to the
 * top) followed by the FlashCard setup.
 */
async function flashcardPattern(set: AlgSet, c: AlgCase): Promise<KPattern> {
  const yellowTop = caseStickering(set, c) !== 'full';
  const setup = normalizeAlg(await caseSetup(c.algs[0]));
  return solved.applyAlg([yellowTop ? 'z2' : '', setup].filter(Boolean).join(' '));
}

/** Rotates `pattern` so its centers line up with `frame` (the L and R centers and D layer for Roux). */
function alignTo(pattern: KPattern, frame: KPattern, roux: boolean): KPattern | undefined {
  const want = frame.patternData;
  const bottom = new Set(want.CORNERS.pieces.slice(4));
  return ROTATIONS.map((r) => pattern.applyAlg(r)).find((rotated) => {
    const { CENTERS, CORNERS } = rotated.patternData;
    if (!roux) return CENTERS.pieces.every((piece, i) => piece === want.CENTERS.pieces[i]);
    return (
      [1, 3].every((i) => CENTERS.pieces[i] === want.CENTERS.pieces[i]) &&
      [4, 5, 6, 7].every((i) => bottom.has(CORNERS.pieces[i]))
    );
  });
}

/** Like `matches`, but against the solved state as `frame` holds it. */
function matchesFrame(pattern: KPattern, frame: KPattern, m: Mask): boolean {
  const { EDGES, CORNERS } = pattern.patternData;
  const want = frame.patternData;
  return (
    m.edges.every((i) => EDGES.pieces[i] === want.EDGES.pieces[i] && EDGES.orientation[i] === want.EDGES.orientation[i]) &&
    m.corners.every((i) => CORNERS.pieces[i] === want.CORNERS.pieces[i] && CORNERS.orientation[i] === want.CORNERS.orientation[i]) &&
    m.orientedEdges.every((i) => EDGES.orientation[i] === 0) &&
    m.orientedCorners.every((i) => CORNERS.orientation[i] === 0)
  );
}

// Front-right, front-left, back-right, back-left F2L slots as [edge, corner] positions.
const SLOTS = [
  [8, 4],
  [9, 5],
  [10, 7],
  [11, 6],
];

/** Problems with the diagram FlashCard shows for a case's primary, or an empty list. */
async function flashcardProblems(set: AlgSet, c: AlgCase): Promise<string[]> {
  const roux = set.method === 'Roux';
  const shown = await flashcardPattern(set, c);
  const frame = solved.applyAlg(caseStickering(set, c) === 'full' ? '' : 'z2');
  const problems: string[] = [];
  if (shown.patternData.CENTERS.pieces[0] !== frame.patternData.CENTERS.pieces[0]) {
    problems.push('the yellow center is not on top');
  }
  const aligned = alignTo(shown, frame, roux);
  if (!aligned) {
    problems.push('the centers are out of place');
  } else if (set.id === 'f2l') {
    const solvedSlots = SLOTS.filter(([edge, corner]) =>
      matchesFrame(aligned, frame, mask({ edges: [edge], corners: [corner] })),
    ).length;
    if (!matchesFrame(aligned, frame, mask({ edges: range(4, 8) })) || solvedSlots !== 3) {
      problems.push('the cross and three other pairs are not solved');
    }
  } else if (!matchesFrame(aligned, frame, roux ? MASKS.blocks : MASKS.f2l)) {
    problems.push(roux ? 'the L and R blocks are not solved' : 'F2L is not solved');
  }
  const done = shown.applyAlg(c.algs[0]);
  const finished = AUFS.some((auf) => {
    const end = alignTo(done, frame, roux);
    return end !== undefined && matchesFrame(end.applyAlg(auf), frame, roux ? MASKS.cmll : MASKS.full);
  });
  if (!finished) problems.push('the primary does not finish the cube up to AUF');
  return problems;
}

describe('algSets', () => {
  it('keeps the legacy set order', () => {
    expect(algSets.map((set) => set.id)).toEqual(legacyIndexToId);
  });

  it.each(algSets.map((set) => [set.id, set] as const))('%s has the expected case count', (id, set) => {
    expect(allCases(set)).toHaveLength(EXPECTED_COUNTS[id]);
  });

  it('uses unique case ids prefixed with the set id', () => {
    const ids = algSets.flatMap((set) => allCases(set).map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
    for (const set of algSets) {
      for (const c of allCases(set)) expect(c.id.startsWith(`${set.id}-`)).toBe(true);
      const groupIds = set.groups.map((g) => g.id);
      expect(new Set(groupIds).size).toBe(groupIds.length);
    }
  });

  it('uses known stickerings and descriptions without legacy links', () => {
    for (const set of algSets) {
      expect(STICKERINGS).toContain(set.stickering);
      for (const group of set.groups) {
        if (group.stickering) expect(STICKERINGS).toContain(group.stickering);
      }
      expect(set.description).not.toMatch(/\.(pdf|html)\b|<[a-z]/i);
      for (const [, href] of set.description.matchAll(/\]\(([^)]+)\)/g)) {
        expect(href).toMatch(/^tutorials\/[a-z0-9/-]+\/$/);
      }
    }
  });

  it('stores every algorithm in normalized, parseable cubing.js notation', () => {
    for (const set of algSets) {
      for (const c of allCases(set)) {
        expect(c.algs.length).toBeGreaterThan(0);
        for (const alg of c.algs) {
          expect(() => Alg.fromString(alg), `${c.id}: ${alg}`).not.toThrow();
          expect(normalizeAlg(alg), c.id).toBe(alg);
        }
      }
    }
  });

  it.each(algSets.map((set) => [set.id, set] as const))(
    '%s primaries leave the solved pieces solved',
    (id, set) => {
      const m = preservedMask(id);
      for (const c of allCases(set)) {
        expect(matches(upright(solved.applyAlg(c.algs[0]), m.roux), m), `${c.id}: ${c.algs[0]}`).toBe(true);
      }
    },
  );

  it.each(algSets.map((set) => [set.id, set] as const))(
    '%s alternates solve the same case as the primary',
    (id, set) => {
      set.groups.forEach((group, groupIndex) => {
        const m = sameCaseMask(id, groupIndex);
        for (const c of group.cases) {
          for (const alt of c.algs.slice(1)) {
            expect(solvesSameCase(c.algs[0], alt, m), `${c.id}: ${alt}`).toBe(true);
          }
        }
      });
    },
  );

  it.each(algSets.map((set) => [set.id, set] as const))(
    '%s primaries solve the case the flashcard shows',
    async (_id, set) => {
      for (const c of allCases(set)) {
        expect(await flashcardProblems(set, c), `${c.id}: ${c.algs[0]}`).toEqual([]);
      }
    },
  );

  it('distinguishes different cases', () => {
    // Guards the comparison itself against accepting everything.
    expect(solvesSameCase("R U R' U R U2 R'", "R' U' R U' R' U2 R", MASKS.oll)).toBe(false);
    expect(solvesSameCase("R U R'", "y L' U' L", MASKS.f2l)).toBe(false);
    expect(solvesSameCase("l' U R' D2 R U' R' D2 R2", "r U' L D2 L' U L D2 L2", MASKS.full)).toBe(false);
    expect(solvesSameCase("r U' L D2 L' U L D2 L2", "x R2 D2 R U R' D2 R U' R x'", MASKS.full)).toBe(true);
  });
});
