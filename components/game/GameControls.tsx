'use client';

// ============================================
// Mahjoom — Game Controls Bar
// Undo, Hint, Reshuffle, Pause
// ============================================

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function GameControls() {
  const { undoLastMove, useHint, reshuffle, pauseGame, resumeGame, isPaused, status, moves, undoStack } = useGameStore();
  const theme = useMoodStore((s) => s.theme);

  const handleHint = () => {
    const hint = useHint();
    if (hint && (window as any).__setHint) {
      (window as any).__setHint({ id1: hint[0].id, id2: hint[1].id });
    }
  };

  const controls = [
    {
      id: 'undo',
      icon: '↩',
      label: 'Undo',
      tooltip: 'Undo last move',
      action: undoLastMove,
      disabled: undoStack.length === 0,
    },
    {
      id: 'hint',
      icon: '💡',
      label: 'Hint',
      tooltip: 'Highlight a valid pair',
      action: handleHint,
      disabled: status !== 'playing',
    },
    {
      id: 'reshuffle',
      icon: '🔀',
      label: 'Reshuffle',
      tooltip: 'Redistribute remaining tiles',
      action: reshuffle,
      disabled: status !== 'playing',
    },
    {
      id: 'pause',
      icon: isPaused ? '▶' : '⏸',
      label: isPaused ? 'Resume' : 'Pause',
      tooltip: isPaused ? 'Resume game' : 'Pause game',
      action: isPaused ? resumeGame : pauseGame,
      disabled: status !== 'playing' && status !== 'paused',
    },
  ];

  return (
    <div className="flex items-center gap-2">
      {controls.map((ctrl) => (
        <Tooltip key={ctrl.id}>
          <TooltipTrigger
            disabled={ctrl.disabled}
            onClick={ctrl.action}
            id={`ctrl-${ctrl.id}`}
            aria-label={ctrl.tooltip}
            className="glass flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              color: ctrl.disabled ? theme.colors.textMuted : theme.colors.text,
              borderColor: `${theme.colors.primary}20`,
            }}
          >
            <motion.div
              className="flex items-center gap-1.5"
              whileHover={!ctrl.disabled ? { scale: 1.08, y: -1 } : {}}
              whileTap={!ctrl.disabled ? { scale: 0.94 } : {}}
            >
              <span className="text-base leading-none">{ctrl.icon}</span>
              <span className="hidden sm:inline text-xs">{ctrl.label}</span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">{ctrl.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
