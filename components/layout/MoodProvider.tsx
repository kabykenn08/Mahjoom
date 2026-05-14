'use client';

// ============================================
// Mahjoom — MoodProvider
// Injects mood CSS variables into the document
// ============================================

import { useEffect } from 'react';
import { useMoodStore } from '@/store/moodStore';

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const theme = useMoodStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', theme.colors.primary);
    root.style.setProperty('--mood-secondary', theme.colors.secondary);
    root.style.setProperty('--mood-accent', theme.colors.accent);
    root.style.setProperty('--mood-bg', theme.colors.background);
    root.style.setProperty('--mood-surface', theme.colors.surface);
    root.style.setProperty('--mood-surface-hover', theme.colors.surfaceHover);
    root.style.setProperty('--mood-text', theme.colors.text);
    root.style.setProperty('--mood-text-muted', theme.colors.textMuted);
    root.style.setProperty('--mood-glow', theme.colors.tileGlow);
    root.style.setProperty('--mood-particle', theme.colors.particleColor);
    document.body.style.backgroundImage = theme.colors.backgroundGradient;
  }, [theme]);

  return <>{children}</>;
}
