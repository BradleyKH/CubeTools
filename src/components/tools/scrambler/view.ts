/** Cubes read best as a flat net; the other puzzles keep their 3D view. */
export function viewFor(puzzle: string): '2D' | '3D' {
  return /^\d+x\d+x\d+$/.test(puzzle) ? '2D' : '3D';
}
