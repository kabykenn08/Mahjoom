'use client';

// ============================================
// Mahjoom — Game Timer
// Counts up elapsed time during gameplay
// ============================================

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function GameTimer() {
  const { status, elapsed, incrementElapsed, isPaused } = useGameStore();
  const theme = useMoodStore((s) => s.theme);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'playing' && !isPaused) {
      intervalRef.current = setInterval(() => {
        incrementElapsed();
      }, 1000 / theme.mechanics.timeScale);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [status, isPaused, incrementElapsed]);

  return (
    <div className="font-display text-2xl font-semibold tabular-nums" style={{ color: theme.colors.text }}>
      {formatTime(elapsed)}
    </div>
  );
}
