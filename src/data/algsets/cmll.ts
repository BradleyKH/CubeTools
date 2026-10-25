import type { AlgSet } from './types';

export const cmll: AlgSet = {
  id: 'cmll',
  name: 'CMLL',
  method: 'Roux',
  puzzle: '3x3x3',
  stickering: 'CMLL',
  description: [
    'CMLL is a set of 42 algorithms that orient and position the top corners at the same time. It is the [third step](tutorials/roux/cmll/) of the Roux method. CMLL does not preserve edge orientation.',
    'Recognize the case by the orientation of the U stickers first, then:\n\n- **Oriented:** matching corners\n- **Sune:** opposite colors on U and RFU\n- **Anti-Sune:** opposite colors on U and FRU\n- **Headlights** and **Blinkers:** U stickers and FUL/FUR\n- **Bowtie:** UFL, and compare FUR to UBR\n- **Pi** and **Double Headlights:** U stickers',
  ].join('\n\n'),
  groups: [
    {
      id: 'oriented',
      name: 'Oriented',
      cases: [
        {
          id: 'cmll-oriented-1',
          name: 'Oriented, matching corners',
          algs: ["(R U R' F') (R U R' U') (R' F R2 U' R')"],
        },
        {
          id: 'cmll-oriented-2',
          name: 'Oriented, no matching corners',
          algs: ["F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')"],
        },
      ],
    },
    {
      id: 'sune',
      name: 'Sune',
      cases: [
        {
          id: 'cmll-sune-1',
          name: 'Sune, opposites diagonal, random sticker',
          algs: ["(R U R' U) (R U2 R')"],
        },
        {
          id: 'cmll-sune-2',
          name: 'Sune, opposites diagonal, back-right match',
          algs: ["U2 (R U R' U) (R' F R F') (R U2 R')"],
        },
        {
          id: 'cmll-sune-3',
          name: 'Sune, opposites column, random sticker',
          algs: ["(R' F2) (R U2) (r U' r') F"],
        },
        {
          id: 'cmll-sune-4',
          name: 'Sune, opposites column, back-left match',
          algs: ["U' (R U R' U) (R U' R D) (R' U' R D' R2)"],
        },
        {
          id: 'cmll-sune-5',
          name: 'Sune, opposites row, back-right match',
          algs: ["x (U R' U' L) (U2 R U2 R')"],
        },
        { id: 'cmll-sune-6', name: 'Sune, opposites row, back-left match', algs: ["(R U' L' U R' U' L)"] },
      ],
    },
    {
      id: 'anti-sune',
      name: 'Anti-Sune',
      cases: [
        {
          id: 'cmll-antisune-1',
          name: 'Anti-Sune, opposites diagonal, back-right match',
          algs: ["(R' U' R U') (R' U2 R)"],
        },
        {
          id: 'cmll-antisune-2',
          name: 'Anti-Sune, opposites diagonal, front-left match',
          algs: ["(R' U' R U') (R' U) (R' F R F') (U R)"],
        },
        {
          id: 'cmll-antisune-3',
          name: 'Anti-Sune, opposites column, random sticker',
          algs: ["U2 (R2 D R' U R) D' (R' U R' U') (R U' R')"],
        },
        {
          id: 'cmll-antisune-4',
          name: 'Anti-Sune, opposites column, front-left match',
          algs: ["U2 (R U2 R' U2) (R' F R F')"],
        },
        {
          id: 'cmll-antisune-5',
          name: 'Anti-Sune, opposites row, random sticker',
          algs: ["U2 F' (r U r') U2 (r' F2 r)"],
        },
        {
          id: 'cmll-antisune-6',
          name: 'Anti-Sune, opposites row, back-right match',
          algs: ["U2 (R' F R F') (r U r')"],
        },
      ],
    },
    {
      id: 'headlights',
      name: 'Headlights',
      cases: [
        {
          id: 'cmll-headlights-1',
          name: 'Headlights, front row',
          algs: ["(R' U' R U' R' U2) (R2 U R' U) (R U2 R')"],
        },
        { id: 'cmll-headlights-2', name: 'Headlights, top/back row', algs: ["U' F (R U R' U') F'"] },
        {
          id: 'cmll-headlights-3',
          name: 'Headlights, 2 rows',
          algs: ["(R' F) (R U' R' U') (R U R' F') (R U R' U') (R' F R F') R"],
        },
        { id: 'cmll-headlights-4', name: 'Headlights, slash', algs: ["(r U' r' U')2 (F' U2 F)"] },
        { id: 'cmll-headlights-5', name: 'Headlights, backslash', algs: ["(R' F R U)2 (F U2 F')"] },
        {
          id: 'cmll-headlights-6',
          name: 'Headlights, X',
          algs: ["(R U R' U') (R' F2 R2 U') (R' U') (R U R' F2)"],
        },
      ],
    },
    {
      id: 'blinkers',
      name: 'Blinkers',
      cases: [
        { id: 'cmll-blinkers-1', name: 'Blinkers, left column', algs: ["U' (R U R' U') (R' F R F')"] },
        { id: 'cmll-blinkers-2', name: 'Blinkers, right column', algs: ["U (L' U' L U) (L F' L' F)"] },
        { id: 'cmll-blinkers-3', name: 'Blinkers, front row', algs: ["(R' U r U2) (R2 F R F' r)"] },
        {
          id: 'cmll-blinkers-4',
          name: 'Blinkers, top/back row',
          algs: ["U2 F (R U R' U') (R U' R' U') (R U R' F')"],
        },
        { id: 'cmll-blinkers-5', name: 'Blinkers, 2 rows', algs: ["F (R' F R2 U') (R' U' R U R' F2)"] },
        {
          id: 'cmll-blinkers-6',
          name: 'Blinkers, 2 columns',
          algs: ["U2 (r2 D') (r U r' D) (r2 U' r' U' r)"],
        },
      ],
    },
    {
      id: 'bowtie',
      name: 'Bowtie',
      cases: [
        {
          id: 'cmll-bowtie-1',
          name: 'Bowtie, top random, stickers opposite',
          algs: ["U2 (R U2 R' U') (R U R' U')2 (R U' R')"],
        },
        {
          id: 'cmll-bowtie-2',
          name: 'Bowtie, top random, stickers same',
          algs: ["U2 (R' U') (R U R' F') (R U R' U') (R' F R2)"],
        },
        {
          id: 'cmll-bowtie-3',
          name: 'Bowtie, top opposite, stickers same',
          algs: ["(F R' F' R) (U R U' R')"],
        },
        {
          id: 'cmll-bowtie-4',
          name: 'Bowtie, top opposite, stickers random',
          algs: ["F (R U' R' U') (R U R' F')"],
        },
        {
          id: 'cmll-bowtie-5',
          name: 'Bowtie, top same, stickers random',
          algs: ["U2 (R U R' U) (R' F R F') U2 (R' F R F')"],
        },
        {
          id: 'cmll-bowtie-6',
          name: 'Bowtie, top same, stickers opposite',
          algs: ["(R U R' U') (R' F R2 U') (R' U) (R U R' F')"],
        },
      ],
    },
    {
      id: 'pi',
      name: 'Pi',
      cases: [
        { id: 'cmll-pi-1', name: 'Pi, right column', algs: ["F (R U R' U')2 F'"] },
        { id: 'cmll-pi-2', name: 'Pi, left column', algs: ["U' (R' U') (R' F R F') (R U' R' U2 R)"] },
        { id: 'cmll-pi-3', name: 'Pi, 2 columns', algs: ["U2 (R' U R U' R2 F) (R2 U R' U') (F' R)"] },
        { id: 'cmll-pi-4', name: 'Pi, slash', algs: ["(R U2 R' U') (R U R' U2) (R' F R F')"] },
        { id: 'cmll-pi-5', name: 'Pi, backslash', algs: ["U (F R' F' R) U2 (R U' R' U) (R U2 R')"] },
        { id: 'cmll-pi-6', name: 'Pi, X', algs: ["U' (R' F R U) (F U') (R U R' U') F'"] },
      ],
    },
    {
      id: 'double-headlights',
      name: 'Double Headlights',
      cases: [
        {
          id: 'cmll-double-headlights-1',
          name: 'Double headlights, 2 columns',
          algs: ["(R U2 R' U') (R U R' U') (R U' R')"],
        },
        { id: 'cmll-double-headlights-2', name: 'Double headlights, 2 rows', algs: ["F (R U R' U')3 F'"] },
        {
          id: 'cmll-double-headlights-3',
          name: 'Double headlights, 1 column',
          algs: ["(U) (R U2) (R2 F R F') U2 (R' F R F')"],
        },
        {
          id: 'cmll-double-headlights-4',
          name: 'Double headlights, 1 row',
          algs: ["(r U' r' F) U2 (r2 F r U' r)"],
        },
      ],
    },
  ],
};
