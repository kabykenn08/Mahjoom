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
    duration: (10 + i * 2) / Math.max(0.7, speed), // Ensure it's not too slow
    rotate: (i * 25) % 360,
  }));

  // Increase baseline intensity for better visibility in all moods
  const motionIntensity = Math.max(0.5, intensity);
  const opacityIntensity = Math.max(0.6, intensity);

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
            opacity: opacityIntensity * 0.3, // Baseline visibility
            borderColor: `${theme.colors.primary}30`,
            boxShadow: `0 0 15px ${theme.colors.tileGlow}`,
          }}
          animate={{
            y: [0, -40 * motionIntensity, 30 * motionIntensity, 0],
            x: [0, 20 * motionIntensity, -15 * motionIntensity, 0],
            rotate: [tile.rotate, tile.rotate + 12, tile.rotate - 8, tile.rotate],
            opacity: [opacityIntensity * 0.2, opacityIntensity * 0.5, opacityIntensity * 0.2],
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
