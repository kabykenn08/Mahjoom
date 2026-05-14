'use client';

// ============================================
// Mahjoom — Results Overlay
// Win / Loss screen with animated stats + AI reflection
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { AIGameContext } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { saveGameRun } from '@/lib/supabase/queries';
import { getLayerDistribution } from '@/core/mahjong/rules';


function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

interface Props {
  onPlayAgain: () => void;
}

export default function ResultsOverlay({ onPlayAgain }: Props) {
  const { status, moves, elapsed, hintsUsed, reshufflesUsed, board, getStats } = useGameStore();
  const theme = useMoodStore((s) => s.theme);
  const currentMood = useMoodStore((s) => s.currentMood);
  const router = useRouter();
  const [reflection, setReflection] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const isVisible = status === 'won' || status === 'lost';
  const won = status === 'won';
  const stats = board ? getStats() : null;

  useEffect(() => {
    if (!isVisible || !board) return;

    const fetchReflection = async () => {
      const ctx: AIGameContext = {
        remainingTiles: stats?.remainingTiles ?? 0,
        totalTiles: board.tiles.length,
        availableMoves: 0,
        recentMoves: moves,
        elapsedTime: elapsed,
        hintsUsed,
        layerDistribution: getLayerDistribution(board.tiles),
        mood: currentMood,
        moveEfficiency: stats?.efficiency ?? 0,
      };

      setIsStreaming(true);
      setReflection('');

      // Save run to database
      supabase.auth.getUser().then(({ data: { user } }) => {
        saveGameRun({
          userId: user?.id,
          boardSeed: board.seed,
          mood: currentMood,
          duration: elapsed,
          moves: moves.length,
          hintsUsed: hintsUsed,
          won: won,
        });
      });

      try {

        const res = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ context: ctx, type: 'summary', won }),
        });
        if (!res.ok || !res.body) throw new Error();
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let full = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += dec.decode(value, { stream: true });
          setReflection(full);
        }
      } catch {
        setReflection(
          won
            ? 'A clean board. Your patience and pattern recognition opened every path.'
            : 'The board held firm this time. Every blocked game teaches something the won games cannot.'
        );
      } finally {
        setIsStreaming(false);
      }
    };

    const t = setTimeout(fetchReflection, 600);
    return () => clearTimeout(t);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass rounded-3xl p-8 max-w-md w-full"
            style={{ borderColor: `${theme.colors.primary}30` }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Title */}
            <div className="text-center mb-8">
              <motion.div
                className="text-5xl mb-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {won ? '✨' : '🌊'}
              </motion.div>
              <h2 className="font-display text-3xl font-bold" style={{ color: theme.colors.text }}>
                {won ? 'Board Cleared' : 'No More Moves'}
              </h2>
              <p className="text-sm mt-1" style={{ color: theme.colors.textMuted }}>
                {won ? 'A complete session.' : 'The board held its ground.'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Time', value: formatTime(elapsed), icon: '⏱' },
                { label: 'Moves', value: moves.length, icon: '🎯' },
                { label: 'Hints Used', value: hintsUsed, icon: '💡' },
                { label: 'Efficiency', value: `${stats?.efficiency ?? 0}%`, icon: '📊' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  className="glass rounded-xl p-4 text-center"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="font-display text-xl font-bold" style={{ color: theme.colors.text }}>{s.value}</div>
                  <div className="text-xs" style={{ color: theme.colors.textMuted }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* AI Reflection */}
            <motion.div
              className="rounded-2xl p-4 mb-6 text-sm leading-relaxed italic"
              style={{
                background: `${theme.colors.primary}10`,
                color: theme.colors.text,
                borderLeft: `2px solid ${theme.colors.primary}40`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {reflection || (
                <span className="flex gap-1 items-center" style={{ color: theme.colors.textMuted }}>
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: theme.colors.primary }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </span>
              )}
              {isStreaming && (
                <span className="inline-block w-1 h-3 ml-0.5 rounded-sm animate-pulse" style={{ background: theme.colors.primary }} />
              )}
            </motion.div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={onPlayAgain}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  color: '#fff',
                  boxShadow: `0 4px 16px ${theme.colors.tileGlow}`,
                }}
              >
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/')}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm glass"
                style={{ color: theme.colors.text }}
              >
                Main Menu
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
