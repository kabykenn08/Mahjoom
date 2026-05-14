'use client';

// ============================================
// Mahjoom — Floating Tiles Effect
// Ambient tiles that drift across the screen
// ============================================

import { motion } from 'framer-motion';
import { MoodType } from '@/types';
import { getMoodTheme } from '@/lib/moods';

const TILE_SYMBOLS = ['一', '二', '三', '🎋', '⭕', '🐉', '🌸', '🌙', '⚡', '竹', '筒', '万'];

interface Props {
  mood: MoodType;
  count?: number;
}

export default function FloatingTiles({ mood, count = 8 }: Props) {
  const theme = getMoodTheme(mood);
  const speed = theme.animation.speed;
  const intensity = theme.animation.backgroundMotion;

  const tiles = Array.from({ length: count }, (_, i) => ({
    symbol: TILE_SYMBOLS[i % TILE_SYMBOLS.length],
    startX: `${(i * 13 + 5) % 90}%`,
    startY: `${(i * 17 + 10) % 80}%`,
    delay: i * 0.8,
    duration: (8 + i * 1.5) / speed,
    rotate: (i * 25) % 360,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {tiles.map((tile, i) => (
        <motion.div
          key={i}
          className="absolute glass flex items-center justify-center font-display text-sm rounded-lg select-none"
          style={{
            left: tile.startX,
            top: tile.startY,
            width: 44,
            height: 56,
            color: theme.colors.primary,
            opacity: intensity * 0.5,
            borderColor: `${theme.colors.primary}20`,
            boxShadow: `0 0 10px ${theme.colors.tileGlow}`,
          }}
          animate={{
            y: [0, -30 * intensity, 20 * intensity, 0],
            x: [0, 15 * intensity, -10 * intensity, 0],
            rotate: [tile.rotate, tile.rotate + 8, tile.rotate - 5, tile.rotate],
            opacity: [intensity * 0.3, intensity * 0.6, intensity * 0.3],
          }}
          transition={{
            duration: tile.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: tile.delay,
          }}
        >
          {tile.symbol}
        </motion.div>
      ))}
    </div>
  );
}
