'use client';

// ============================================
// Mahjoom — Sound System Hook
// Handles sound effects and ambient music
// ============================================

import { useCallback, useEffect, useRef } from 'react';
import { useMoodStore } from '@/store/moodStore';

type SoundEffect = 'click' | 'match' | 'mismatch' | 'shuffle' | 'win' | 'lose' | 'hint';

const SOUND_URLS: Record<SoundEffect, string> = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  match: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3',
  mismatch: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  shuffle: 'https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3',
  lose: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  hint: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
};

export function useSound() {
  const { currentMood } = useMoodStore();
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Initialize sounds on client side
  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((effect: SoundEffect, volume = 0.4) => {
    const audio = audioRefs.current[effect];
    if (audio) {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {
        // Autoplay policy might block this until first interaction
      });
    }
  }, []);

  return { playSound };
}
