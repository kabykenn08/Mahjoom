// ============================================
// Mahjoom — Game Rules Engine
// Tile availability, matching, win/loss detection
// ============================================

import { Tile, TilePosition, GameMove } from '@/types';
import { canMatch } from './tiles';

/**
 * Check if a tile is covered by another tile (has a tile directly above it).
 * A tile at (col, row, layer) is covered if there's a non-removed tile
 * at (col, row, layer+1) or overlapping on the layer above.
 */
export function isTileCovered(tile: Tile, allTiles: Tile[]): boolean {
  return allTiles.some(
    (other) =>
      !other.isRemoved &&
      other.id !== tile.id &&
      other.position.layer > tile.position.layer &&
      Math.abs(other.position.col - tile.position.col) < 1 &&
      Math.abs(other.position.row - tile.position.row) < 1
  );
}

/**
 * Check if a tile is blocked on the left side.
 * A tile is blocked on left if there's a non-removed tile at (col-1, row, layer).
 */
export function isBlockedLeft(tile: Tile, allTiles: Tile[]): boolean {
  return allTiles.some(
    (other) =>
      !other.isRemoved &&
      other.id !== tile.id &&
      other.position.layer === tile.position.layer &&
      other.position.row === tile.position.row &&
      other.position.col === tile.position.col - 1
  );
}

/**
 * Check if a tile is blocked on the right side.
 */
export function isBlockedRight(tile: Tile, allTiles: Tile[]): boolean {
  return allTiles.some(
    (other) =>
      !other.isRemoved &&
      other.id !== tile.id &&
      other.position.layer === tile.position.layer &&
      other.position.row === tile.position.row &&
      other.position.col === tile.position.col + 1
  );
}

/**
 * Check if a tile is "free" — selectable by the player.
 * A tile is free if:
 * 1. It is not covered (no tile above it)
 * 2. At least one side (left or right) is free
 */
export function isTileFree(tile: Tile, allTiles: Tile[]): boolean {
  if (tile.isRemoved) return false;
  if (isTileCovered(tile, allTiles)) return false;
  
  const blockedLeft = isBlockedLeft(tile, allTiles);
  const blockedRight = isBlockedRight(tile, allTiles);
  
  // Must have at least one side free
  return !blockedLeft || !blockedRight;
}

/**
 * Get all free (selectable) tiles on the board.
 */
export function getFreeTiles(allTiles: Tile[]): Tile[] {
  return allTiles.filter((tile) => isTileFree(tile, allTiles));
}

/**
 * Check if two tiles can be matched and removed.
 * Both must be free and have matching faces.
 */
export function canMatchTiles(tile1: Tile, tile2: Tile, allTiles: Tile[]): boolean {
  if (tile1.id === tile2.id) return false;
  if (tile1.isRemoved || tile2.isRemoved) return false;
  if (!isTileFree(tile1, allTiles) || !isTileFree(tile2, allTiles)) return false;
  return canMatch(tile1.face, tile2.face);
}

/**
 * Find all valid matching pairs among free tiles.
 */
export function findAvailablePairs(allTiles: Tile[]): [Tile, Tile][] {
  const freeTiles = getFreeTiles(allTiles);
  const pairs: [Tile, Tile][] = [];

  for (let i = 0; i < freeTiles.length; i++) {
    for (let j = i + 1; j < freeTiles.length; j++) {
      if (canMatch(freeTiles[i].face, freeTiles[j].face)) {
        pairs.push([freeTiles[i], freeTiles[j]]);
      }
    }
  }

  return pairs;
}

/**
 * Get a hint — returns one valid pair, or null if none exist.
 */
export function getHint(allTiles: Tile[]): [Tile, Tile] | null {
  const pairs = findAvailablePairs(allTiles);
  if (pairs.length === 0) return null;
  // Return a random pair for variety
  return pairs[Math.floor(Math.random() * pairs.length)];
}

/**
 * Check if the game is won (all tiles removed).
 */
export function isGameWon(allTiles: Tile[]): boolean {
  return allTiles.every((tile) => tile.isRemoved);
}

/**
 * Check if the game is lost (no valid moves remaining but tiles still exist).
 */
export function isGameLost(allTiles: Tile[]): boolean {
  const remainingTiles = allTiles.filter((t) => !t.isRemoved);
  if (remainingTiles.length === 0) return false; // game is won, not lost
  return findAvailablePairs(allTiles).length === 0;
}

/**
 * Remove a matched pair of tiles from the board.
 * Returns a new tiles array with the pair marked as removed.
 */
export function removePair(allTiles: Tile[], tile1Id: string, tile2Id: string): Tile[] {
  return allTiles.map((tile) => {
    if (tile.id === tile1Id) {
      return { ...tile, isRemoved: true, state: 'matched' as const, matchedWith: tile2Id };
    }
    if (tile.id === tile2Id) {
      return { ...tile, isRemoved: true, state: 'matched' as const, matchedWith: tile1Id };
    }
    return tile;
  });
}

/**
 * Undo the last move — restore a matched pair.
 */
export function undoMove(allTiles: Tile[], move: GameMove): Tile[] {
  return allTiles.map((tile) => {
    if (tile.id === move.tile1Id || tile.id === move.tile2Id) {
      return { ...tile, isRemoved: false, state: 'idle' as const, matchedWith: undefined };
    }
    return tile;
  });
}

/**
 * Calculate game statistics from current board state.
 */
export function calculateGameStats(allTiles: Tile[], moves: GameMove[], elapsed: number) {
  const totalTiles = allTiles.length;
  const removedTiles = allTiles.filter((t) => t.isRemoved).length;
  const remainingTiles = totalTiles - removedTiles;
  const matchedPairs = removedTiles / 2;
  const availablePairs = findAvailablePairs(allTiles).length;
  const totalPossiblePairs = totalTiles / 2;
  const efficiency = totalPossiblePairs > 0 ? (matchedPairs / moves.length) * 100 : 100;

  return {
    totalMoves: moves.length,
    matchedPairs,
    remainingTiles,
    availablePairs,
    efficiency: Math.min(100, Math.round(efficiency)),
    timeElapsed: elapsed,
  };
}
/**
 * Get distribution of remaining tiles across layers.
 */
export function getLayerDistribution(allTiles: Tile[]): Record<number, number> {
  const dist: Record<number, number> = {};
  allTiles.filter(t => !t.isRemoved).forEach(t => {
    const l = t.position.layer;
    dist[l] = (dist[l] || 0) + 1;
  });
  return dist;
}
