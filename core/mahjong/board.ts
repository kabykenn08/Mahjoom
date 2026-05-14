// ============================================
// Mahjoom — Board Layouts
// Position definitions for tile arrangements
// ============================================

import { TilePosition, BoardLayout } from '@/types';

/**
 * The classic Turtle layout — the standard Mahjong Solitaire arrangement.
 * 144 tiles arranged in a multi-layered structure.
 * 
 * Layers (bottom to top):
 * Layer 0: Base — 12×8 with some gaps
 * Layer 1: 10×6 centered
 * Layer 2: 8×4 centered
 * Layer 3: 6×2 centered
 * Layer 4: Cap — single tile on top
 */
function generateTurtlePositions(): TilePosition[] {
  const positions: TilePosition[] = [];

  // Layer 0 — Base (12 cols × 8 rows, minus corners = ~86 tiles)
  // Row pattern for the turtle shape
  const layer0Rows: [number, number][] = [
    [1, 12],  // row 0: cols 1-12
    [0, 13],  // row 1: cols 0-13 (wider)
    [0, 13],  // row 2
    [0, 13],  // row 3
    [0, 13],  // row 4
    [0, 13],  // row 5
    [1, 12],  // row 6
    [3, 10],  // row 7: narrow
  ];

  for (let row = 0; row < layer0Rows.length; row++) {
    const [startCol, endCol] = layer0Rows[row];
    for (let col = startCol; col < endCol; col++) {
      positions.push({ col, row, layer: 0 });
    }
  }

  // Layer 1 — (10×6 centered)
  for (let row = 1; row < 7; row++) {
    for (let col = 2; col < 12; col++) {
      positions.push({ col, row, layer: 1 });
    }
  }

  // Layer 2 — (8×4 centered)
  for (let row = 2; row < 6; row++) {
    for (let col = 3; col < 11; col++) {
      positions.push({ col, row, layer: 2 });
    }
  }

  // Layer 3 — (6×2 centered)
  for (let row = 3; row < 5; row++) {
    for (let col = 4; col < 10; col++) {
      positions.push({ col, row, layer: 3 });
    }
  }

  // Layer 4 — Cap (single tile at center)
  positions.push({ col: 7, row: 3, layer: 4 });

  return positions;
}

/**
 * Fortress layout — a symmetrical fortified structure
 */
function generateFortressPositions(): TilePosition[] {
  const positions: TilePosition[] = [];

  // Layer 0 — Wide base with fortress walls
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 14; col++) {
      // Create fortress shape with openings
      if (row === 0 || row === 7) {
        if (col >= 2 && col < 12) positions.push({ col, row, layer: 0 });
      } else if (row === 1 || row === 6) {
        if (col >= 1 && col < 13) positions.push({ col, row, layer: 0 });
      } else {
        positions.push({ col, row, layer: 0 });
      }
    }
  }

  // Layer 1
  for (let row = 1; row < 7; row++) {
    for (let col = 2; col < 12; col++) {
      positions.push({ col, row, layer: 1 });
    }
  }

  // Layer 2
  for (let row = 2; row < 6; row++) {
    for (let col = 4; col < 10; col++) {
      positions.push({ col, row, layer: 2 });
    }
  }

  // Layer 3 — small cap
  for (let row = 3; row < 5; row++) {
    for (let col = 5; col < 9; col++) {
      positions.push({ col, row, layer: 3 });
    }
  }

  return positions;
}

/**
 * Pyramid layout — ascending pyramid structure
 */
function generatePyramidPositions(): TilePosition[] {
  const positions: TilePosition[] = [];

  // Each layer gets progressively smaller
  const layerSpecs: { rows: number; cols: number; offsetRow: number; offsetCol: number }[] = [
    { rows: 8, cols: 12, offsetRow: 0, offsetCol: 0 },
    { rows: 6, cols: 10, offsetRow: 1, offsetCol: 1 },
    { rows: 4, cols: 8, offsetRow: 2, offsetCol: 2 },
    { rows: 2, cols: 6, offsetRow: 3, offsetCol: 3 },
    { rows: 2, cols: 2, offsetRow: 3, offsetCol: 5 },
  ];

  for (let layer = 0; layer < layerSpecs.length; layer++) {
    const spec = layerSpecs[layer];
    for (let row = 0; row < spec.rows; row++) {
      for (let col = 0; col < spec.cols; col++) {
        positions.push({
          col: col + spec.offsetCol,
          row: row + spec.offsetRow,
          layer,
        });
      }
    }
  }

  return positions;
}

/**
 * Trim positions to exactly the target count by removing from edges.
 * This ensures we always have an even number of positions for tile pairing.
 */
function trimPositions(positions: TilePosition[], targetCount: number): TilePosition[] {
  if (positions.length <= targetCount) return positions;

  // Sort by distance from center (remove furthest first)
  const centerCol = positions.reduce((sum, p) => sum + p.col, 0) / positions.length;
  const centerRow = positions.reduce((sum, p) => sum + p.row, 0) / positions.length;

  const sorted = [...positions].sort((a, b) => {
    const distA = Math.sqrt(Math.pow(a.col - centerCol, 2) + Math.pow(a.row - centerRow, 2));
    const distB = Math.sqrt(Math.pow(b.col - centerCol, 2) + Math.pow(b.row - centerRow, 2));
    return distA - distB; // closest to center first
  });

  return sorted.slice(0, targetCount);
}

/**
 * Ensure position count is even (required for pairing)
 */
function ensureEven(positions: TilePosition[]): TilePosition[] {
  if (positions.length % 2 !== 0) {
    return positions.slice(0, -1);
  }
  return positions;
}

// ---- Exported Layouts ----

export const TURTLE_LAYOUT: BoardLayout = {
  name: 'turtle',
  positions: ensureEven(trimPositions(generateTurtlePositions(), 144)),
  displayName: 'Turtle',
  difficulty: 3,
  description: 'The classic Mahjong Solitaire arrangement',
};

export const FORTRESS_LAYOUT: BoardLayout = {
  name: 'fortress',
  positions: ensureEven(trimPositions(generateFortressPositions(), 144)),
  displayName: 'Fortress',
  difficulty: 4,
  description: 'A fortified symmetrical challenge',
};

export const PYRAMID_LAYOUT: BoardLayout = {
  name: 'pyramid',
  positions: ensureEven(trimPositions(generatePyramidPositions(), 144)),
  displayName: 'Pyramid',
  difficulty: 2,
  description: 'Ascending layers of increasing complexity',
};

export const ALL_LAYOUTS: BoardLayout[] = [
  TURTLE_LAYOUT,
  FORTRESS_LAYOUT,
  PYRAMID_LAYOUT,
];

export function getLayout(name: string): BoardLayout {
  return ALL_LAYOUTS.find(l => l.name === name) || TURTLE_LAYOUT;
}
