// ============================================
// Mahjoom — Tile Definitions
// All 42 unique tile faces for Mahjong Solitaire
// ============================================

import { TileFace } from '@/types';

// Bamboo suit tiles (1-9)
const bambooTiles: TileFace[] = Array.from({ length: 9 }, (_, i) => ({
  id: `bamboo-${i + 1}`,
  category: 'suit',
  suit: 'bamboo',
  value: i + 1,
  label: `Bamboo ${i + 1}`,
  emoji: ['🎋', '🎍', '🌿', '🍃', '🌱', '🌾', '🎋', '🌲', '🎍'][i],
}));

// Circle suit tiles (1-9)
const circleTiles: TileFace[] = Array.from({ length: 9 }, (_, i) => ({
  id: `circle-${i + 1}`,
  category: 'suit',
  suit: 'circle',
  value: i + 1,
  label: `Circle ${i + 1}`,
  emoji: ['⚪', '⭕', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫'][i],
}));

// Character suit tiles (1-9)
const characterTiles: TileFace[] = Array.from({ length: 9 }, (_, i) => ({
  id: `character-${i + 1}`,
  category: 'suit',
  suit: 'character',
  value: i + 1,
  label: `Character ${i + 1}`,
  emoji: ['一', '二', '三', '四', '五', '六', '七', '八', '九'][i],
}));

// Wind tiles
const windTiles: TileFace[] = [
  { id: 'wind-east', category: 'wind', wind: 'east', label: 'East Wind', emoji: '🌬️' },
  { id: 'wind-south', category: 'wind', wind: 'south', label: 'South Wind', emoji: '🌀' },
  { id: 'wind-west', category: 'wind', wind: 'west', label: 'West Wind', emoji: '💨' },
  { id: 'wind-north', category: 'wind', wind: 'north', label: 'North Wind', emoji: '❄️' },
];

// Dragon tiles
const dragonTiles: TileFace[] = [
  { id: 'dragon-red', category: 'dragon', dragon: 'red', label: 'Red Dragon', emoji: '🐉' },
  { id: 'dragon-green', category: 'dragon', dragon: 'green', label: 'Green Dragon', emoji: '🐲' },
  { id: 'dragon-white', category: 'dragon', dragon: 'white', label: 'White Dragon', emoji: '🀄' },
];

// Flower tiles (bonus — each is unique, matches with any other flower)
const flowerTiles: TileFace[] = [
  { id: 'flower-plum', category: 'flower', flower: 'plum', label: 'Plum', emoji: '🌸' },
  { id: 'flower-orchid', category: 'flower', flower: 'orchid', label: 'Orchid', emoji: '🌺' },
  { id: 'flower-chrysanthemum', category: 'flower', flower: 'chrysanthemum', label: 'Chrysanthemum', emoji: '🌼' },
  { id: 'flower-bamboo', category: 'flower', flower: 'bamboo_flower', label: 'Bamboo Flower', emoji: '🎋' },
];

// Season tiles (bonus — each is unique, matches with any other season)
const seasonTiles: TileFace[] = [
  { id: 'season-spring', category: 'season', season: 'spring', label: 'Spring', emoji: '🌱' },
  { id: 'season-summer', category: 'season', season: 'summer', label: 'Summer', emoji: '☀️' },
  { id: 'season-autumn', category: 'season', season: 'autumn', label: 'Autumn', emoji: '🍂' },
  { id: 'season-winter', category: 'season', season: 'winter', label: 'Winter', emoji: '❄️' },
];

/** All 42 unique tile faces */
export const ALL_TILE_FACES: TileFace[] = [
  ...bambooTiles,
  ...circleTiles,
  ...characterTiles,
  ...windTiles,
  ...dragonTiles,
  ...flowerTiles,
  ...seasonTiles,
];

/** 34 standard faces (each appears 4x = 136 tiles total) */
export const STANDARD_FACES: TileFace[] = [
  ...bambooTiles,
  ...circleTiles,
  ...characterTiles,
  ...windTiles,
  ...dragonTiles,
];

/** Bonus faces (flowers + seasons, each appears 1x) */
export const BONUS_FACES: TileFace[] = [
  ...flowerTiles,
  ...seasonTiles,
];

/**
 * Check if two tiles can be matched.
 * Standard tiles: must have the same face ID
 * Flowers: any flower matches any flower
 * Seasons: any season matches any season
 */
export function canMatch(face1: TileFace, face2: TileFace): boolean {
  if (face1.id === face2.id) return true;
  if (face1.category === 'flower' && face2.category === 'flower') return true;
  if (face1.category === 'season' && face2.category === 'season') return true;
  return false;
}

/**
 * Get the visual symbol for rendering a tile.
 * Returns a compact visual representation.
 */
export function getTileSymbol(face: TileFace): string {
  if (face.category === 'suit' && face.value) {
    const suitSymbols: Record<string, string> = {
      bamboo: '竹',
      circle: '筒',
      character: '万',
    };
    return `${face.value}${suitSymbols[face.suit!] || ''}`;
  }
  return face.emoji;
}

/**
 * Get category color for tile rendering
 */
export function getTileCategoryColor(face: TileFace): string {
  switch (face.category) {
    case 'suit':
      switch (face.suit) {
        case 'bamboo': return '#22c55e';
        case 'circle': return '#3b82f6';
        case 'character': return '#ef4444';
        default: return '#94a3b8';
      }
    case 'wind': return '#8b5cf6';
    case 'dragon': return '#f59e0b';
    case 'flower': return '#ec4899';
    case 'season': return '#06b6d4';
    default: return '#94a3b8';
  }
}

/**
 * Generate the standard 144-tile set for Mahjong Solitaire.
 * 34 standard faces × 4 copies each = 136 tiles
 * 4 flowers + 4 seasons = 8 bonus tiles
 * Total: 144 tiles
 */
export function generateTileSet(): TileFace[] {
  const tiles: TileFace[] = [];
  
  // Each standard face appears 4 times
  for (const face of STANDARD_FACES) {
    for (let i = 0; i < 4; i++) {
      tiles.push(face);
    }
  }
  
  // Each bonus face appears once
  for (const face of BONUS_FACES) {
    tiles.push(face);
  }
  
  return tiles;
}
