'use client';

// ============================================
// Mahjoom — AI Coach Sidebar
// Streaming Groq insights during gameplay
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { useMoodStore } from '@/store/moodStore';
import { AIGameContext } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  content: string;
  timestamp: number;
}

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const { board, moves, elapsed, hintsUsed, status, getStats } = useGameStore();
  const theme = useMoodStore((s) => s.theme);
  const currentMood = useMoodStore((s) => s.currentMood);
  const lastMoveCount = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchInsight = useCallback(async () => {
    if (!board || status !== 'playing') return;
    const stats = getStats();

    const context: AIGameContext = {
      remainingTiles: stats.remainingTiles,
      totalTiles: board.tiles.length,
      availableMoves: stats.availablePairs,
      recentMoves: moves.slice(-5),
      elapsedTime: elapsed,
      hintsUsed,
      layerDistribution: {},
      mood: currentMood,
      moveEfficiency: stats.efficiency,
    };

    setIsThinking(true);
    setCurrentStream('');

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, type: 'coach' }),
      });

      if (!res.ok || !res.body) throw new Error('No response');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setCurrentStream(full);
      }

      if (full.trim()) {
        const msg: Message = { id: `${Date.now()}`, content: full.trim(), timestamp: Date.now() };
        setMessages((prev) => [...prev.slice(-4), msg]);
      }
    } catch {
      // Fallback offline messages
      const fallbacks = [
        'The board is taking shape. Each move reveals hidden paths.',
        'Patience and pattern recognition unlock even the tightest boards.',
        'Consider what freeing a higher layer might open beneath it.',
        'Your pacing tells a story. Let it unfold.',
      ];
      const content = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setMessages((prev) => [...prev.slice(-4), { id: `${Date.now()}`, content, timestamp: Date.now() }]);
    } finally {
      setIsThinking(false);
      setCurrentStream('');
    }
  }, [board, status, moves, elapsed, hintsUsed, currentMood, getStats]);

  // Trigger insight every 8 moves
  useEffect(() => {
    if (moves.length > 0 && moves.length % 8 === 0 && moves.length !== lastMoveCount.current) {
      lastMoveCount.current = moves.length;
      fetchInsight();
    }
  }, [moves.length, fetchInsight]);

  // First insight after 5 moves
  useEffect(() => {
    if (moves.length === 5) fetchInsight();
  }, [moves.length, fetchInsight]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentStream]);

  return (
    <div
      className="glass flex flex-col rounded-2xl overflow-hidden"
      style={{ width: 260, minHeight: 300, borderColor: `${theme.colors.primary}20` }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: `${theme.colors.primary}15` }}
      >
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: theme.colors.primary }}
        />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: theme.colors.accent }}>
          AI Coach
        </span>
        <span className="text-xs ml-auto" style={{ color: theme.colors.textMuted }}>
          {currentMood.replace('-', ' ')}
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-4">
          {messages.length === 0 && !isThinking && !currentStream && (
            <p className="text-xs leading-relaxed italic" style={{ color: theme.colors.textMuted }}>
              Make a few moves — your coach is watching...
            </p>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-xs leading-relaxed"
                style={{ color: theme.colors.text }}
              >
                <span className="text-xs mr-1" style={{ color: theme.colors.textMuted }}>—</span>
                {msg.content}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Live streaming */}
          {currentStream && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs leading-relaxed"
              style={{ color: theme.colors.text }}
            >
              <span className="text-xs mr-1" style={{ color: theme.colors.textMuted }}>—</span>
              {currentStream}
              <span className="inline-block w-1 h-3 ml-0.5 rounded-sm animate-pulse" style={{ background: theme.colors.primary }} />
            </motion.div>
          )}

          {/* Thinking indicator */}
          {isThinking && !currentStream && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-1 items-center"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: theme.colors.primary }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Manual insight button */}
      <div className="px-4 py-3 border-t" style={{ borderColor: `${theme.colors.primary}15` }}>
        <button
          onClick={fetchInsight}
          disabled={isThinking || status !== 'playing'}
          className="w-full text-xs py-2 rounded-lg transition-all font-medium"
          style={{
            background: `${theme.colors.primary}15`,
            color: isThinking ? theme.colors.textMuted : theme.colors.accent,
            cursor: isThinking ? 'not-allowed' : 'pointer',
            opacity: isThinking ? 0.5 : 1,
          }}
        >
          {isThinking ? 'Observing...' : 'Ask coach'}
        </button>
      </div>
    </div>
  );
}
