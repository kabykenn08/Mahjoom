'use client';

// ============================================
// Mahjoom — Game Controls Bar
// Undo, Hint, Reshuffle, Pause
// ============================================

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSound } from '@/hooks/useSound';

export default function GameControls() {
  const { undoLastMove, useHint, reshuffle, pauseGame, resumeGame, isPaused, status, moves, undoStack } = useGameStore();
  const theme = useMoodStore((s) => s.theme);
  const { playSound } = useSound();

  const handleHint = () => {
    if (!theme.mechanics.allowHints) return;
    playSound('hint', 0.5);
    const hint = useHint();
    if (hint && (window as any).__setHint) {
      (window as any).__setHint({ id1: hint[0].id, id2: hint[1].id });
    }
  };

  const handleUndo = () => {
    if (!theme.mechanics.allowUndo) return;
    playSound('shuffle', 0.4);
    undoLastMove();
  };

  const handleReshuffle = () => {
    playSound('shuffle', 0.6);
    reshuffle();
  };

  const handlePause = () => {
    playSound('click', 0.3);
    if (isPaused) resumeGame();
    else pauseGame();
  };

  const controls = [
    {
      id: 'undo',
      icon: '↩',
      label: 'Undo',
      tooltip: theme.mechanics.allowUndo ? 'Undo last move' : 'Undo disabled in this mood',
      action: handleUndo,
      disabled: undoStack.length === 0 || !theme.mechanics.allowUndo,
    },
    {
      id: 'hint',
      icon: '💡',
      label: 'Hint',
      tooltip: theme.mechanics.allowHints ? 'Highlight a valid pair' : 'Hints disabled in this mood',
      action: handleHint,
      disabled: status !== 'playing' || !theme.mechanics.allowHints,
    },
    {
      id: 'reshuffle',
      icon: '🔀',
      label: 'Reshuffle',
      tooltip: 'Redistribute remaining tiles',
      action: handleReshuffle,
      disabled: status !== 'playing',
    },
    {
      id: 'pause',
      icon: isPaused ? '▶' : '⏸',
      label: isPaused ? 'Resume' : 'Pause',
      tooltip: isPaused ? 'Resume game' : 'Pause game',
      action: handlePause,
      disabled: status !== 'playing' && status !== 'paused',
    },
    {
      id: 'finish',
      icon: '🏁',
      label: 'Finish',
      tooltip: 'End session and save results',
      action: () => {
        playSound('click', 0.5);
        useGameStore.getState().finishGame(false);
      },
      disabled: status !== 'playing',
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
