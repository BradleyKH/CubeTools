/** A 2x2 last-layer case: `algs[0]` is the primary, the rest are alternates, all in cubing.js notation. */
export interface Case2x2 {
  id: string;
  name: string;
  algs: string[];
}

export interface CaseGroup2x2 {
  id: string;
  name: string;
  cases: Case2x2[];
}

/** CLL: the first layer is solved and one algorithm solves the last four corners. */
export const cllGroups: CaseGroup2x2[] = [
  {
    id: 'cll-sune',
    name: 'Sune',
    cases: [
      { id: 'cll-sune-1', name: 'Sune 1', algs: ["L' U2 L U2 L F' L' F", "y2 R' U2 R U2 R B' R' B", "R' F2 R U2 R U' R' F"] },
      { id: 'cll-sune-2', name: 'Sune 2', algs: ["R U R' U' R' F R F' R U R' U R U2 R'", "R U2 R' F R U2 R' U R U' R' F", "y2 R U' R U' R' U R' U' y R U' R'"] },
      { id: 'cll-sune-3', name: 'Sune 3', algs: ["R U' R' F R' F' R", "R U' R' F L' U' L", "L F' L' F L' U' L"] },
      { id: 'cll-sune-4', name: 'Sune 4', algs: ["F R' F' R U2 R U2 R'", "y R U' R' F R' F2 R U R U' R' F", "y' x' R U' R' U R' F2 R F R U' R' U x"] },
      { id: 'cll-sune-5', name: 'Sune 5', algs: ["y2 R U R' U R' F R F' R U2 R'", "U2 R U R' U R' F R F' R U2 R'", "R U R' U' R' F R F' R U' R' F R' F' R"] },
      { id: 'cll-sune-6', name: 'Sune 6', algs: ["R U R' U R U2 R'", "R U R2 U' R2 U R", "y' R' U2 R U R' U R"] },
    ],
  },
  {
    id: 'cll-anti-sune',
    name: 'Anti-Sune',
    cases: [
      { id: 'cll-anti-sune-1', name: 'Anti-Sune 1', algs: ["y R U2 R' U' R U' R'", "R' U' R U' R' U2 R", "y2 L' U' L U' L' U2 L"] },
      { id: 'cll-anti-sune-2', name: 'Anti-Sune 2', algs: ["R U2 R' F R' F' R U' R U' R'", "y2 R' U R U' R2 F R F' R U R' U' R", "L' U' L U' L F' L' F L' U2 L"] },
      { id: 'cll-anti-sune-3', name: 'Anti-Sune 3', algs: ["y2 F' L F L' U2 L' U2 L", "y2 F' R U R' U2 R' F2 R", "y R' F R F' R U2 R' U' R' F R F'"] },
      { id: 'cll-anti-sune-4', name: 'Anti-Sune 4', algs: ["y2 R' F R F' R U R'", "U2 L' U R U' L U R'", "y2 L' U L F' R U R'"] },
      { id: 'cll-anti-sune-5', name: 'Anti-Sune 5', algs: ["y2 R U2 R' U2 R' F R F'", "y' z F R2 F' R' U' R' U z' y' R U' R'"] },
      { id: 'cll-anti-sune-6', name: 'Anti-Sune 6', algs: ["y' R U2 R' U' R U' R' F R' F' R U R U' R' U'", "R2 F' U' R2 F' R2 U F R2", "R2 F R U2 R U' R' U2 F' R"] },
    ],
  },
  {
    id: 'cll-pi',
    name: 'Pi',
    cases: [
      { id: 'cll-pi-1', name: 'Pi 1', algs: ["y F R' F' R U2 R U' R' U R U2 R'", "R' F2 R F' U2 R U' R' U' F", "U F U R U' R' U R U' R2 F' R U R U' R'"] },
      { id: 'cll-pi-2', name: 'Pi 2', algs: ["R U2 R' U' R U R' U2 R' F R F'", "y F' R U R' U2 R' F R U' R' F2 R", "R U R' U' R' F R2 U R' U' R U R' U' F'"] },
      { id: 'cll-pi-3', name: 'Pi 3', algs: ["y F R2 U' R2 U R2 U R2 F'", "y' R U' R U' R' U R' F R2 F'", "y2 F R' F' R U2 F R' F' R2 U2 R'"] },
      { id: 'cll-pi-4', name: 'Pi 4', algs: ["y2 R' F R F' R U' R' U' R U' R'", "R U' R' F R' F R U R' F R", "R U' R' F L' U L U L' U L"] },
      { id: 'cll-pi-5', name: 'Pi 5', algs: ["y' R' U' R' F R F' R U' R' U2 R", "R2 U R' U' F R F' R U' R2", "U' R' U' R' F R F' R U' R' U2 R"] },
      { id: 'cll-pi-6', name: 'Pi 6', algs: ["F R U R' U' R U R' U' F'", "R U' R2 U R2 U R2 U' R", "R' U R2 U' R2 U' R2 U R'"] },
    ],
  },
  {
    id: 'cll-h',
    name: 'H',
    cases: [
      { id: 'cll-h-1', name: 'H 1', algs: ["F R2 U' R2 U' R2 U R2 F'", "F R U' R' U R U2 R' U' R U R' U' F'", "y' R' U2 R y R' U R' U' R U' R"] },
      { id: 'cll-h-2', name: 'H 2', algs: ["R U R' U R U R' F R' F' R", "y2 R' F' R U' R' F' R F' R U R'", "R U R' U R U L' U R' U' L"] },
      { id: 'cll-h-3', name: 'H 3', algs: ["y F R U R' U' R U R' U' R U R' U' F'", "R U' R' F R' F' R2 U' R' F R' F' R", "R2 F' U2 F2 R2 F' R2"] },
      { id: 'cll-h-4', name: 'H 4', algs: ["y R2 U2 R' U2 R2", "y R2 U2 R U2 R2", "R U R' U R U' R' U R U2 R'"] },
    ],
  },
  {
    id: 'cll-l',
    name: 'L',
    cases: [
      { id: 'cll-l-1', name: 'L 1', algs: ["y R U2 R' F' R U2 R' U R' F2 R", "y R' U' R U2 R' F R' F' R U' R", "R' F' R U R' U' R' F R2 U' R' U2 R"] },
      { id: 'cll-l-2', name: 'L 2', algs: ["y2 R U2 R2 F2 R U R' F2 R F'", "R U' R' U R U' R' F R' F' R2 U R'", "R' U2 R' U' F R2 F' U R2"] },
      { id: 'cll-l-3', name: 'L 3', algs: ["y2 R' U R' U2 R U' R' U R U' R2", "y2 R2 U' R U2 R' U2 R U' R2", "y' R U R' U R U' R' U R U' R' U R U2 R'"] },
      { id: 'cll-l-4', name: 'L 4', algs: ["y R U2 R2 F R F' R U2 R'", "R U2 R' F R' F' R2 U2 R'", "y2 R U R' L' U2 R U R' U2 L"] },
      { id: 'cll-l-5', name: 'L 5', algs: ["y F R' F' R U R U' R'", "y F R' F' U' R' U R", "y F' U R U' R' F2 R U' R'"] },
      { id: 'cll-l-6', name: 'L 6', algs: ["y2 F' R U R' U' R' F R", "y F R U' R' U' R U R' F'", "R U R U' R' F R' F'"] },
    ],
  },
  {
    id: 'cll-t',
    name: 'T',
    cases: [
      { id: 'cll-t-1', name: 'T 1', algs: ["y' R U R' U' R' F R F'", "y2 R' U' R U F R F'", "U' x L U R' U' L' U R U' x'"] },
      { id: 'cll-t-2', name: 'T 2', algs: ["y L' U' L U L F' L' F", "y R' F' R U R U' R' F", "R U R' U' y L' U' L"] },
      { id: 'cll-t-3', name: 'T 3', algs: ["F U' R U2 R' U' F2 R U R'", "y R U2 R2 F R F' R U' R' U R U2 R'", "y2 R U F R' F' R U2 R U2 R2"] },
      { id: 'cll-t-4', name: 'T 4', algs: ["R' U R U2 R2 F' R U' R' F2 R2", "y R' U R' F U' R U F2 R2", "y2 R' U R' U2 R U2 R' U R2 U' R'"] },
      { id: 'cll-t-5', name: 'T 5', algs: ["y2 F R U R' U' R U' R' U' R U R' F'", "y' R U R' U' R U' R' F' U' F R U R'", "y R U R' U2 R U R' U R' F R F'"] },
      { id: 'cll-t-6', name: 'T 6', algs: ["R' U R U2 R2 F R F' R", "y2 R U' R' U2 L2 F' L' U L'", "y2 R' F R U2 R2 F R U' R"] },
    ],
  },
  {
    id: 'cll-u',
    name: 'U',
    cases: [
      { id: 'cll-u-1', name: 'U 1', algs: ["y' F R U R' U' F'", "y F U R U' R' F'", "R' F' U' F U R"] },
      { id: 'cll-u-2', name: 'U 2', algs: ["R' U' R2 U R' U2 R U2 R' U R'", "y' R2 F2 R U R' F R2 U2 R' U' R", "R' F U' R U' R' U2 F2 R"] },
      { id: 'cll-u-3', name: 'U 3', algs: ["y2 F R U R' U2 F' R U' R' F", "R' F R U' R' U' R U R' F' R U R' U' R' F R F' R", "y' R U2 R U' R' F R' F2 U' F"] },
      { id: 'cll-u-4', name: 'U 4', algs: ["y' F R' F' R U' R U' R' U2 R U' R'", "F R U' R' U R U R' U R U' R' F'", "y F' R U R' U' R' F R2 U R' U R U2 R'"] },
      { id: 'cll-u-5', name: 'U 5', algs: ["R U' R2 F R F' R U R' U' R U R'", "y2 R U2 R' U R' F2 R F' R' F2 R", "R2 D' R U2 R' D R U2 R"] },
      { id: 'cll-u-6', name: 'U 6', algs: ["R' U R' F R F' R U2 R' U R", "L' U L2 F' L' F L' U' L U L' U' L", "R' F R2 U' R' F R' F' R U R' F' R"] },
    ],
  },
  {
    id: 'cll-oriented',
    name: 'Oriented',
    cases: [
      { id: 'cll-oriented-1', name: 'Adjacent swap', algs: ["R U2 R' U' R U2 L' U R' U' L", "R U R' U' R' F R2 U' R' U' R U R' F'"] },
      { id: 'cll-oriented-2', name: 'Diagonal swap', algs: ["F R U' R' U' R U R' F' R U R' U' R' F R F'", "R U' R' U' F2 U' R U R' D R2"] },
    ],
  },
];

/** EG-1: the first face is built with two adjacent bottom corners swapped. */
export const eg1Groups: CaseGroup2x2[] = [
  {
    id: 'eg1-sune',
    name: 'Sune',
    cases: [
      { id: 'eg1-sune-1', name: 'Sune 1', algs: ["y2 U' L F' L2 U' L F U L' U L", "y2 R U R' U F R U' R2 F' R", "y U R' F R2 F' R2 U2 R U2"] },
      { id: 'eg1-sune-2', name: 'Sune 2', algs: ["R U R' F2 U F R U R'", "U F R' F' R F R U' R' U R' F' R", "U R' F R F U F2 R' F R"] },
      { id: 'eg1-sune-3', name: 'Sune 3', algs: ["y2 F R' F' R U R' F' R2 U R'", "y2 F L' U' L U L' U' L R U R'", "y2 U R' F R U2 R U' R2 F2 R F'"] },
      { id: 'eg1-sune-4', name: 'Sune 4', algs: ["U F' R' F R2 U R' U' F R' F' R U", "U F' R' F R2 U R' U' F R' F' R", "F' U R U' R' U F R U R'"] },
      { id: 'eg1-sune-5', name: 'Sune 5', algs: ["y R U' R' U R U' R' U F R U' R'", "y U2 L' U' L F U L' U' L U L' U' L", "y U2 R2 F U' R U' R U' F2"] },
      { id: 'eg1-sune-6', name: 'Sune 6', algs: ["R' F R2 U' R' U R U' R' F", "L' U L2 F' L' U L F' L' F", "R' F R2 U' R' U L F' L' F"] },
    ],
  },
  {
    id: 'eg1-anti-sune',
    name: 'Anti-Sune',
    cases: [
      { id: 'eg1-anti-sune-1', name: 'Anti-Sune 1', algs: ["y U2 B U' R2 F2 U' F", "y R' F R2 U R' F' U' R U' R'", "y U' L' U' L U' F' L' U L2 F L'"] },
      { id: 'eg1-anti-sune-2', name: 'Anti-Sune 2', algs: ["U R U' R' F' U' F2 R U' R'", "U2 L' U' L F2 U' F' L' U' L", "R U' F2 R U2 R U' F"] },
      { id: 'eg1-anti-sune-3', name: 'Anti-Sune 3', algs: ["F' R U R' U' R U R2 F' R", "U' R U' R' U2 R' F R2 U2 R' F", "F' L F L' U' L F L2 U' L"] },
      { id: 'eg1-anti-sune-4', name: 'Anti-Sune 4', algs: ["R U' R' F' U' R U R' U' F", "U F R U' R2 F' R U F' R U R'", "U' R' F R F' U R U' R2 F' R F"] },
      { id: 'eg1-anti-sune-5', name: 'Anti-Sune 5', algs: ["y' R U R' F' U' R U R' U' R U R'", "y' U2 L' U L U' L' U L U L F L' F'", "y' U2 R' F R U' R' F R U R U R' F'"] },
      { id: 'eg1-anti-sune-6', name: 'Anti-Sune 6', algs: ["y2 R U' R2 F R U' R' F R F'", "y2 L F' L2 U L U' L' U L F'"] },
    ],
  },
  {
    id: 'eg1-pi',
    name: 'Pi',
    cases: [
      { id: 'eg1-pi-1', name: 'Pi 1', algs: ["y2 U' F U' R' F R U' F2 R U R'", "y2 F2 R U R' U2 R U R' U' F", "y2 R2 B2 R' U R' U' R U2 R U' R2"] },
      { id: 'eg1-pi-2', name: 'Pi 2', algs: ["y' R U' R2 F R2 U' R'", "y' R U R2 F' R2 U R'", "y' R' F R2 U' R2 F R"] },
      { id: 'eg1-pi-3', name: 'Pi 3', algs: ["y' F R' F U' F2 R U R", "y' F' R U2 R' F' U2 F R' F' R"] },
      { id: 'eg1-pi-4', name: 'Pi 4', algs: ["y' R U' R' U R U' R' F R U' R'", "y' F' R U R' U' R U R' F' R U R'"] },
      { id: 'eg1-pi-5', name: 'Pi 5', algs: ["R U' R2 F R U R U' R' U' R' F R F'", "U' R U R' U R U' R2 F' R F R' F' R", "R' U' R' F2 U' R U2 F2 R"] },
      { id: 'eg1-pi-6', name: 'Pi 6', algs: ["U' R' F' R U' R' F R2 U R' F' R U R'", "U' R' F R F' R' F R2 U R' U' R U' R'", "F R U' R' F R U2 R' U F'"] },
    ],
  },
  {
    id: 'eg1-h',
    name: 'H',
    cases: [
      { id: 'eg1-h-1', name: 'H 1', algs: ["U' R' F R2 U' R' F R U R' F'", "U' R' F R2 U' R2 U' F U R", "F' R' F R F R' F' R2 U R'"] },
      { id: 'eg1-h-2', name: 'H 2', algs: ["U' F' U R U' R2 F2 R U' F", "y' R2 U' R U' R' U R' U' R U' R2", "F R U' R2 F U' F2 U R"] },
      { id: 'eg1-h-3', name: 'H 3', algs: ["U R' F R F' U2 F R U2 R' F", "R' U' R' F2 U F' R F'", "U' F U2 R U' R' F2 R' F2 R F'"] },
      { id: 'eg1-h-4', name: 'H 4', algs: ["U' R U R' F' R U R' U' R U R' U'", "F' U R' F R F' U F2", "U' R U R' F' R U R' U' R U R'"] },
    ],
  },
  {
    id: 'eg1-l',
    name: 'L',
    cases: [
      { id: 'eg1-l-1', name: 'L 1', algs: ["y R U' R' U R U' R2 F' R F", "y U R U R' F' R U2 R' U2 R U R'", "y U F R U' R' F' R U R' F' R U R'"] },
      { id: 'eg1-l-2', name: 'L 2', algs: ["y' U' R' F R U' R' F R2 U R' F' U2", "y' U' R' F R U' R' F R2 U R' F'", "y' U' L' U L U' L' U L2 F L' F'"] },
      { id: 'eg1-l-3', name: 'L 3', algs: ["y R' U R2 U' R2 U' F R2 U' R'"] },
      { id: 'eg1-l-4', name: 'L 4', algs: ["y R' F R2 U R' F' R U2 R'", "y R U2 R' F R U' R2 F' R"] },
      { id: 'eg1-l-5', name: 'L 5', algs: ["y2 R U R' F' R U R' U' F R' F' R", "y2 U' R U R' F' U R U R' U' R U R' U'", "y2 U F' R' F R U' R U R' U' R U R' U'"] },
      { id: 'eg1-l-6', name: 'L 6', algs: ["y2 R' U2 F R U2 R U' R2 F", "y2 U' L' U' L F L' U' L U F' L F L'", "y2 U2 F R U' R' U R' F' R U R' F' R"] },
    ],
  },
  {
    id: 'eg1-t',
    name: 'T',
    cases: [
      { id: 'eg1-t-1', name: 'T 1', algs: ["F R U' R2 F' R U R' F' R", "F L F' L2 U' L U L' U' L", "U R2 U R U' R2 F R U2 R' F"] },
      { id: 'eg1-t-2', name: 'T 2', algs: ["F' R' F R2 U R' U' R U R'", "U2 R U2 R' F R U' R' F' R U R'", "U2 R U' R' F R U' R' F R U R' F'"] },
      { id: 'eg1-t-3', name: 'T 3', algs: ["y R U' R2 F R U R U2 R'", "y R U2 R' U' R' F' R2 U R'", "y U2 R' F R2 U' R' U' R' F2 R"] },
      { id: 'eg1-t-4', name: 'T 4', algs: ["y' U2 R' F R F' U R U' R' U F R U' R'", "y' U' R' U F R2 U' R2 U' F U' R", "y' R2 B2 U' R' U' R U' R' U R'"] },
      { id: 'eg1-t-5', name: 'T 5', algs: ["y' R' F' R2 U R' F' R U R'", "y' U2 R U R2 F' R F R' F' R", "y' U2 R U R2 F' R F R' F' R U2"] },
      { id: 'eg1-t-6', name: 'T 6', algs: ["y' U' R U' R' U2 F R U2 R' F", "y' U R' U' R U F2 U' F2 R U R", "y' U R' U' R U F2 U' F2 R U R"] },
    ],
  },
  {
    id: 'eg1-u',
    name: 'U',
    cases: [
      { id: 'eg1-u-1', name: 'U 1', algs: ["y U2 R U R' U R U' R2 F' R2 U R' U", "y U2 R U R' U R U R2 F R2 U' R'", "y U2 R U' R2 F R2 U R' U' R U' R' U"] },
      { id: 'eg1-u-2', name: 'U 2', algs: ["U2 y R' U R' U' R U' R' U' F2 R2", "U' R U R' F' U' R U R' U' F R' F' R"] },
      { id: 'eg1-u-3', name: 'U 3', algs: ["F' U2 R U2 R' U2 F", "U2 R U' R2 F2 R F' U R U R'", "U y' R U R' F R2 F' R U' R'"] },
      { id: 'eg1-u-4', name: 'U 4', algs: ["y R' F R F' R' F R2 U' R'", "y U2 R U' R' F R U' R2 F R", "y U2 L F' L' F L F' L2 U L"] },
      { id: 'eg1-u-5', name: 'U 5', algs: ["U2 R U' R' U R U' R' U' F R U' R'", "U R' F R F' U R U' R' F R U' R'", "U2 L F' L' U L F' L' U L' U' L F"] },
      { id: 'eg1-u-6', name: 'U 6', algs: ["y2 R' F R U' R' F R U' R U R' F' U2", "y2 R' F R2 U' R' U y' R U R'", "y2 U L F' L' F U' L' U L F' L' U L"] },
    ],
  },
  {
    id: 'eg1-oriented',
    name: 'Oriented',
    cases: [
      { id: 'eg1-oriented-1', name: 'Top solved', algs: ["x2 R U2 R' U' R U2 L' U R' U' L"] },
      { id: 'eg1-oriented-2', name: 'Top adjacent swap', algs: ["R2 U' R2 U2 F2 U' R2"] },
      { id: 'eg1-oriented-3', name: 'Top diagonal swap', algs: ["x2 R U' L U2 R' U L'"] },
    ],
  },
];

/** EG-2: the first face is built with two diagonal bottom corners swapped. */
export const eg2Groups: CaseGroup2x2[] = [
  {
    id: 'eg2-sune',
    name: 'Sune',
    cases: [
      { id: 'eg2-sune-1', name: 'Sune 1', algs: ["R2 F2 R U R U' R' F R' F' R2 U R' U' R", "y' R' F R2 F' U' R' U' R2 U R B2 R2", "y' R' F R2 F' U' R' U' R2 U R F2 R2"] },
      { id: 'eg2-sune-2', name: 'Sune 2', algs: ["R U R' U R U2 R B2 R2", "y' R2 F2 R U2 R U R' U R", "R2 B2 R' U R' U R U2 R'"] },
      { id: 'eg2-sune-3', name: 'Sune 3', algs: ["R U' R' F R' F' R' F2 R2", "R U' R' F2 R2 F' L' U' L"] },
      { id: 'eg2-sune-4', name: 'Sune 4', algs: ["F R' F' R U2 R U2 R B2 R2", "y F R2 F' R2 F' R U' R"] },
      { id: 'eg2-sune-5', name: 'Sune 5', algs: ["R' U R' F R2 U' F R' F'", "y2 R' F R' F2 R U R U R' U R", "R' U R' F R2 D' R U' R'"] },
      { id: 'eg2-sune-6', name: 'Sune 6', algs: ["R2 B2 R' U' R' F R' F' R", "R2 B2 R' U' L' U R' U' L", "y2 R U' R U' R' U R' U' F R' F' R2 B2 R2"] },
    ],
  },
  {
    id: 'eg2-anti-sune',
    name: 'Anti-Sune',
    cases: [
      { id: 'eg2-anti-sune-1', name: 'Anti-Sune 1', algs: ["F R2 U R' U2 R U R2 U F'", "U2 R' U2 R2 U' R' U R' F R F R2", "U2 F R2 U2 R' U R' U2 R U' F'"] },
      { id: 'eg2-anti-sune-2', name: 'Anti-Sune 2', algs: ["R' U' R U' R' U2 R' F2 R2", "U2 R' F' R U' R' F2 R' F2 R2", "y R U2 R' U' R U' R B2 R2"] },
      { id: 'eg2-anti-sune-3', name: 'Anti-Sune 3', algs: ["U2 R' F R F' R U R B2 R2", "U2 L' U R U' L U R B2 R2", "y2 L' U L F' R U R B2 R2"] },
      { id: 'eg2-anti-sune-4', name: 'Anti-Sune 4', algs: ["U2 F' L F L' U2 L' U2 L' B2 L2", "y' R' U R' F R2 F R2 F'", "y2 F' R U R' U2 R' F2 R' F2 R2"] },
      { id: 'eg2-anti-sune-5', name: 'Anti-Sune 5', algs: ["R' U' R U' R' U' R' F2 R F' R", "y2 F R F' U R2 F' R U' R", "y2 R U2 R' U2 R' F R F R2 F2"] },
      { id: 'eg2-anti-sune-6', name: 'Anti-Sune 6', algs: ["y2 R2 F2 R F R F' R U R'", "R2 F2 R U L U' R U L'", "y R U2 R' U' R U' R F2 R U R' F2 R F' R' F2 R2"] },
    ],
  },
  {
    id: 'eg2-pi',
    name: 'Pi',
    cases: [
      { id: 'eg2-pi-1', name: 'Pi 1', algs: ["F U' R U2 R U' R' U R' F'", "y' R' U' R' F R F' R U' R' U2 R' F2 R2", "y' F2 U' F2 R U2 R F2 U' R2"] },
      { id: 'eg2-pi-2', name: 'Pi 2', algs: ["R U2 R2 U R' F2 R2 F'", "R U' R2 U R2 U R2 U' R' F2 R2", "R' U2 R2 U' R' F2 R2 F'"] },
      { id: 'eg2-pi-3', name: 'Pi 3', algs: ["U F R2 U' R2 U R2 U R2 F R2 F2 U2", "y2 R' F' U R' F R2 U2 R' U R", "y' R U' R U' R' U R' F R2 F R2 F2"] },
      { id: 'eg2-pi-4', name: 'Pi 4', algs: ["y2 R' F R F' R U' R' U' R U' R F2 R2", "U R U' F U' F' R F2 U2 R' U", "R U' R' F L' U L U R' F R' F2 R2"] },
      { id: 'eg2-pi-5', name: 'Pi 5', algs: ["U' R' F' R' F2 R2 U R' U2 R U", "y' R' F' R' F2 R2 U R' U2 R", "U F U R U' R' U R U' R2 F' R U R U' R F2 R2 U'"] },
      { id: 'eg2-pi-6', name: 'Pi 6', algs: ["U R' U2 R U' R2 F2 R F R U'", "y R' U2 R U' R2 F2 R F R", "R U2 R' U' R U R' U2 R' F R F' R2 F2 R2"] },
    ],
  },
  {
    id: 'eg2-h',
    name: 'H',
    cases: [
      { id: 'eg2-h-1', name: 'H 1', algs: ["R2 F U2 F2 R2 F' R2", "R U' R' F R' F' R2 U' R' F R' F' R' F2 R2", "U F R U R' U' R U R' U' R U R' U' F' R2 F2 R2 U'"] },
      { id: 'eg2-h-2', name: 'H 2', algs: ["y R2 B2 U2 R' U2 R2", "y R2 U2 R U2 B2 R2", "y R2 U2 R U2 F2 R2"] },
      { id: 'eg2-h-3', name: 'H 3', algs: ["R' U' R U2 R2 F' R U' F R", "y R' U' F R U' R U R' U2 R' F", "y2 R U R' U R U R' F R' F' R' F2 R2"] },
      { id: 'eg2-h-4', name: 'H 4', algs: ["y' R U2 B2 R' U R U' B R'", "y2 F R2 U' R2 U' R2 U R2 F R2 F2", "y R U' R' F U2 R2 F' R F' R"] },
    ],
  },
  {
    id: 'eg2-l',
    name: 'L',
    cases: [
      { id: 'eg2-l-1', name: 'L 1', algs: ["U L2 B2 L U' L' U L F' L F", "y R2 B2 R2 F R' F' R U R U' R'", "y R' U' R' F' R U' R U' R' F R"] },
      { id: 'eg2-l-2', name: 'L 2', algs: ["y2 F2 R2 F R U R' U' R' F R", "y2 R2 B2 R' U R U' R' F R' F'", "U2 F' R U R' U' R' F R U R' F R' F2 R U' R"] },
      { id: 'eg2-l-3', name: 'L 3', algs: ["y2 R2 U' R U2 R' U2 R U' F2 R2", "y R' U' F2 R U2 R' U2 F R", "y2 R2 F2 R U R' U2 R U' R' U R U' R2"] },
      { id: 'eg2-l-4', name: 'L 4', algs: ["y R U2 R2 F R F' R U2 R B2 R2", "y' R' U' R U R' F' R U R' U' R' F' R2", "y' R' U L' U2 R' F R U' R' U' F' x2"] },
      { id: 'eg2-l-5', name: 'L 5', algs: ["y F R' F' R U R U' R B2 R2"] },
      { id: 'eg2-l-6', name: 'L 6', algs: ["y2 F' R U R' U' R' F R' F2 R2"] },
    ],
  },
  {
    id: 'eg2-t',
    name: 'T',
    cases: [
      { id: 'eg2-t-1', name: 'T 1', algs: ["U R' F' R U R U' R' F' R2 B2 U", "R U R' U' F' U' F' L2 B2", "y R' F' R U R U' R' F' R2 F2"] },
      { id: 'eg2-t-2', name: 'T 2', algs: ["y' F U' R2 U' R' U R2 F'", "y F R' U2 R' U' R U2 F'", "y' R U R' U' R' F R F' R2 F2 R2"] },
      { id: 'eg2-t-3', name: 'T 3', algs: ["R' U R U2 R2 F' R U' R", "y R' U R' F U' R U R2", "R U2 R' U' R U' R2 U2 R U R' U R' F2 R2 U'"] },
      { id: 'eg2-t-4', name: 'T 4', algs: ["R2 F2 R U' F R' F' R U R", "U R U2 R2 F R F' R U' R' U R U2 R F2 R2 U", "y2 R2 B2 R2 F R U R' U' F'"] },
      { id: 'eg2-t-5', name: 'T 5', algs: ["y' R' U2 R U' R' F R' F R F' R", "R' U R U2 R2 F R F' R' F2 R2", "y R' F2 R U' R' U R' F R U' R"] },
      { id: 'eg2-t-6', name: 'T 6', algs: ["y R' U2 R' F2 R F2 R", "U R' U2 R' F2 R F2 R U", "U R' U' F R U2 R' U' F R"] },
    ],
  },
  {
    id: 'eg2-u',
    name: 'U',
    cases: [
      { id: 'eg2-u-1', name: 'U 1', algs: ["R2 U2 R U R' U F' R U' R", "y' F U' R U2 R U' R' U2 R' U' F'", "y' R' U R' F U' R U' R U2 R2"] },
      { id: 'eg2-u-2', name: 'U 2', algs: ["y' F R U R' U' F R2 B2", "U' F R U R' U' F R2 B2 U'", "y F U R U' R' F R2 F2"] },
      { id: 'eg2-u-3', name: 'U 3', algs: ["R' F' U' R U2 R' U F R", "y2 R' U' R U R' F2 R U' R' U R", "R U R' U' R B2 R' U R U' R'"] },
      { id: 'eg2-u-4', name: 'U 4', algs: ["R' F' U' F U2 L' U2 R U' L", "y' R2 F2 R U R U2 R2 F R F' R", "F R U R' U' F R U R' U' F R U R F2 R2 U2"] },
      { id: 'eg2-u-5', name: 'U 5', algs: ["y2 R2 B2 R' U R' U' R' F R F'", "U2 R2 B2 R' U R' U' R' F R F' U2", "R' U R' F R F' R U2 R' U R' F2 R2"] },
      { id: 'eg2-u-6', name: 'U 6', algs: ["y2 R2 F2 R F' R U L F' L' F", "y2 R2 B2 R2 F R F' R U R' U' R'", "R U' R2 F R F' R U R' U' R U R F2 R2"] },
    ],
  },
  {
    id: 'eg2-oriented',
    name: 'Oriented',
    cases: [
      { id: 'eg2-oriented-1', name: 'Top solved', algs: ["x2 R U' R' U' F2 U' R U R' D R2", "x2 F R U' R' U' R U R' F' R U R' U' R' F R F'"] },
      { id: 'eg2-oriented-2', name: 'Top adjacent swap', algs: ["R U' L U2 R' U L'", "y2 R' U R' F2 R F' R"] },
      { id: 'eg2-oriented-3', name: 'Top diagonal swap', algs: ["R2 F2 R2"] },
    ],
  },
];

export function casesIn(groups: CaseGroup2x2[]): Case2x2[] {
  return groups.flatMap((g) => g.cases);
}

export function groupById(groups: CaseGroup2x2[], id: string): CaseGroup2x2 {
  const group = groups.find((g) => g.id === id);
  if (!group) throw new Error(`Unknown 2x2 case group: ${id}`);
  return group;
}
