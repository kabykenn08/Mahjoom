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
import DynamicIcon from '@/components/ui/DynamicIcon';
import { Brain, Palette, BarChart3, Trophy, Play } from 'lucide-react';

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
    <main className="relative min-h-dvh overflow-hidden flex flex-col selection:bg-white/10">
      <AmbientBackground mood={activeMood} />
      <FloatingTiles mood={activeMood} />
      <HowToPlay open={showHelp} onOpenChange={setShowHelp} />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group cursor-pointer"
          onClick={() => router.push('/')}
        >
          <div className="font-display text-2xl font-black tracking-tighter transition-all group-hover:scale-105"
            style={{ color: activeTheme.colors.text }}>
            Mahj<span style={{ color: activeTheme.colors.primary }}>oom</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-7"
        >
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setShowHelp(true)}
              className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30 hover:opacity-100 transition-all"
              style={{ color: activeTheme.colors.text }}
            >
              The Way
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30 hover:opacity-100 transition-all"
              style={{ color: activeTheme.colors.text }}
            >
              Hall of Zen
            </button>
          </div>

          {!authLoading && (
            <div className="h-7 w-[1px] bg-white/10 hidden md:block" />
          )}

          {!authLoading && (
            <button
              onClick={() => router.push(isAuthenticated ? '/profile' : '/login')}
              className="group relative flex items-center gap-3 px-1 py-1 pr-5 rounded-full glass border-white/5 hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs overflow-hidden border border-white/10">
                {isAuthenticated ? '👤' : '✨'}
              </div>
              <span className="text-[10px] uppercase tracking-widest font-black" style={{ color: activeTheme.colors.text }}>
                {isAuthenticated ? 'My Sanctuary' : 'Enter Gate'}
              </span>
            </button>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 glass px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border-white/5 shadow-xl"
            style={{ color: activeTheme.colors.accent }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: activeTheme.colors.primary }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: activeTheme.colors.primary }}></span>
            </span>
            A Sanctuary for your Senses
          </motion.div>

          {/* Title */}
          <h1 className="font-display text-6xl md:text-[5rem] font-black leading-[0.85] tracking-[-0.03em] mb-6 select-none">
            <span className="text-white opacity-90">Master the</span>
            <br />
            <span className="text-gradient">Mental Flow</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg max-w-lg mx-auto mb-12 font-medium leading-relaxed opacity-50 px-4"
            style={{ color: activeTheme.colors.text }}
          >
            {activeTheme.description.replace('One tile at a time.', 'Rediscover focus in a world of noise.')}
          </p>

          {/* Mood Ritual Selector */}
          <div className="mb-12 relative">
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto relative z-10">
              {MOOD_ORDER.map((mood, i) => {
                const theme = getMoodTheme(mood);
                const isActive = currentMood === mood;
                return (
                  <motion.button
                    key={mood}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMood(mood)}
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest glass transition-all border-white/5"
                    style={{
                      background: isActive ? `${theme.colors.primary}20` : 'rgba(255,255,255,0.02)',
                      color: isActive ? theme.colors.text : theme.colors.textMuted,
                      borderColor: isActive ? `${theme.colors.primary}40` : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <DynamicIcon name={theme.icon} size={16} strokeWidth={3} />
                    <span>{MOOD_NAMES[mood]}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center relative z-20">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlay}
              className="group px-10 py-4.5 rounded-[2rem] font-display font-black text-lg relative overflow-hidden transition-all shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${activeTheme.colors.primary}, ${activeTheme.colors.secondary})`,
                color: '#fff',
              }}
            >
              <div className="relative z-10 flex items-center gap-3">
                <span>Begin Session</span>
                <Play size={18} fill="currentColor" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(isAuthenticated ? '/game?mode=daily' : '/login')}
              className="px-8 py-4.5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] glass border-white/5 hover:bg-white/5 transition-all"
              style={{ color: activeTheme.colors.text }}
            >
              The Daily Trial
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
