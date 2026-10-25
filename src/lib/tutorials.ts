/** The slice of a `tutorials` collection entry these helpers need. */
export interface TutorialEntryLike {
  id: string;
  data: { series: string; order: number; title: string; navTitle?: string };
}

export function seriesPages<T extends TutorialEntryLike>(entries: readonly T[], series: string): T[] {
  return entries.filter((e) => e.data.series === series).sort((a, b) => a.data.order - b.data.order);
}

/** Entry ids look like `<series>/03-first-two-layers`; the URL slug drops the folder and the `NN-` prefix. */
export function entrySlug(entry: Pick<TutorialEntryLike, 'id'>): string {
  const file = entry.id.split('/').pop() ?? entry.id;
  return file.replace(/\.(mdx?)$/, '').replace(/^\d+-/, '');
}

/** Site-relative path (no base) of a tutorial page, with trailing slash. */
export function entryPath(entry: TutorialEntryLike): string {
  return `tutorials/${entry.data.series}/${entrySlug(entry)}/`;
}

export function seriesPath(series: string): string {
  return `tutorials/${series}/`;
}

export function neighbors<T extends TutorialEntryLike>(
  entries: readonly T[],
  current: TutorialEntryLike,
): { prev: T | undefined; next: T | undefined } {
  const pages = seriesPages(entries, current.data.series);
  const i = pages.findIndex((p) => p.id === current.id);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: pages[i - 1], next: pages[i + 1] };
}
