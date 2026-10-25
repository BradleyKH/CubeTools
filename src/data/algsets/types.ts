import type { Stickering } from '@/lib/cube';

export type AlgSetId = 'f2l' | 'oll2' | 'oll' | 'pll2' | 'pll' | 'cmll2' | 'cmll';

export interface AlgCase {
  /** Stable across reordering; saved flashcard progress is keyed by it. */
  id: string;
  name?: string;
  /** Normalized cubing.js notation. `algs[0]` is the primary algorithm, the rest are alternates. */
  algs: string[];
}

export interface CaseGroup {
  id: string;
  name: string;
  /** Overrides the set's stickering for this group's cases. */
  stickering?: Stickering;
  cases: AlgCase[];
}

export interface AlgSet {
  id: AlgSetId;
  name: string;
  method: 'CFOP' | 'Roux';
  /** cubing.js puzzle id. */
  puzzle: '3x3x3';
  stickering: Stickering;
  /** Short markdown. Links are relative to the site base and need `withBase` before rendering. */
  description: string;
  groups: CaseGroup[];
}
