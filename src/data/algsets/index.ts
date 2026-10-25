import { cmll } from './cmll';
import { cmll2 } from './cmll2';
import { f2l } from './f2l';
import { oll } from './oll';
import { oll2 } from './oll2';
import { pll } from './pll';
import { pll2 } from './pll2';
import type { AlgSet, AlgSetId } from './types';

export type { AlgCase, AlgSet, AlgSetId, CaseGroup } from './types';

export const algSets: readonly AlgSet[] = [f2l, oll2, oll, pll2, pll, cmll2, cmll];

/** Set ids by position in the legacy flashcards set list, for migrating old saved selections. */
export const legacyIndexToId: readonly AlgSetId[] = ['f2l', 'oll2', 'oll', 'pll2', 'pll', 'cmll2', 'cmll'];

export function getAlgSet(id: string): AlgSet | undefined {
  return algSets.find((set) => set.id === id);
}
