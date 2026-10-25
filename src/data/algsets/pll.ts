import type { AlgSet } from './types';

export const pll: AlgSet = {
  id: 'pll',
  name: 'PLL',
  method: 'CFOP',
  puzzle: '3x3x3',
  stickering: 'PLL',
  description: [
    'PLL is a set of 21 algorithms that permute (position) the last layer in one step. It is the [final step](tutorials/cfop/permute-last-layer/) of the CFOP method, once the first two layers are solved and the last layer is oriented.',
  ].join('\n\n'),
  groups: [
    {
      id: 'corners-only',
      name: 'Corners only',
      cases: [
        { id: 'pll-aa', name: 'A Perm (a)', algs: ["(l' U R') D2 (R U' R') (D2 R2)"] },
        { id: 'pll-ab', name: 'A Perm (b)', algs: ["(r U' L) D2 (L' U L) (D2 L2)"] },
      ],
    },
    {
      id: 'edges-only',
      name: 'Edges only',
      cases: [
        {
          id: 'pll-ua',
          name: 'U Perm (a): opposite colors are on the left',
          algs: ["(M2 U) (M' U2 M) (U M2)"],
        },
        {
          id: 'pll-ub',
          name: 'U Perm (b): opposite colors are on the right',
          algs: ["(M2 U') (M' U2 M) (U' M2)"],
        },
        { id: 'pll-h', name: 'H Perm: opposite colors on all sides', algs: ['(M2 U M2) U2 (M2 U M2)'] },
        {
          id: 'pll-z',
          name: 'Z Perm: no opposite colors',
          algs: [
            "(M2 U)2 (M' U2) (M2 U2) (M' U2)",
            "(M2 u) (M2 D') (M S2 M')",
          ],
        },
      ],
    },
    {
      id: 'no-matching-corners',
      name: 'No matching corners',
      cases: [
        { id: 'pll-v', name: 'V Perm', algs: ["(R' U R' d') (R' F' R2 U') (R' U R' F) (R F)"] },
        { id: 'pll-na', name: 'N Perm (a)', algs: ["(L U' R U2 L' U R')2 U"] },
        { id: 'pll-nb', name: 'N Perm (b)', algs: ["(R' U L' U2 R U' L)2 U'"] },
        { id: 'pll-y', name: 'Y Perm', algs: ["F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')"] },
        {
          id: 'pll-e',
          name: 'E Perm: no blocks and no matching corners',
          algs: ["x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D')"],
        },
      ],
    },
    {
      id: 'switch-opposite-edges',
      name: 'Switch opposite edges',
      cases: [
        {
          id: 'pll-f',
          name: 'F Perm: one solved face and no other blocks',
          algs: ["(R' U' F') (R U R' U') (R' F R2 U') (R' U' R U) (R' U R)"],
        },
        { id: 'pll-t', name: 'T Perm', algs: ["(R U R' U') (R' F R2 U') (R' U') (R U R' F')"] },
      ],
    },
    {
      id: 'l-blocks',
      name: 'L blocks',
      cases: [
        { id: 'pll-ja', name: 'J Perm (a)', algs: ["F2 (L' U' r U2) (l' U R' U' R2)"] },
        { id: 'pll-jb', name: 'J Perm (b)', algs: ["(R U R' F') (R U R' U') (R' F R2 U') (R' U')"] },
      ],
    },
    {
      id: 'small-blocks',
      name: 'Small blocks',
      cases: [
        { id: 'pll-ga', name: 'G Perm (a)', algs: ["(R2 u) (R' U R' U') (R u' R2) y' (R' U R)"] },
        { id: 'pll-gc', name: 'G Perm (c)', algs: ["(L2 u') (L U' L U) (L' u L2) y' (R U' R')"] },
        { id: 'pll-gd', name: 'G Perm (d)', algs: ["(R U R') y' (R2 u' R U') (R' U R' u R2)"] },
        { id: 'pll-gb', name: 'G Perm (b)', algs: ["(L' U' L) y (L2 u L' U) (L U' L u' L2)"] },
      ],
    },
    {
      id: 'awkward',
      name: 'Awkward',
      cases: [
        { id: 'pll-ra', name: 'R Perm (a)', algs: ["(R U R' F') (R U2 R' U2) (R' F R U) (R U2 R' U')"] },
        { id: 'pll-rb', name: 'R Perm (b)', algs: ["(R' U2 R U2) (R' F R U R' U') (R' F' R2 U')"] },
      ],
    },
  ],
};
