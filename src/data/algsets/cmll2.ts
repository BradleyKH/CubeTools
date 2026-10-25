import type { AlgSet } from './types';

export const cmll2: AlgSet = {
  id: 'cmll2',
  name: '2-Look CMLL',
  method: 'Roux',
  puzzle: '3x3x3',
  stickering: 'CMLL',
  description: [
    '2-look CMLL is a set of 9 algorithms that orient and then permute (position) the top corners. It is a simplified way to do the [third step](tutorials/roux/cmll/) of the Roux method. CMLL does not preserve edge orientation.',
    'Yellow represents the last layer color. Use one algorithm to orient the corners, then one to permute them.',
  ].join('\n\n'),
  groups: [
    {
      id: 'corner-orientation',
      name: 'Corner orientation',
      stickering: 'OCLL',
      cases: [
        { id: 'cmll2-sune', name: 'Sune', algs: ["(R U R' U) (R U2 R')"] },
        { id: 'cmll2-antisune', name: 'Anti-Sune', algs: ["(R' U' R U') (R' U2 R)"] },
        { id: 'cmll2-headlights', name: 'Headlights', algs: ["F (R U R' U') F'"] },
        { id: 'cmll2-blinkers', name: 'Blinkers', algs: ["(R U R' U') (R' F R F')"] },
        { id: 'cmll2-bowtie', name: 'Bowtie', algs: ["(R U2 R' U') (R U R' U')2 (R U' R')"] },
        { id: 'cmll2-pi', name: 'Pi', algs: ["F (R U R' U')2 F'"] },
        {
          id: 'cmll2-double-headlights',
          name: 'Double Headlights',
          algs: ["(R U2 R' U') (R U R' U') (R U' R')"],
        },
      ],
    },
    {
      id: 'corner-permutation',
      name: 'Corner permutation',
      cases: [
        {
          id: 'cmll2-matching-corners',
          name: 'Matching corners - put on left',
          algs: ["(R U R' F') (R U R' U') (R' F R2 U') R'"],
        },
        {
          id: 'cmll2-no-matching-corners',
          name: 'No matching corners - face any side',
          algs: ["F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')"],
        },
      ],
    },
  ],
};
