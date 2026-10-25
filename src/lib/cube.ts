import { Alg } from 'cubing/alg';
import { puzzles } from 'cubing/puzzles';

/** Stickerings this site uses, as named by cubing.js `experimentalStickerings`. */
export const STICKERINGS = [
  'full',
  'OLL',
  'PLL',
  'LL',
  'EOLL',
  'COLL',
  'OCLL',
  'CPLL',
  'CLL',
  'EPLL',
  'ELL',
  'ZBLL',
  'LS',
  'F2L',
  'Daisy',
  'Cross',
  'EOcross',
  'FirstBlock',
  'SecondBlock',
  'CMLL',
  'L10P',
  'L6E',
  'L6EO',
  'OBL',
  'PBL',
] as const;

export type Stickering = (typeof STICKERINGS)[number];

/** Stickerings whose 2D diagram reads best as a top-down last-layer view. */
const LAST_LAYER_STICKERINGS: ReadonlySet<string> = new Set([
  'OLL',
  'PLL',
  'LL',
  'EOLL',
  'COLL',
  'OCLL',
  'CPLL',
  'CLL',
  'EPLL',
  'ELL',
  'ZBLL',
  'CMLL',
  'OBL',
  'PBL',
]);

const CASE_TYPE_ALIASES: Record<string, Stickering> = {
  oll2: 'OLL',
  pll2: 'PLL',
  cmll2: 'CMLL',
  fb: 'FirstBlock',
  sb: 'SecondBlock',
  lse: 'L6E',
};

const STICKERING_BY_KEY = new Map<string, Stickering>(
  STICKERINGS.map((s) => [s.toLowerCase(), s]),
);

/** Maps a case type or set id (`oll`, `2-look PLL`, `firstblock`, `F2L`) to a cubing.js stickering, or undefined if unknown. */
export function stickeringFor(caseType: string): Stickering | undefined {
  const key = caseType.toLowerCase().replace(/[^a-z0-9]/g, '');
  const unprefixed = key.replace(/^2look/, '');
  return (
    STICKERING_BY_KEY.get(key) ??
    CASE_TYPE_ALIASES[key] ??
    STICKERING_BY_KEY.get(unprefixed) ??
    CASE_TYPE_ALIASES[unprefixed]
  );
}

export function isLastLayerStickering(stickering: string | undefined): boolean {
  return stickering !== undefined && LAST_LAYER_STICKERINGS.has(stickering);
}

/** The `<twisty-player visualization>` value for a CubeView `view`. */
export function visualizationFor(
  view: '2D' | '3D',
  stickering: string | undefined,
): '3D' | '2D' | 'experimental-2D-LL' {
  if (view === '3D') return '3D';
  return isLastLayerStickering(stickering) ? 'experimental-2D-LL' : '2D';
}

const ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#39;': "'",
  '&apos;': "'",
  '&quot;': '"',
  '&rsquo;': "'",
  '&lsquo;': "'",
  '&prime;': "'",
};

const MOVE = /^\d*[A-Za-z]w?\d*'?/;

/**
 * Converts legacy compact notation (`RUR'U'`, `(RUR'U')*3`, curly quotes, `<br>` markup)
 * into spaced cubing.js syntax (`R U R' U'`, `(R U R' U')3`).
 * Returns the canonical cubing.js string when the result parses, otherwise the best-effort spacing.
 */
export function normalizeAlg(input: string): string {
  const text = input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, (e) => ENTITIES[e.toLowerCase()] ?? ' ')
    .replace(/[‘’′´`]/g, "'")
    .trim();

  const tokens: string[] = [];
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === ')') {
      // Legacy repeat counts (`)*3`, `)x3`, `)3`) and cubing.js inverted groups (`)'`, `)3'`).
      const repeat = /^\)\s*(?:[*x×]\s*)?(\d*'?)/.exec(text.slice(i))!;
      tokens.push(`)${repeat[1]}`);
      i += repeat[0].length;
      continue;
    }
    if ('([],:'.includes(ch)) {
      tokens.push(ch);
      i++;
      continue;
    }
    const move = MOVE.exec(text.slice(i));
    if (move) {
      tokens.push(move[0]);
      i += move[0].length;
      continue;
    }
    tokens.push(ch);
    i++;
  }

  const spaced = tokens
    .join(' ')
    // Legacy `[U]` marks an optional pre-AUF; cubing.js brackets must be commutators or conjugates.
    .replace(/\[([^\[\],:]*)\]/g, '($1)')
    .replace(/([([]) /g, '$1')
    .replace(/ (\)|\]|,|:)/g, '$1')
    .replace(/([,:])(?=\S)/g, '$1 ');

  try {
    return Alg.fromString(spaced).toString();
  } catch {
    return spaced;
  }
}

/** Inverts an algorithm (legacy or cubing.js notation). Throws if it cannot be parsed. */
export function invertAlg(alg: string): string {
  const normalized = normalizeAlg(alg);
  try {
    return Alg.fromString(normalized).invert().toString();
  } catch (error) {
    throw new Error(`Cannot invert algorithm "${alg}" (normalized: "${normalized}")`, {
      cause: error,
    });
  }
}

type StickeringMaskLoader = NonNullable<(typeof puzzles)[string]['stickeringMask']>;
type StickeringMask = Awaited<ReturnType<StickeringMaskLoader>>;
type PieceMask = StickeringMask['orbits'][string]['pieces'][number];

// Inverse of the piece codes twisty-player parses from `experimental-stickering-mask-orbits`.
const PIECE_CODES: Record<string, string> = {
  '-': 'regular regular regular regular regular',
  D: 'dim dim dim dim dim',
  I: 'ignored ignored ignored ignored ignored',
  X: 'invisible invisible invisible invisible invisible',
  O: 'regular ignored ignored ignored ignored',
  P: 'dim regular regular regular regular',
  o: 'dim ignored ignored ignored ignored',
  '?': 'oriented ignored ignored ignored ignored',
  M: 'mystery mystery mystery mystery mystery',
};
const CODE_BY_FACELETS = new Map(Object.entries(PIECE_CODES).map(([code, facelets]) => [facelets, code]));

function pieceCode(piece: PieceMask): string | undefined {
  if (!piece) return undefined;
  const facelets = piece.facelets.map((f) => (typeof f === 'string' ? f : (f?.mask ?? '')));
  return CODE_BY_FACELETS.get(facelets.join(' '));
}

/**
 * Serializes a mask for `<twisty-player>`'s `experimentalStickeringMaskOrbits`: the compact
 * `ORBIT:codes,...` attribute format when every piece has a code, otherwise JSON (L6EO uses a
 * piece stickering the compact format cannot express).
 */
export function serializeStickeringMask(mask: StickeringMask): string {
  const orbits: string[] = [];
  for (const [orbitName, orbit] of Object.entries(mask.orbits)) {
    const codes = orbit.pieces.map(pieceCode);
    if (codes.some((code) => code === undefined)) return JSON.stringify(mask);
    orbits.push(`${orbitName}:${codes.join('')}`);
  }
  return orbits.join(',');
}

/**
 * cubing.js masks address pieces by identity, so after CubeView's `z2` the stock last-layer
 * mask would highlight the pieces that moved to the bottom. This moves each piece's mask onto
 * the piece that `z2` carries into its home position. Every 3x3x3 and 2x2x2 piece keeps
 * orientation 0 under `z2`, so facelet order needs no rotation.
 */
export async function yellowTopStickeringMask(
  puzzle: string,
  stickering: string,
): Promise<StickeringMask | undefined> {
  const loader = puzzles[puzzle];
  if (!loader?.stickeringMask) return undefined;
  const [mask, kpuzzle] = await Promise.all([loader.stickeringMask(stickering as Parameters<StickeringMaskLoader>[0]), loader.kpuzzle()]);
  const rotated = kpuzzle.defaultPattern().applyAlg('z2').patternData;
  const remapped: StickeringMask = { ...mask, orbits: {} };
  for (const [orbitName, orbit] of Object.entries(mask.orbits)) {
    const pieces = new Array<PieceMask>(orbit.pieces.length);
    rotated[orbitName].pieces.forEach((piece, position) => {
      pieces[piece] = orbit.pieces[position];
    });
    remapped.orbits[orbitName] = { pieces };
  }
  return remapped;
}

/**
 * The `experimental-stickering-mask-orbits` value for a CubeView, or undefined when the stock
 * `experimental-stickering` already highlights the right pieces (no yellow-top rotation).
 */
export async function stickeringMaskOrbitsFor(
  puzzle: string,
  stickering: string | undefined,
  yellowTop: boolean,
): Promise<string | undefined> {
  if (!stickering || !yellowTop) return undefined;
  const mask = await yellowTopStickeringMask(puzzle, stickering);
  return mask && serializeStickeringMask(mask);
}
