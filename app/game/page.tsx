'use client';

// ============================================
// Mahjoom — Game Page
// Full game session screen
// ============================================

import { useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { generateSolvableBoard, generateDailyBoard } from '@/core/mahjong/generator';
import { TURTLE_LAYOUT } from '@/core/mahjong/board';
import GameBoard from '@/components/game/GameBoard';
import GameControls from '@/components/game/GameControls';
import GameTimer from '@/components/game/GameTimer';
import GameStats from '@/components/game/GameStats';
import AICoach from '@/components/game/AICoach';
import ResultsOverlay from '@/components/game/ResultsOverlay';
import AmbientBackground from '@/components/effects/AmbientBackground';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');
  const { initGame, resetGame, board, status } = useGameStore();
  const { currentMood, theme } = useMoodStore();

  const startNewGame = useCallback(() => {
    const seed = mode === 'daily'
      ? `daily-${new Date().toISOString().split('T')[0]}`
      : `game-${Date.now()}`;

    const newBoard = mode === 'daily'
      ? generateDailyBoard()
      : generateSolvableBoard(TURTLE_LAYOUT, seed, 'medium');

    initGame(newBoard, 'medium');
  }, [mode, initGame]);

  useEffect(() => {
    if (!board || status === 'idle') {
      startNewGame();
    }
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    startNewGame();
  };

  return (
    <div className="relative min-h-dvh flex flex-col overflow-hidden">
      <AmbientBackground mood={currentMood} />

      {/* Results overlay */}
      <ResultsOverlay onPlayAgain={handlePlayAgain} />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-4 glass"
        style={{ borderBottom: `1px solid ${theme.colors.primary}15` }}
      >
        {/* Logo */}
        <button
          onClick={() => router.push('/')}
          className="font-display text-xl font-bold"
          style={{ color: theme.colors.text }}
        >
          Mahj<span style={{ color: theme.colors.primary }}>oom</span>
        </button>

        {/* Center: Timer */}
        <GameTimer />

        {/* Right: Controls */}
        <GameControls />
      </motion.header>

      {/* Main layout */}
      <div className="relative z-10 flex flex-1 min-h-0 gap-4 p-4">
        {/* Board */}
        <motion.div
          className="flex-1 flex flex-col min-h-0"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Stats bar */}
          <div className="flex items-center justify-between mb-3 px-2">
            <GameStats />
            <div className="text-xs glass px-3 py-1.5 rounded-full font-medium"
              style={{ color: theme.colors.accent }}>
              {mode === 'daily' ? '📅 Daily Challenge' : `${currentMood.replace('-', ' ')} mode`}
            </div>
          </div>

          {/* Board */}
          <div className="flex-1 glass rounded-2xl overflow-hidden min-h-0">
            <GameBoard />
          </div>
        </motion.div>

        {/* AI Coach sidebar — hidden on mobile */}
        <motion.aside
          className="hidden lg:flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AICoach />
        </motion.aside>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-2xl animate-pulse">🀄</div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
