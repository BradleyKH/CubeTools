import type { AlgSet } from './types';

export const oll2: AlgSet = {
  id: 'oll2',
  name: '2-Look OLL',
  method: 'CFOP',
  puzzle: '3x3x3',
  stickering: 'OLL',
  description: [
    '2-look OLL is a set of 10 algorithms that orient the last layer in two steps: one algorithm orients the edges, then a second orients the corners. It is a simplified way to do the [third step](tutorials/cfop/orient-last-layer/) of the CFOP method, once the first two layers are solved.',
    'Yellow represents the last layer color. Orienting the last layer prepares the cube for PLL.',
  ].join('\n\n'),
  groups: [
    {
      id: 'edge-orientation',
      name: 'Edge orientation',
      cases: [
        { id: 'oll2-opposite-edges', name: 'Two opposite edges', algs: ["F (R U R' U') F'"] },
        { id: 'oll2-adjacent-edges', name: 'Two adjacent edges', algs: ["f (R U R' U') f'"] },
        {
          id: 'oll2-no-edges',
          name: 'No correct edges',
          algs: [
            "(M U) (R U R' U') (M2 U) (R U' r')",
            "F (R U R' U') F' f (R U R' U') f'",
          ],
        },
      ],
    },
    {
      id: 'corner-orientation',
      name: 'Corner orientation',
      cases: [
        { id: 'oll2-sune', name: 'Sune', algs: ["(R U R' U) (R U2 R')"] },
        { id: 'oll2-antisune', name: 'Anti-Sune', algs: ["(L' U' L U') (L' U2 L)"] },
        { id: 'oll2-bowtie', name: 'Bowtie', algs: ["(F R' F' r) (U R U' r')", "y F' (r U R' U') (r' F R)"] },
        { id: 'oll2-blinkers', name: 'Blinkers', algs: ["(r U R' U') (r' F R F')"] },
        { id: 'oll2-headlights', name: 'Headlights', algs: ["(R2 D') (R U2 R' D) (R U2 R)"] },
        {
          id: 'oll2-double-headlights',
          name: 'Double Headlights',
          algs: [
            "(R U2 R' U') (R U R' U') (R U' R')",
            "F (R U R' U')3 F'",
          ],
        },
        {
          id: 'oll2-pi',
          name: 'Pi',
          algs: [
            "f (R U R' U') f' F (R U R' U') F'",
            "(R U2) (R2 U')2 (R2 U2 R)",
          ],
        },
      ],
    },
  ],
};
