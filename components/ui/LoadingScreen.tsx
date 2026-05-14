'use client';

import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';
import AmbientBackground from '@/components/effects/AmbientBackground';
import FloatingTiles from '@/components/effects/FloatingTiles';
import { MoodType } from '@/types';

interface LoadingScreenProps {
  message?: string;
  mood?: MoodType;
}

export default function LoadingScreen({ 
  message = "Synchronizing...", 
  mood 
}: LoadingScreenProps) {
  const { currentMood, theme } = useMoodStore();
  const activeMood = mood || currentMood;
  const activeTheme = theme; // This might be slightly stale if mood just changed, but it's fine for loading

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020205] overflow-hidden">
      <AmbientBackground mood={activeMood} />
      <FloatingTiles mood={activeMood} count={6} />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Tile Stack */}
        <div className="relative w-24 h-32 mb-10">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                y: [-i * 4, -i * 4 - 10, -i * 4],
                rotate: [i * 5, i * 5 + 5, i * 5],
                scale: [0.95, 1, 0.95]
              }}
              transition={{
                duration: 3,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 glass rounded-xl flex items-center justify-center text-4xl shadow-2xl border-white/10"
              style={{ 
                zIndex: 3 - i,
                color: activeTheme.colors.primary,
                boxShadow: `0 0 40px ${activeTheme.colors.primary}20`,
                backdropFilter: 'blur(12px)'
              }}
            >
              {i === 0 ? '🀄' : i === 1 ? '✨' : '🏮'}
            </motion.div>
          ))}
          
          {/* Central Pulse */}
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: activeTheme.colors.primary }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.2,
                  repeat: Infinity
                }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: activeTheme.colors.primary }}
              />
            ))}
          </div>
          
          <p className="text-[10px] uppercase tracking-[0.4em] font-black" 
             style={{ color: activeTheme.colors.text, opacity: 0.4 }}>
            {message}
          </p>
        </motion.div>
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>
    </div>
  );
}
