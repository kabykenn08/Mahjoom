'use client';

// ============================================
// Mahjoom — Tile Component
// Single tile with states, animations, depth
// ============================================

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tile } from '@/types';
import { getTileSymbol, getTileCategoryColor } from '@/core/mahjong/tiles';
import { useMoodStore } from '@/store/moodStore';

interface TileComponentProps {
  tile: Tile;
  isFree: boolean;
  isSelected: boolean;
  isHint: boolean;
  tileWidth: number;
  tileHeight: number;
  offsetX: number;
  offsetY: number;
  onClick: (id: string) => void;
}

const DEPTH_OFFSET = 3; // px per layer for 3D illusion

export const TileComponent = memo(function TileComponent({
  tile,
  isFree,
  isSelected,
  isHint,
  tileWidth,
  tileHeight,
  offsetX,
  offsetY,
  onClick,
}: TileComponentProps) {
  const theme = useMoodStore((s) => s.theme);
  const { col, row, layer } = tile.position;

  // Position with layer-based depth offset
  const x = offsetX + col * tileWidth + layer * DEPTH_OFFSET;
  const y = offsetY + row * tileHeight - layer * DEPTH_OFFSET;
  const zIndex = layer * 10 + (isSelected ? 100 : 0);

  const faceColor = useMemo(() => getTileCategoryColor(tile.face), [tile.face]);
  const symbol = useMemo(() => getTileSymbol(tile.face), [tile.face]);

  // Tile background — layered effect using box-shadows
  const tileStyle: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: tileWidth,
    height: tileHeight,
    zIndex,
    borderRadius: 6,
    cursor: isFree ? 'pointer' : 'not-allowed',
    userSelect: 'none',
    willChange: 'transform',
  };

  const innerBg = isSelected
    ? `linear-gradient(145deg, color-mix(in srgb, ${theme.colors.primary} 20%, #1e2535), #111827)`
    : `linear-gradient(145deg, #1e2535, #111827)`;

  const borderColor = isSelected
    ? theme.colors.primary
    : isHint
    ? '#f59e0b'
    : isFree
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(255,255,255,0.05)';

  const boxShadow = isSelected
    ? `0 0 0 2px ${theme.colors.primary}, 0 8px 24px ${theme.colors.tileGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`
    : isHint
    ? `0 0 0 2px #f59e0b, 0 4px 16px rgba(245,158,11,0.4), inset 0 1px 0 rgba(255,255,255,0.1)`
    : isFree
    ? `0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
    : `0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`;

  if (tile.isRemoved) return null;

  return (
    <AnimatePresence>
      <motion.div
        style={tileStyle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6, y: -10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        whileHover={isFree ? { y: -3, scale: 1.03 } : {}}
        whileTap={isFree ? { scale: 0.97 } : {}}
        onClick={() => isFree && onClick(tile.id)}
        aria-label={`${tile.face.label} tile, ${isFree ? 'available' : 'blocked'}`}
        role="button"
        tabIndex={isFree ? 0 : -1}
        onKeyDown={(e) => e.key === 'Enter' && isFree && onClick(tile.id)}
      >
        {/* Tile body */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 6,
            background: innerBg,
            border: `1px solid ${borderColor}`,
            boxShadow,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          {/* Shimmer overlay for selected */}
          {isSelected && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, transparent 30%, ${theme.colors.primary}15 50%, transparent 70%)`,
              }}
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* Symbol */}
          <span
            style={{
              fontSize: tileWidth < 36 ? 10 : tileWidth < 48 ? 13 : 16,
              fontWeight: '600',
              fontFamily: 'var(--font-display)',
              color: isFree ? faceColor : `${faceColor}60`,
              lineHeight: 1,
              filter: isFree ? 'none' : 'blur(0.3px)',
              transition: 'color 0.15s ease',
            }}
          >
            {symbol}
          </span>

          {/* Layer depth indicator (bottom edge) */}
          <div
            style={{
              position: 'absolute',
              bottom: -3,
              left: 2,
              right: 2,
              height: 3,
              borderRadius: '0 0 4px 4px',
              background: isSelected
                ? theme.colors.primary
                : 'rgba(0,0,0,0.5)',
            }}
          />

          {/* Right edge depth */}
          <div
            style={{
              position: 'absolute',
              right: -3,
              top: 2,
              bottom: 2,
              width: 3,
              borderRadius: '0 4px 4px 0',
              background: isSelected
                ? `${theme.colors.primary}80`
                : 'rgba(0,0,0,0.4)',
            }}
          />

          {/* Blocked overlay */}
          {!isFree && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                background: 'rgba(0,0,0,0.35)',
              }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
});
