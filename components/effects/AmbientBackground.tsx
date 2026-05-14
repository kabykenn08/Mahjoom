'use client';

// ============================================
// Mahjoom — Ambient Background Effect
// Mood-adaptive animated gradient orbs
// ============================================

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MoodType } from '@/types';
import { getMoodTheme } from '@/lib/moods';

interface Props {
  mood: MoodType;
}

export default function AmbientBackground({ mood }: Props) {
  const theme = getMoodTheme(mood);
  const speed = theme.animation.speed;

  const orbs = [
    { x: '10%', y: '20%', size: 600, delay: 0 },
    { x: '70%', y: '60%', size: 500, delay: 2 },
    { x: '40%', y: '80%', size: 400, delay: 4 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: theme.colors.backgroundGradient }}
      />

      {/* Animated orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${theme.colors.primary}18 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30 * speed, -20 * speed, 0],
            y: [0, -20 * speed, 30 * speed, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: (12 / speed) + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}

      {/* Subtle noise overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px',
        }}
      />
    </div>
  );
}
