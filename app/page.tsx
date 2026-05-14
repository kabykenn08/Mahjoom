'use client';

// ============================================
// Mahjoom — Landing Page (Home)
// Cinematic hero with mood selection
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMoodStore } from '@/store/moodStore';
import { useAuth } from '@/hooks/useAuth';
import { MOOD_ORDER } from '@/lib/moods';
import { MoodType } from '@/types';
import { getMoodTheme } from '@/lib/moods';
import AmbientBackground from '@/components/effects/AmbientBackground';
import FloatingTiles from '@/components/effects/FloatingTiles';
import HowToPlay from '@/components/game/HowToPlay';

const MOOD_ICONS: Record<MoodType, string> = {

  focus: '🎯',
  relax: '🌊',
  'deep-work': '⚡',
  'anxiety-reset': '🌿',
  'creative-flow': '✨',
  'night-wind-down': '🌙',
};

const MOOD_NAMES: Record<MoodType, string> = {
  focus: 'Focus',
  relax: 'Relax',
  'deep-work': 'Deep Work',
  'anxiety-reset': 'Anxiety Reset',
  'creative-flow': 'Creative Flow',
  'night-wind-down': 'Night Wind-Down',
};

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { currentMood, setMood } = useMoodStore();
  const [hoveredMood, setHoveredMood] = useState<MoodType | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const activeMood = hoveredMood || currentMood;
  const activeTheme = getMoodTheme(activeMood);

  const handlePlay = () => {
    if (isAuthenticated) {
      router.push('/game');
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden flex flex-col">
      <AmbientBackground mood={activeMood} />
      <FloatingTiles mood={activeMood} />
      <HowToPlay open={showHelp} onOpenChange={setShowHelp} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-2xl font-bold tracking-tight"
          style={{ color: activeTheme.colors.text }}
        >
          Mahj<span style={{ color: activeTheme.colors.primary }}>oom</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => setShowHelp(true)}
            className="text-sm font-medium transition-colors"
            style={{ color: activeTheme.colors.textMuted }}
          >
            How to Play
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-sm font-medium transition-colors"
            style={{ color: activeTheme.colors.textMuted }}
          >
            Leaderboard
          </button>

          {!authLoading && (
            <>
              {isAuthenticated ? (
                <button
                  onClick={() => router.push('/profile')}
                  className="glass px-4 py-2 text-sm font-medium rounded-full btn-magnetic transition-all"
                  style={{
                    color: activeTheme.colors.text,
                    borderColor: `${activeTheme.colors.primary}40`,
                  }}
                >
                  My Profile
                </button>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="glass px-4 py-2 text-sm font-medium rounded-full btn-magnetic transition-all"
                  style={{
                    color: activeTheme.colors.text,
                    borderColor: `${activeTheme.colors.primary}40`,
                  }}
                >
                  Sign In
                </button>
              )}
            </>
          )}
        </motion.div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{ color: activeTheme.colors.accent }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeTheme.colors.primary }} />
            AI-Powered Mindful Mahjong
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-6xl md:text-8xl font-bold leading-none tracking-tighter mb-6">
            <span className="text-gradient">One game.</span>
            <br />
            <span style={{ color: activeTheme.colors.text }}>Your mind.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl max-w-lg mx-auto mb-12 leading-relaxed"
            style={{ color: activeTheme.colors.textMuted }}
          >
            {activeTheme.description}
          </p>

          {/* Mood Selector */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: activeTheme.colors.textMuted }}>
              Choose your mood
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {MOOD_ORDER.map((mood) => {
                const theme = getMoodTheme(mood);
                const isActive = currentMood === mood;
                return (
                  <motion.button
                    key={mood}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setMood(mood)}
                    onMouseEnter={() => setHoveredMood(mood)}
                    onMouseLeave={() => setHoveredMood(null)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium glass transition-all"
                    style={{
                      color: isActive ? theme.colors.primary : theme.colors.textMuted,
                      borderColor: isActive ? `${theme.colors.primary}60` : 'transparent',
                      boxShadow: isActive ? `0 0 16px ${theme.colors.tileGlow}` : 'none',
                    }}
                    id={`mood-btn-${mood}`}
                    aria-pressed={isActive}
                  >
                    <span>{MOOD_ICONS[mood]}</span>
                    <span>{MOOD_NAMES[mood]}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlay}
              id="play-btn"
              className="px-10 py-4 rounded-2xl font-display font-semibold text-lg relative overflow-hidden transition-all"
              style={{
                background: `linear-gradient(135deg, ${activeTheme.colors.primary}, ${activeTheme.colors.secondary})`,
                color: '#fff',
                boxShadow: `0 8px 32px ${activeTheme.colors.tileGlow}, 0 2px 8px rgba(0,0,0,0.4)`,
              }}
            >
              <span className="relative z-10">Begin Session</span>
              <motion.div
                className="absolute inset-0 opacity-0 hover:opacity-20"
                style={{ background: 'white' }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(isAuthenticated ? '/game?mode=daily' : '/login')}
              className="px-8 py-4 rounded-2xl font-medium text-base glass btn-magnetic"
              style={{ color: activeTheme.colors.text }}
            >
              Today&rsquo;s Challenge
            </motion.button>
          </div>
        </motion.div>

        {/* Features Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap gap-8 justify-center mt-20"
        >
          {[
            { icon: '🧠', label: 'AI Coach', desc: 'Strategic insights, not tips' },
            { icon: '🎭', label: '6 Moods', desc: 'Adaptive atmosphere' },
            { icon: '📊', label: 'Analytics', desc: 'Know your style' },
            { icon: '🏆', label: 'Daily Boards', desc: 'One puzzle, global stage' },
          ].map((f) => (
            <div key={f.label} className="text-center" style={{ color: activeTheme.colors.textMuted }}>
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-sm font-medium" style={{ color: activeTheme.colors.text }}>{f.label}</div>
              <div className="text-xs">{f.desc}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
