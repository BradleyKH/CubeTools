import type { AlgSet } from './types';

export const oll: AlgSet = {
  id: 'oll',
  name: 'OLL',
  method: 'CFOP',
  puzzle: '3x3x3',
  stickering: 'OLL',
  description: [
    'OLL is a set of 57 algorithms that orient the whole last layer in one step. It is the [third step](tutorials/cfop/orient-last-layer/) of the CFOP method, once the first two layers are solved.',
    'Yellow represents the last layer color.',
  ].join('\n\n'),
  groups: [
    {
      id: 'correct-corners',
      name: 'Correct corners',
      cases: [
        { id: 'oll-28', name: 'OLL 28', algs: ["(r U R' U') M (U R U' R')", "y (M U' M') U2 (M U' M')"] },
        { id: 'oll-57', name: 'OLL 57', algs: ["(R U R' U') M' (U R U' r')"] },
        {
          id: 'oll-20',
          name: 'OLL 20',
          algs: [
            "(r U R' U') M2 (U R U' R') U' M'",
            "(M U) (R U R' U') (M2 U) (R U' r')",
          ],
        },
      ],
    },
    {
      id: 'correct-edges',
      name: 'Correct edges',
      cases: [
        { id: 'oll-27', name: 'OLL 27', algs: ["(R U R' U) (R U2 R')"] },
        {
          id: 'oll-26',
          name: 'OLL 26',
          algs: [
            "(R' U' R U') (R' U2 R)",
            "y2 (L' U' L U') (L' U2 L)",
            "y (R U2 R' U') (R U' R')",
          ],
        },
        { id: 'oll-24', name: 'OLL 24', algs: ["(r U R' U') (r' F R F')"] },
        { id: 'oll-23', name: 'OLL 23', algs: ["(R2 D') (R U2 R') D (R U2 R)"] },
        { id: 'oll-25', name: 'OLL 25', algs: ["(F R' F' r) (U R U' r')", "y F' (r U R' U') (r' F R)"] },
        {
          id: 'oll-22',
          name: 'OLL 22',
          algs: [
            "(R U2) (R2 U' R2 U' R2) (U2 R)",
            "f (R U R' U') f' F (R U R' U') F'",
          ],
        },
        { id: 'oll-21', name: 'OLL 21', algs: ["(R U2 R' U') (R U R' U') (R U' R')"] },
      ],
    },
    {
      id: 'no-correct-edges',
      name: 'No correct edges',
      cases: [
        { id: 'oll-2', name: 'OLL 2', algs: ["(r U r') U2 (r U2 R' U2) (R U' r')"] },
        { id: 'oll-1', name: 'OLL 1', algs: ["(R U2) (R2 F R F') U2 (R' F R F')"] },
        {
          id: 'oll-3',
          name: 'OLL 3',
          algs: [
            "r' (R2 U R' U) (r U2 r') U M'",
            "y' f (R U R' U') f' U' F (R U R' U') F'",
          ],
        },
        {
          id: 'oll-4',
          name: 'OLL 4',
          algs: [
            "M U' (r U2 r' U' R U' R') M'",
            "y' f (R U R' U') f' U F (R U R' U') F'",
          ],
        },
        { id: 'oll-19', name: 'OLL 19', algs: ["(M U) (R U R' U') M' (R' F R F')"] },
        { id: 'oll-18', name: 'OLL 18', algs: ["(r U R' U R U2 r') (r' U' R U' R' U2 r)"] },
        {
          id: 'oll-17',
          name: 'OLL 17',
          algs: [
            "(R U R' U) (R' F R F') U2 (R' F R F')",
            "y2 (F R' F' R2 r') (U R U' R') U' M'",
          ],
        },
      ],
    },
    {
      id: 't-shapes',
      name: 'T shapes',
      cases: [
        { id: 'oll-33', name: 'OLL 33', algs: ["(R U R' U') (R' F R F')"] },
        { id: 'oll-45', name: 'OLL 45', algs: ["F (R U R' U') F'"] },
      ],
    },
    {
      id: 'p-shapes',
      name: 'P shapes',
      cases: [
        { id: 'oll-44', name: 'OLL 44', algs: ["F (U R U' R') F'", "y2 f (R U R' U') f'"] },
        { id: 'oll-43', name: 'OLL 43', algs: ["F' (U' L' U L) F", "y2 f' (L' U' L U) f"] },
        { id: 'oll-32', name: 'OLL 32', algs: ["L U F' (U' L' U L) F L'"] },
        { id: 'oll-31', name: 'OLL 31', algs: ["R' U' F (U R U' R') F' R"] },
      ],
    },
    {
      id: 'c-shapes',
      name: 'C shapes',
      cases: [
        { id: 'oll-34', name: 'OLL 34', algs: ["(R U R2 U') R' F (R U R U') F'"] },
        { id: 'oll-46', name: 'OLL 46', algs: ["R' U' (R' F R F') U R"] },
      ],
    },
    {
      id: 'w-shapes',
      name: 'W shapes',
      cases: [
        { id: 'oll-38', name: 'OLL 38', algs: ["(R U R' U) (R U' R' U') (R' F R F')"] },
        {
          id: 'oll-36',
          name: 'OLL 36',
          algs: [
            "(L' U' L U') (L' U L U) (L F' L' F)",
            "(R U R' F') (R U R' U') (R' F R U') (R' F R F')",
          ],
        },
      ],
    },
    {
      id: 'i-shapes',
      name: 'I shapes',
      cases: [
        { id: 'oll-51', name: 'OLL 51', algs: ["F (U R U' R')2 F'", "y2 f (R U R' U')2 f'"] },
        { id: 'oll-52', name: 'OLL 52', algs: ["(R U R' U) R d' (R U' R' F')"] },
        { id: 'oll-56', name: 'OLL 56', algs: ["(r U r') (U R U' R')2 (r U' r')"] },
        {
          id: 'oll-55',
          name: 'OLL 55',
          algs: [
            "(r U2) (R2 F R F') U2 (r' F R F')",
            "y (R' F R U) (R U' R2 F') (R2 U' R' U R U R')",
          ],
        },
      ],
    },
    {
      id: 'squares',
      name: 'Squares',
      cases: [
        { id: 'oll-5', name: 'OLL 5', algs: ["(l' U2 L U) (L' U l)", "y2 (r' U2) (R U R' U) r"] },
        { id: 'oll-6', name: 'OLL 6', algs: ["(r U2 R' U') (R U' r')"] },
      ],
    },
    {
      id: 'fish',
      name: 'Fish',
      cases: [
        { id: 'oll-35', name: 'OLL 35', algs: ["(R U2) (R2 F R F') (R U2 R')"] },
        { id: 'oll-37', name: 'OLL 37', algs: ["(F R' F' R) (U R U' R')", "F (R U' R' U') (R U R' F')"] },
        { id: 'oll-10', name: 'OLL 10', algs: ["(R U R' U) (R' F R F') (R U2 R')"] },
        { id: 'oll-9', name: 'OLL 9', algs: ["(R U R' U') R' F (R2 U R' U') F'"] },
      ],
    },
    {
      id: 'big-lightning',
      name: 'Big lightning',
      cases: [
        { id: 'oll-39', name: 'OLL 39', algs: ["L F' (L' U' L U) (F U' L')"] },
        { id: 'oll-40', name: 'OLL 40', algs: ["R' F (R U R' U') (F' U R)"] },
      ],
    },
    {
      id: 'small-lightning',
      name: 'Small lightning',
      cases: [
        { id: 'oll-7', name: 'OLL 7', algs: ["(r U R' U) (R U2 r')"] },
        { id: 'oll-8', name: 'OLL 8', algs: ["(l' U' L U') (L' U2 l)", "y2 (r' U' R U') (R' U2 r)"] },
        { id: 'oll-12', name: 'OLL 12', algs: ["M' (R' U' R U' R' U2 R) U' M"] },
        {
          id: 'oll-11',
          name: 'OLL 11',
          algs: [
            "M (R U R' U R U2 R') U M'",
            "y2 (r U R' U) (R' F R F') (R U2 r')",
          ],
        },
      ],
    },
    {
      id: 'big-l-shapes',
      name: 'Big L shapes',
      cases: [
        { id: 'oll-14', name: 'OLL 14', algs: ["(R' F) (R U R' F') R (F U' F')"] },
        {
          id: 'oll-13',
          name: 'OLL 13',
          algs: [
            "F (U R U' R2) F' R (U R U' R')",
            "(r U' r' U' r U r') (F' U F)",
          ],
        },
        { id: 'oll-16', name: 'OLL 16', algs: ["(r U r') (R U R' U') (r U' r')"] },
        { id: 'oll-15', name: 'OLL 15', algs: ["(l' U' l) (L' U' L U) (l' U l)"] },
      ],
    },
    {
      id: 'small-l-shapes',
      name: 'Small L shapes',
      cases: [
        { id: 'oll-48', name: 'OLL 48', algs: ["F (R U R' U')2 F'"] },
        { id: 'oll-47', name: 'OLL 47', algs: ["R' U' (R' F R F')2 U R", "F' (L' U' L U)2 F"] },
        { id: 'oll-54', name: 'OLL 54', algs: ["(r U2 R' U') (R U R' U') (R U' r')"] },
        { id: 'oll-53', name: 'OLL 53', algs: ["(l' U2 L U) (L' U' L U) (L' U l)"] },
        { id: 'oll-50', name: 'OLL 50', algs: ["r' U (r2 U' r2 U' r2) U r'"] },
        { id: 'oll-49', name: 'OLL 49', algs: ["r U' (r2 U r2 U r2) U' r"] },
      ],
    },
    {
      id: 'awkward-shapes',
      name: 'Awkward shapes',
      cases: [
        { id: 'oll-41', name: 'OLL 41', algs: ["(R U R' U R U2 R') F (R U R' U') F'"] },
        { id: 'oll-42', name: 'OLL 42', algs: ["(R' U' R U' R' U2 R) F (R U R' U') F'"] },
        { id: 'oll-30', name: 'OLL 30', algs: ["F (R' F R2 U') (R' U') (R U R') F2"] },
        {
          id: 'oll-29',
          name: 'OLL 29',
          algs: [
            "M U (R U R' U') (R' F R F') M'",
            "y (R U R' U') (R U' R') (F' U' F) (R U R')",
          ],
        },
      ],
    },
  ],
};
