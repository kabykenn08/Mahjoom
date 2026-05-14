'use client';

// ============================================
// Mahjoom — Game Board Renderer
// Renders all tiles in 2.5D layered layout
// ============================================

import { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { isTileFree } from '@/core/mahjong/rules';
import { TileComponent } from './TileComponent';
import { Tile } from '@/types';
import { useSound } from '@/hooks/useSound';

const TILE_W = 46;
const TILE_H = 58;
const BOARD_PAD = 24;

interface HintPair {
  id1: string;
  id2: string;
}

export default function GameBoard() {
  const { board, selectedTileId, selectTile, status, moves } = useGameStore();
  const theme = useMoodStore((s) => s.theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hintPair, setHintPair] = useState<HintPair | null>(null);
  const { playSound } = useSound();
  const lastMovesCount = useRef(moves.length);

  // Expose hint setter globally for the controls bar
  useEffect(() => {
    (window as any).__setHint = (pair: HintPair | null) => setHintPair(pair);
    return () => { delete (window as any).__setHint; };
  }, []);

  // Clear hint after 3 seconds
  useEffect(() => {
    if (!hintPair) return;
    const t = setTimeout(() => setHintPair(null), 3000);
    return () => clearTimeout(t);
  }, [hintPair]);

  // Handle sounds for matches and win/loss
  useEffect(() => {
    if (moves.length > lastMovesCount.current) {
      playSound('match', 0.5);
    }
    lastMovesCount.current = moves.length;
  }, [moves.length, playSound]);

  useEffect(() => {
    if (status === 'won') playSound('win', 0.6);
    if (status === 'lost') playSound('lose', 0.5);
  }, [status, playSound]);

  // Calculate board bounds
  const { boardWidth, boardHeight, offsetX, offsetY } = useMemo(() => {
    if (!board) return { boardWidth: 0, boardHeight: 0, offsetX: 0, offsetY: 0 };
    const tiles = board.tiles.filter((t) => !t.isRemoved);
    if (!tiles.length) return { boardWidth: 0, boardHeight: 0, offsetX: 0, offsetY: 0 };

    const maxCol = Math.max(...tiles.map((t) => t.position.col));
    const maxRow = Math.max(...tiles.map((t) => t.position.row));
    const maxLayer = Math.max(...tiles.map((t) => t.position.layer));

    const w = (maxCol + 1) * TILE_W + maxLayer * 3 + BOARD_PAD * 2;
    const h = (maxRow + 1) * TILE_H + maxLayer * 3 + BOARD_PAD * 2;
    return { boardWidth: w, boardHeight: h, offsetX: BOARD_PAD, offsetY: BOARD_PAD };
  }, [board]);

  // Responsive scaling
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !boardWidth) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      const scaleX = width / boardWidth;
      const scaleY = height / boardHeight;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [boardWidth, boardHeight]);

  // Free tiles set for fast lookup
  const freeTileIds = useMemo(() => {
    if (!board) return new Set<string>();
    return new Set(board.tiles.filter((t) => !t.isRemoved && isTileFree(t, board.tiles)).map((t) => t.id));
  }, [board]);

  const handleTileClick = useCallback((id: string) => {
    if (status !== 'playing') return;
    playSound('click', 0.3);
    selectTile(id);
    setHintPair(null);
  }, [status, selectTile, playSound]);

  if (!board) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="glass px-8 py-6 rounded-2xl text-center" style={{ color: theme.colors.textMuted }}>
        <div className="text-4xl mb-3">🀄</div>
        <p className="font-medium">No board loaded</p>
      </div>
    </div>
  );

  // Sort tiles by layer (bottom first, so higher layers render on top)
  const sortedTiles = [...board.tiles].sort((a, b) =>
    a.position.layer - b.position.layer || a.position.row - b.position.row
  );

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center overflow-hidden"
      style={{ minHeight: 0 }}
    >
      <div
        style={{
          width: boardWidth,
          height: boardHeight,
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.3s ease',
        }}
      >
        {sortedTiles.map((tile) => (
          <TileComponent
            key={tile.id}
            tile={tile}
            isFree={freeTileIds.has(tile.id)}
            isSelected={selectedTileId === tile.id}
            isHint={hintPair?.id1 === tile.id || hintPair?.id2 === tile.id}
            tileWidth={TILE_W}
            tileHeight={TILE_H}
            offsetX={offsetX}
            offsetY={offsetY}
            onClick={handleTileClick}
          />
        ))}
      </div>
    </div>
  );
}
