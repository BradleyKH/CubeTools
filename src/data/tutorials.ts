export type Puzzle = '3x3x3' | '2x2x2';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Series {
  slug: string;
  title: string;
  puzzle: Puzzle;
  level: Level;
  summary: string;
}

/** Tutorial series in display order. Notation and Triggers are standalone pages, not series. */
export const series: readonly Series[] = [
  {
    slug: '3x3-beginner',
    title: '3x3 Beginner Method',
    puzzle: '3x3x3',
    level: 'Beginner',
    summary: 'Solve the 3x3 layer by layer with a handful of easy algorithms.',
  },
  {
    slug: '2x2-beginner',
    title: '2x2 Beginner Method',
    puzzle: '2x2x2',
    level: 'Beginner',
    summary: 'Solve the 2x2 one layer at a time using moves from the 3x3 beginner method.',
  },
  {
    slug: 'cfop',
    title: 'CFOP',
    puzzle: '3x3x3',
    level: 'Intermediate',
    summary: 'Cross, F2L, OLL, and PLL: the most popular speedsolving method.',
  },
  {
    slug: 'ortega',
    title: 'Ortega',
    puzzle: '2x2x2',
    level: 'Intermediate',
    summary: 'Solve the 2x2 in three short steps: first face, OLL, and PBL.',
  },
  {
    slug: 'roux',
    title: 'Roux',
    puzzle: '3x3x3',
    level: 'Advanced',
    summary: 'Block building, CMLL, and the last six edges for a low move count.',
  },
];

const bySlug = new Map(series.map((s) => [s.slug, s]));

export function seriesBySlug(slug: string): Series | undefined {
  return bySlug.get(slug);
}
