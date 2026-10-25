import type { AlgSet } from './types';

export const f2l: AlgSet = {
  id: 'f2l',
  name: 'F2L',
  method: 'CFOP',
  puzzle: '3x3x3',
  stickering: 'F2L',
  description: [
    'F2L (First Two Layers) is the [second step](tutorials/cfop/first-two-layers/) of the CFOP method. After the cross is solved, F2L inserts the four corner-edge pairs around it to complete the first two layers.',
    'These 41 cases solve the front-right slot, with the corner and edge either in the top layer or already in the slot. F2L is complete when all four pairs are inserted, which prepares the cube for OLL.',
  ].join('\n\n'),
  groups: [
    {
      id: 'corner-and-edge-on-top-separated',
      name: 'Corner and edge on top separated',
      cases: [
        { id: 'f2l-1', algs: ["y (L' U' L)", "y' (R' U' R)"] },
        { id: 'f2l-2', algs: ["(R U R')"] },
        { id: 'f2l-3', algs: ["U' (R U' R') d (R' U' R)", "y U (L' U' L) U' (L' U' L)"] },
        { id: 'f2l-4', algs: ["U' (R U R') U (R U R')", "U2 (R U' R') U' (R U R')"] },
        { id: 'f2l-5', algs: ["U' (R U R') U2 (R U' R')"] },
        { id: 'f2l-6', algs: ["d (R' U' R) U2 (R' U R)"] },
        { id: 'f2l-7', algs: ["U' (R U2 R') U2 (R U' R')"] },
        { id: 'f2l-8', algs: ["d (R' U2 R) U2 (R' U R)"] },
        { id: 'f2l-9', algs: ["U (R U2 R') U (R U' R')"] },
        { id: 'f2l-10', algs: ["y U' (L' U2 L) U' (L' U L)"] },
        { id: 'f2l-11', algs: ["U2 (R U R') U (R U' R')"] },
        { id: 'f2l-12', algs: ["y U2 (L' U' L) U' (L' U L)"] },
      ],
    },
    {
      id: 'corner-and-edge-on-top-together',
      name: 'Corner and edge on top together',
      cases: [
        { id: 'f2l-13', algs: ["U (R U' R')", "(R' F R F')"] },
        { id: 'f2l-14', algs: ["d' (L' U L)"] },
        { id: 'f2l-15', algs: ["U' (R U2 R') d (R' U' R)"] },
        { id: 'f2l-16', algs: ["y U (L' U2 L) d' (L U L')", "R' U2 (R2 U)2 R"] },
        { id: 'f2l-17', algs: ["d (R' U R U') (R' U' R)"] },
        { id: 'f2l-18', algs: ["U' (R U' R') U (R U R')"] },
        {
          id: 'f2l-19',
          algs: [
            "y' (R' U R) U2 y (R U R')",
            "M U (L F' L') U' M'",
            "(R U R') U2 (R U' R' U) (R U' R')",
          ],
        },
        { id: 'f2l-20', algs: ["(R U' R') U2 y' (R' U' R)", "y M U' (R' F R) U M'"] },
        { id: 'f2l-21', algs: ["(R U2 R' U') (R U R')"] },
        { id: 'f2l-22', algs: ["y (L' U2 L) U (L' U' L)"] },
        { id: 'f2l-23', algs: ["(R U R' U2) (R U R' U') (R U R')", "U (R U' R' U') (R U' R' U) (R U' R')"] },
        { id: 'f2l-24', algs: ["d' (L' U L) U (L' U L U' L' U L)", "y' U' (R' U R U) (R' U R U') (R' U R)"] },
      ],
    },
    {
      id: 'corner-in-slot-edge-on-top',
      name: 'Corner in slot, edge on top',
      cases: [
        { id: 'f2l-25', algs: ["d' (L' U L) d (R U' R')", "U' (R' F R F') (R U R')"] },
        { id: 'f2l-26', algs: ["U (R U' R') d' (L' U L)"] },
        { id: 'f2l-27', algs: ["(R U' R' U) (R U' R')"] },
        { id: 'f2l-28', algs: ["y (L' U L) U' (L' U L)", "y' (R' U R) U' (R' U R)"] },
        { id: 'f2l-29', algs: ["y (L' U' L U) (L' U' L)", "(R' F R F')2"] },
        { id: 'f2l-30', algs: ["(R U R' U') (R U R')", "y (L F' L' F)2"] },
      ],
    },
    {
      id: 'edge-in-slot-corner-on-top',
      name: 'Edge in slot, corner on top',
      cases: [
        { id: 'f2l-31', algs: ["U' (R' F R F') (R U' R')", "(R U' R') d (R' U R)"] },
        { id: 'f2l-32', algs: ["(R U R' U')3"] },
        { id: 'f2l-33', algs: ["(U' R U' R') U2 (R U' R')"] },
        { id: 'f2l-34', algs: ["U (R U R') U2 (R U R')", "y U (L' U L) U2 (L' U L)"] },
        { id: 'f2l-35', algs: ["(U' R U R') d (R' U' R)", "U2 (R U R') (F R' F' R)"] },
        { id: 'f2l-36', algs: ["d (R' U' R) d' (R U R')"] },
      ],
    },
    {
      id: 'corner-and-edge-in-slot',
      name: 'Corner and edge in slot',
      cases: [
        { id: 'f2l-37', algs: ["(R U R' U') (R U2 R' U') (R U R')"] },
        { id: 'f2l-38', algs: ["(R U' R') U (R U2 R') U (R U' R')"] },
        { id: 'f2l-39', algs: ["(r U' r') U2 (r U r') (R U R')", "(R U' R') F (R U R' U') F' (R U' R')"] },
        { id: 'f2l-40', algs: ["(R U' R') (r U' r') U2 (r U r')", "(R U R' U') (R U' R') U2 y' (R' U' R)"] },
        { id: 'f2l-41', algs: ["(R U' R') d (R' U2 R U2) (R' U R)", "(R' F R F') (R' U2) (R2 U)2 R"] },
      ],
    },
  ],
};
