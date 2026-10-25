import { describe, expect, it } from 'vitest';
import { entryPath, entrySlug, neighbors, seriesPages, type TutorialEntryLike } from './tutorials';

const entry = (id: string, series: string, order: number): TutorialEntryLike => ({
  id,
  data: { series, order, title: id },
});

const a = entry('demo/01-intro.mdx', 'demo', 1);
const b = entry('demo/03-last.mdx', 'demo', 3);
const c = entry('demo/02-middle.mdx', 'demo', 2);
const other = entry('other/01-x.mdx', 'other', 1);
const all = [b, other, a, c];

describe('seriesPages', () => {
  it('filters to the series and sorts by order', () => {
    expect(seriesPages(all, 'demo')).toEqual([a, c, b]);
  });

  it('returns an empty list for an unknown series', () => {
    expect(seriesPages(all, 'nope')).toEqual([]);
  });
});

describe('entrySlug and entryPath', () => {
  it('strips the folder, extension, and NN- prefix', () => {
    expect(entrySlug(a)).toBe('intro');
    expect(entrySlug({ id: 'demo/10-first-two-layers' })).toBe('first-two-layers');
  });

  it('keeps names without a numeric prefix', () => {
    expect(entrySlug({ id: 'demo/notes.md' })).toBe('notes');
  });

  it('builds the page path', () => {
    expect(entryPath(c)).toBe('tutorials/demo/middle/');
  });
});

describe('neighbors', () => {
  it('returns both neighbors in the middle', () => {
    expect(neighbors(all, c)).toEqual({ prev: a, next: b });
  });

  it('has no prev on the first page and no next on the last', () => {
    expect(neighbors(all, a)).toEqual({ prev: undefined, next: c });
    expect(neighbors(all, b)).toEqual({ prev: c, next: undefined });
  });

  it('never crosses series', () => {
    expect(neighbors(all, other)).toEqual({ prev: undefined, next: undefined });
  });
});
