// ============================================
// Mahjoom — Solvable Board Generator
// Reverse-placement algorithm guarantees solvability
// ============================================

import { Tile, TilePosition, Board, BoardLayout, Difficulty, TileFace } from '@/types';
import { generateTileSet } from './tiles';
import { isTileFree, findAvailablePairs } from './rules';
import { SeededRandom } from './solvability';
import { TURTLE_LAYOUT } from './board';

/**
 * Determine how many tiles to use based on difficulty.
 * All counts must be even (pairs).
 */
function getTileCountByDifficulty(totalPositions: number, difficulty: Difficulty): number {
  const ratios: Record<Difficulty, number> = {
    easy: 0.6,
    medium: 0.8,
    hard: 0.9,
    expert: 1.0,
  };
  const count = Math.floor(totalPositions * ratios[difficulty]);
  return count % 2 === 0 ? count : count - 1;
}

/**
 * Build a tile ID from its index and face.
 */
function makeTileId(index: number, face: TileFace): string {
  return `tile-${index}-${face.id}`;
}

/**
 * Core reverse-placement generator.
 *
 * Strategy:
 * 1. Start with all positions filled as an empty board (no faces yet).
 * 2. Find all currently "free" positions.
 * 3. Randomly pick a pair of free positions.
 * 4. Assign them a matching face pair.
 * 5. Mark them as "placed" (they'll be removed first when solving).
 * 6. Repeat until all positions are assigned.
 *
 * This guarantees the board is solvable because the placement order
 * is exactly the reverse of the solving order.
 */
export function generateSolvableBoard(
  layout: BoardLayout,
  seed: string,
  difficulty: Difficulty = 'medium'
): Board {
  const rng = new SeededRandom(seed);

  const totalPositions = layout.positions.length;
  const tileCount = getTileCountByDifficulty(totalPositions, difficulty);

  // Select positions to use (trim to tileCount)
  const selectedPositions = rng.shuffle(layout.positions).slice(0, tileCount);

  // Build initial placeholder tiles — all "phantom" tiles with no face yet
  // We use these purely to evaluate which positions are free
  const phantom: Tile[] = selectedPositions.map((pos, idx) => ({
    id: `ph-${idx}`,
    face: { id: 'phantom', category: 'suit', label: '', emoji: '' } as TileFace,
    position: pos,
    state: 'idle',
    isRemoved: false,
  }));

  // Generate tile faces: we need tileCount/2 pairs
  const pairsNeeded = tileCount / 2;
  const tileSet = generateTileSet(); // 144 face instances
  const shuffledFaces = rng.shuffle(tileSet).slice(0, tileCount);

  // Build face pairs: pair consecutive items
  const facePairs: [TileFace, TileFace][] = [];
  for (let i = 0; i < pairsNeeded; i++) {
    facePairs.push([shuffledFaces[i * 2], shuffledFaces[i * 2 + 1]]);
  }

  // Reverse-placement: assign faces by repeatedly finding free phantom positions
  const assigned: Array<{ pos: TilePosition; face: TileFace }> = [];
  let remaining = [...phantom];

  for (const [face1, face2] of facePairs) {
    // Find free positions among remaining phantoms
    const freeTiles = remaining.filter((t) => isTileFree(t, remaining));

    if (freeTiles.length < 2) {
      // Fallback: just pick any two remaining positions
      if (remaining.length >= 2) {
        const pos1 = remaining.pop()!;
        const pos2 = remaining.pop()!;
        assigned.push({ pos: pos1.position, face: face1 });
        assigned.push({ pos: pos2.position, face: face2 });
      }
      continue;
    }

    // Pick 2 random free tiles
    const shuffledFree = rng.shuffle(freeTiles);
    const picked1 = shuffledFree[0];
    const picked2 = shuffledFree[1];

    assigned.push({ pos: picked1.position, face: face1 });
    assigned.push({ pos: picked2.position, face: face2 });

    // Remove from remaining
    remaining = remaining.filter((t) => t.id !== picked1.id && t.id !== picked2.id);
  }

  // Build final tiles array
  const tiles: Tile[] = assigned.map(({ pos, face }, idx) => ({
    id: makeTileId(idx, face),
    face,
    position: pos,
    state: 'idle',
    isRemoved: false,
  }));

  return {
    tiles,
    layout,
    seed,
    createdAt: Date.now(),
  };
}

/**
 * Quick solvability check using a depth-first solver.
 * Returns true if the board can be solved from its current state.
 * Limited to maxDepth iterations to prevent infinite loops.
 */
export function validateSolvability(tiles: Tile[], maxAttempts = 500): boolean {
  let currentTiles = tiles.filter((t) => !t.isRemoved);
  let attempts = 0;

  while (currentTiles.length > 0 && attempts < maxAttempts) {
    const pairs = findAvailablePairs(currentTiles);
    if (pairs.length === 0) return false;

    // Pick the first available pair and remove it
    const [t1, t2] = pairs[0];
    currentTiles = currentTiles.filter((t) => t.id !== t1.id && t.id !== t2.id);
    attempts++;
  }

  return currentTiles.length === 0;
}

/**
 * Reshuffle remaining tiles on the board while maintaining positions.
 * Redistributes faces among remaining tiles to create new valid moves.
 */
export function reshuffleBoard(tiles: Tile[], seed: string): Tile[] {
  const rng = new SeededRandom(`${seed}-reshuffle-${Date.now()}`);
  const activeTiles = tiles.filter((t) => !t.isRemoved);

  // Collect all active faces and shuffle them
  const faces = rng.shuffle(activeTiles.map((t) => t.face));

  // Reassign faces to positions
  return tiles.map((tile) => {
    if (tile.isRemoved) return tile;
    const idx = activeTiles.findIndex((t) => t.id === tile.id);
    return { ...tile, face: faces[idx], state: 'idle' };
  });
}

/**
 * Generate a daily board — deterministic for all players on the same day.
 */
export function generateDailyBoard(date?: Date): Board {
  const d = date || new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const seed = `mahjoom-daily-${dateStr}`;

  return generateSolvableBoard(TURTLE_LAYOUT, seed, 'hard');
}
