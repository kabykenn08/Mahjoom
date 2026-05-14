// ============================================
// Mahjoom — Mood Store (Zustand)
// ============================================

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MoodType } from '@/types';
import { getMoodTheme } from '@/lib/moods';

interface MoodStore {
  currentMood: MoodType;
  setMood: (mood: MoodType) => void;
  theme: ReturnType<typeof getMoodTheme>;
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      currentMood: 'focus',
      theme: getMoodTheme('focus'),

      setMood: (mood) => {
        set({ currentMood: mood, theme: getMoodTheme(mood) });
      },
    }),
    { name: 'mahjoom-mood' }
  )
);
