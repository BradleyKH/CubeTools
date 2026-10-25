import type { AlgSet } from './types';

export const pll2: AlgSet = {
  id: 'pll2',
  name: '2-Look PLL',
  method: 'CFOP',
  puzzle: '3x3x3',
  stickering: 'PLL',
  description: [
    '2-look PLL is a set of 6 algorithms that permute (position) the last layer in two steps: one algorithm positions the corners, then a second positions the edges. It is a simplified way to do the [final step](tutorials/cfop/permute-last-layer/) of the CFOP method, once the first two layers are solved and the last layer is oriented.',
  ].join('\n\n'),
  groups: [
    {
      id: 'corner-permutation',
      name: 'Corner permutation',
      stickering: 'CPLL',
      cases: [
        {
          id: 'pll2-a',
          name: 'A Perm (a): put matching corners on the back',
          algs: ["(l' U R') D2 (R U' R') (D2 R2)"],
        },
        {
          id: 'pll2-y',
          name: 'Y Perm: no matching corners',
          algs: ["F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')"],
        },
      ],
    },
    {
      id: 'edge-permutation',
      name: 'Edge permutation',
      stickering: 'EPLL',
      cases: [
        {
          id: 'pll2-ua',
          name: 'U Perm (a): opposite colors are on the left',
          algs: ["(M2 U) (M' U2 M) (U M2)"],
        },
        {
          id: 'pll2-ub',
          name: 'U Perm (b): opposite colors are on the right',
          algs: ["(M2 U') (M' U2 M) (U' M2)"],
        },
        { id: 'pll2-h', name: 'H Perm: opposite colors on all sides', algs: ['(M2 U M2) U2 (M2 U M2)'] },
        {
          id: 'pll2-z',
          name: 'Z Perm: no opposite colors',
          algs: [
            "(M2 U)2 (M' U2) (M2 U2) (M' U2)",
            "(M2 u) (M2 D') (M S2 M')",
          ],
        },
      ],
    },
  ],
};
