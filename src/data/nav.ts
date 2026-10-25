export interface NavLink {
  label: string;
  /** Site-relative path; pass through `withBase` before rendering. */
  href: string;
}

export interface NavGroup {
  heading?: string;
  links: readonly NavLink[];
}

export type NavItem =
  | { label: string; href: string; groups?: undefined }
  | { label: string; href?: undefined; groups: readonly NavGroup[] };

const flashcardSets = [
  ['F2L', 'f2l'],
  ['2-Look OLL', 'oll2'],
  ['OLL', 'oll'],
  ['2-Look PLL', 'pll2'],
  ['PLL', 'pll'],
  ['2-Look CMLL', 'cmll2'],
  ['CMLL', 'cmll'],
] as const;

export const nav: readonly NavItem[] = [
  {
    label: 'Tutorials',
    groups: [
      {
        heading: 'Beginner',
        links: [
          { label: 'Notation', href: 'notation/' },
          { label: '3x3 Beginner', href: 'tutorials/3x3-beginner/' },
          { label: '2x2 Beginner', href: 'tutorials/2x2-beginner/' },
        ],
      },
      {
        heading: 'Intermediate',
        links: [
          { label: 'Common Triggers', href: 'triggers/' },
          { label: '3x3 CFOP', href: 'tutorials/cfop/' },
          { label: '2x2 Ortega', href: 'tutorials/ortega/' },
        ],
      },
      {
        heading: 'Advanced',
        links: [{ label: '3x3 Roux', href: 'tutorials/roux/' }],
      },
    ],
  },
  {
    label: 'Flashcards',
    groups: [
      {
        links: flashcardSets.map(([label, id]) => ({
          label,
          href: `flashcards/?set=${id}`,
        })),
      },
    ],
  },
  {
    label: 'Tools',
    groups: [
      {
        links: [
          { label: 'Timer', href: 'timer/' },
          { label: 'Scrambler', href: 'scrambler/' },
        ],
      },
    ],
  },
  { label: 'Resources', href: 'resources/' },
];
