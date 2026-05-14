'use client';

// ============================================
// Mahjoom — Game Stats Bar
// Shows remaining tiles, moves, efficiency
// ============================================

import { useMoodStore } from '@/store/moodStore';
import { useGameStore } from '@/store/gameStore';

export default function GameStats() {
  const theme = useMoodStore((s) => s.theme);
  const { board, moves, hintsUsed, getStats } = useGameStore();

  if (!board) return null;
  const stats = getStats();
  const totalTiles = board.tiles.length;
  const pct = Math.round(((totalTiles - stats.remainingTiles) / totalTiles) * 100);

  const items = [
    { label: 'Remaining', value: stats.remainingTiles },
    { label: 'Moves', value: moves.length },
    { label: 'Hints', value: hintsUsed },
    { label: 'Cleared', value: `${pct}%` },
  ];

  return (
    <div className="flex items-center gap-4">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <div className="font-display text-lg font-semibold tabular-nums" style={{ color: theme.colors.text }}>
            {item.value}
          </div>
          <div className="text-xs" style={{ color: theme.colors.textMuted }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
