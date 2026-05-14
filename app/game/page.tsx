'use client';

// ============================================
// Mahjoom — Game Page
// Full game session screen
// ============================================

import { useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { useAuth } from '@/hooks/useAuth';
import { generateSolvableBoard, generateDailyBoard } from '@/core/mahjong/generator';
import { TURTLE_LAYOUT } from '@/core/mahjong/board';
import GameBoard from '@/components/game/GameBoard';
import GameControls from '@/components/game/GameControls';
import GameTimer from '@/components/game/GameTimer';
import GameStats from '@/components/game/GameStats';
import AICoach from '@/components/game/AICoach';
import MoodMechanicsInfo from '@/components/game/MoodMechanicsInfo';
import ResultsOverlay from '@/components/game/ResultsOverlay';
import AmbientBackground from '@/components/effects/AmbientBackground';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const mode = searchParams.get('mode');
  const { initGame, resetGame, board, status, isPaused, resumeGame } = useGameStore();
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
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && (!board || status === 'idle' || status === 'won' || status === 'lost')) {
      startNewGame();
    }
  }, [authLoading, isAuthenticated, board, status, startNewGame, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-2xl animate-pulse">🀄</div>
      </div>
    );
  }

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
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs glass px-4 py-2 rounded-full font-bold flex items-center gap-2"
              style={{ 
                color: mode === 'daily' ? '#fbbf24' : theme.colors.accent,
                borderColor: mode === 'daily' ? '#fbbf2440' : `${theme.colors.primary}20`,
                boxShadow: mode === 'daily' ? '0 0 20px #fbbf2415' : 'none'
              }}>
              {mode === 'daily' ? (
                <>
                  <span className="text-sm">🏆</span>
                  <span>GLOBAL DAILY CHALLENGE</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span className="uppercase tracking-widest">{currentMood.replace('-', ' ')} SESSION</span>
                </>
              )}
            </motion.div>
          </div>

          {/* Board */}
          <div className="flex-1 glass rounded-2xl overflow-hidden min-h-0">
            <GameBoard />
          </div>
        </motion.div>

        {/* AI Coach sidebar — hidden on mobile */}
        <motion.aside
          className="hidden lg:flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AICoach />
          <MoodMechanicsInfo />
        </motion.aside>
      </div>

      {/* Pause Menu Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border-none"
            >
              <div className="w-20 h-20 rounded-3xl glass mx-auto mb-6 flex items-center justify-center text-4xl"
                style={{ color: theme.colors.primary, borderColor: `${theme.colors.primary}40` }}>
                ⏸
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: theme.colors.text }}>Paused</h2>
              <p className="text-sm mb-8" style={{ color: theme.colors.textMuted }}>Take a breath. The tiles will wait.</p>
              
              <div className="space-y-3">
                <button 
                  onClick={resumeGame}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                >
                  Continue Journey
                </button>
                <button 
                  onClick={() => useGameStore.getState().finishGame(false)}
                  className="w-full py-4 rounded-2xl glass text-sm font-bold hover:bg-white/5 transition-all"
                  style={{ color: theme.colors.accent }}
                >
                  End & Save Session
                </button>
                <button 
                  onClick={() => {
                    useGameStore.getState().resetGame();
                    router.push('/');
                  }}
                  className="w-full py-2 text-[10px] uppercase tracking-widest font-black opacity-40 hover:opacity-100 transition-opacity mt-4"
                  style={{ color: theme.colors.text }}
                >
                  Quit to Menu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
