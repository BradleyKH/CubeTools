import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { Alg } from 'cubing/alg';
import { describe, expect, it } from 'vitest';
import { puzzles } from 'cubing/puzzles';
import {
  invertAlg,
  normalizeAlg,
  stickeringFor,
  stickeringMaskOrbitsFor,
  visualizationFor,
  yellowTopStickeringMask,
} from './cube';

describe('normalizeAlg', () => {
  it.each([
    ["(RUR'U')*3", "(R U R' U')3"],
    ["R'U2 (R2U)*2 R", "R' U2 (R2 U)2 R"],
    ["(RUR'U2)(RUR’U’)(RUR')", "(R U R' U2) (R U R' U') (R U R')"],
    ["y (L'U'L)", "y (L' U' L)"],
    ["(RUR'U')x3", "(R U R' U')3"],
    ["F(RUR'U')*3 F'", "F (R U R' U')3 F'"],
    ["(MU) (RUR'U') (M2U) (RU'r')", "(M U) (R U R' U') (M2 U) (R U' r')"],
    ["d' (L'UL) U (L'ULU'L'UL)", "d' (L' U L) U (L' U L U' L' U L)"],
    ["(R2D') (RU2R') D (RU2R)", "(R2 D') (R U2 R') D (R U2 R)"],
    ["<b>(RUR')</b>&nbsp;U2", "(R U R') U2"],
    ["R U R' U'", "R U R' U'"],
    ["[R, U]", '[R, U]'],
    ['Rw U2 3Rw', 'Rw U2 3Rw'],
    ["[U] (RU2)(R2FRF')", "(U) (R U2) (R2 F R F')"],
    ["(R' U2 R)' (R' U' R U')'", "(R' U2 R)' (R' U' R U')'"],
  ])('%j -> %j', (input, expected) => {
    const normalized = normalizeAlg(input);
    expect(normalized).toBe(expected);
    expect(() => Alg.fromString(normalized)).not.toThrow();
  });

  it('normalizes every legacy flashcard algorithm into parseable cubing.js syntax', () => {
    const source = readFileSync(
      fileURLToPath(new URL('../../scripts/flashcardSets.js', import.meta.url)),
      'utf8',
    );
    const sandbox: Record<string, unknown> = {};
    runInNewContext(source, sandbox);

    const algs = Object.entries(sandbox)
      .filter(([name]) => name.startsWith('algs'))
      .flatMap(([, groups]) => groups as string[][])
      .flatMap((group) => group.slice(1))
      .flatMap((cell) => cell.split(/<br>\s*(?:Alt:|If [^:]*:)?/i))
      .map((alg) => alg.trim())
      .filter(Boolean);

    expect(algs.length).toBeGreaterThan(100);
    for (const alg of algs) {
      const normalized = normalizeAlg(alg);
      expect(() => Alg.fromString(normalized), `${alg} -> ${normalized}`).not.toThrow();
    }
  });
});

describe('invertAlg', () => {
  it('inverts legacy notation', () => {
    expect(invertAlg("(RUR'U')*3")).toBe("(R U R' U')3'");
    expect(invertAlg("F (RUR'U') F'")).toBe("F (R U R' U')' F'");
    expect(invertAlg("R U R'")).toBe("R U' R'");
  });

  it('throws on unparseable input', () => {
    expect(() => invertAlg('R U ?')).toThrow(/Cannot invert/);
  });
});

describe('stickeringFor', () => {
  it.each([
    ['oll', 'OLL'],
    ['oll2', 'OLL'],
    ['2-look PLL', 'PLL'],
    ['F2L', 'F2L'],
    ['cmll2', 'CMLL'],
    ['eocross', 'EOcross'],
    ['First Block', 'FirstBlock'],
    ['L6E', 'L6E'],
    ['pbl', 'PBL'],
  ])('%j -> %j', (caseType, expected) => {
    expect(stickeringFor(caseType)).toBe(expected);
  });

  it('returns undefined for unknown case types', () => {
    expect(stickeringFor('megaminx-star')).toBeUndefined();
  });
});

describe('visualizationFor', () => {
  it('uses the last-layer 2D view only for last-layer stickerings', () => {
    expect(visualizationFor('2D', 'OLL')).toBe('experimental-2D-LL');
    expect(visualizationFor('2D', 'F2L')).toBe('2D');
    expect(visualizationFor('2D', undefined)).toBe('2D');
    expect(visualizationFor('3D', 'OLL')).toBe('3D');
  });
});

describe('yellowTopStickeringMask', () => {
  // Home indices of the pieces on the D layer in cubing.js's 3x3x3 and 2x2x2 definitions.
  const D_EDGES = [4, 5, 6, 7];
  const D_CORNERS = [4, 5, 6, 7];
  const D_CENTER = 5;

  function highlighted(mask: Awaited<ReturnType<typeof yellowTopStickeringMask>>, orbit: string): number[] {
    return mask!.orbits[orbit].pieces.flatMap((piece, index) => {
      const primary = piece?.facelets[0];
      return primary === 'regular' ? [index] : [];
    });
  }

  it('moves the 3x3x3 OLL highlight onto the D-home pieces that z2 turns to the top', async () => {
    const mask = await yellowTopStickeringMask('3x3x3', 'OLL');
    expect(highlighted(mask, 'EDGES')).toEqual(D_EDGES);
    expect(highlighted(mask, 'CORNERS')).toEqual(D_CORNERS);
    expect(highlighted(mask, 'CENTERS')).toContain(D_CENTER);
    expect(highlighted(mask, 'CENTERS')).not.toContain(0);
  });

  it('moves the 2x2x2 OLL highlight onto the D-home corners', async () => {
    const mask = await yellowTopStickeringMask('2x2x2', 'OLL');
    expect(highlighted(mask, 'CORNERS')).toEqual(D_CORNERS);
  });

  it('keeps F2L highlighting off the pieces that end up on top', async () => {
    const mask = await yellowTopStickeringMask('3x3x3', 'F2L');
    const edges = highlighted(mask, 'EDGES');
    expect(edges).toEqual(expect.arrayContaining([0, 1, 2, 3]));
    expect(edges).not.toEqual(expect.arrayContaining(D_EDGES));
  });

  it('relies on z2 leaving every piece at orientation 0', async () => {
    for (const id of ['3x3x3', '2x2x2']) {
      const kpuzzle = await puzzles[id].kpuzzle();
      const { patternData } = kpuzzle.defaultPattern().applyAlg('z2');
      for (const orbit of Object.values(patternData)) {
        expect(orbit.orientation.every((o) => o === 0)).toBe(true);
      }
    }
  });
});

describe('stickeringMaskOrbitsFor', () => {
  it('returns undefined without a stickering or without the yellow-top rotation', async () => {
    expect(await stickeringMaskOrbitsFor('3x3x3', undefined, true)).toBeUndefined();
    expect(await stickeringMaskOrbitsFor('3x3x3', 'OLL', false)).toBeUndefined();
  });

  it('serializes OLL in the compact orbit format with D-home pieces regular on top', async () => {
    expect(await stickeringMaskOrbitsFor('3x3x3', 'OLL', true)).toBe(
      'EDGES:DDDDOOOODDDD,CORNERS:DDDDOOOO,CENTERS:DDDDD-',
    );
    expect(await stickeringMaskOrbitsFor('2x2x2', 'OLL', true)).toBe('CORNERS:DDDDOOOO');
  });

  it('falls back to JSON when a piece stickering has no compact code', async () => {
    const serialized = await stickeringMaskOrbitsFor('3x3x3', 'L6EO', true);
    expect(serialized?.startsWith('{')).toBe(true);
    expect(JSON.parse(serialized!).orbits.EDGES.pieces).toHaveLength(12);
  });
});
