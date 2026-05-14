// ============================================
// Mahjoom — Mood Themes System
// All 6 moods with full visual + AI configuration
// ============================================

import { MoodTheme, MoodType } from '@/types';

export const MOOD_THEMES: Record<MoodType, MoodTheme> = {
  focus: {
    id: 'focus',
    name: 'Focus',
    description: 'Clear mind. Sharp thinking. Zero distraction.',
    icon: '🎯',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#020817',
      backgroundGradient: 'linear-gradient(135deg, #020817 0%, #0f1729 50%, #020c1b 100%)',
      surface: 'rgba(15, 23, 42, 0.8)',
      surfaceHover: 'rgba(30, 41, 59, 0.9)',
      text: '#e2e8f0',
      textMuted: '#64748b',
      tileGlow: 'rgba(59, 130, 246, 0.4)',
      particleColor: '#3b82f6',
    },
    animation: { speed: 1.0, particleIntensity: 0.3, backgroundMotion: 0.4 },
    ai: { personality: 'analytical', tone: 'precise and strategic', verbosity: 'minimal' },
    mechanics: {
      allowHints: true,
      allowUndo: true,
      timeScale: 1.2,
      scoreMultiplier: 1.5,
    }
  },

  relax: {
    id: 'relax',
    name: 'Relax',
    description: 'Gentle pace. Warm light. Just breathe.',
    icon: '🌊',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fcd34d',
      background: '#0d0a05',
      backgroundGradient: 'linear-gradient(135deg, #0d0a05 0%, #1a1008 50%, #0a0d0a 100%)',
      surface: 'rgba(20, 14, 6, 0.8)',
      surfaceHover: 'rgba(35, 24, 10, 0.9)',
      text: '#fef3c7',
      textMuted: '#92400e',
      tileGlow: 'rgba(245, 158, 11, 0.35)',
      particleColor: '#fcd34d',
    },
    animation: { speed: 0.6, particleIntensity: 0.5, backgroundMotion: 0.3 },
    ai: { personality: 'nurturing', tone: 'warm and encouraging', verbosity: 'moderate' },
    mechanics: {
      allowHints: true,
      allowUndo: true,
      timeScale: 0.8,
      scoreMultiplier: 0.8,
    }
  },

  'deep-work': {
    id: 'deep-work',
    name: 'Deep Work',
    description: 'Maximum flow state. No noise.',
    icon: '⚡',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
      background: '#05050f',
      backgroundGradient: 'linear-gradient(135deg, #05050f 0%, #0c0c1f 50%, #050510 100%)',
      surface: 'rgba(8, 8, 24, 0.85)',
      surfaceHover: 'rgba(15, 15, 40, 0.9)',
      text: '#e0e7ff',
      textMuted: '#4338ca',
      tileGlow: 'rgba(99, 102, 241, 0.45)',
      particleColor: '#6366f1',
    },
    animation: { speed: 0.8, particleIntensity: 0.2, backgroundMotion: 0.2 },
    ai: { personality: 'strategic', tone: 'focused and insightful', verbosity: 'minimal' },
    mechanics: {
      allowHints: false, // Harder mode
      allowUndo: false,  // Commit to moves
      timeScale: 1.0,
      scoreMultiplier: 2.0,
    }
  },

  'anxiety-reset': {
    id: 'anxiety-reset',
    name: 'Anxiety Reset',
    description: 'Slow down. Ground yourself. One tile at a time.',
    icon: '🌿',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#030d08',
      backgroundGradient: 'linear-gradient(135deg, #030d08 0%, #071a10 50%, #030d08 100%)',
      surface: 'rgba(5, 20, 12, 0.8)',
      surfaceHover: 'rgba(10, 30, 18, 0.9)',
      text: '#d1fae5',
      textMuted: '#065f46',
      tileGlow: 'rgba(16, 185, 129, 0.35)',
      particleColor: '#10b981',
    },
    animation: { speed: 0.5, particleIntensity: 0.6, backgroundMotion: 0.2 },
    ai: { personality: 'calming', tone: 'gentle and reassuring', verbosity: 'moderate' },
    mechanics: {
      allowHints: true,
      allowUndo: true,
      timeScale: 0.5,
      scoreMultiplier: 0.5,
    }
  },

  'creative-flow': {
    id: 'creative-flow',
    name: 'Creative Flow',
    description: 'Color. Energy. Playful brilliance.',
    icon: '✨',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#f472b6',
      background: '#0d0510',
      backgroundGradient: 'linear-gradient(135deg, #0d0510 0%, #160820 40%, #0d1015 100%)',
      surface: 'rgba(18, 8, 24, 0.8)',
      surfaceHover: 'rgba(30, 12, 40, 0.9)',
      text: '#fce7f3',
      textMuted: '#9d174d',
      tileGlow: 'rgba(236, 72, 153, 0.45)',
      particleColor: '#ec4899',
    },
    animation: { speed: 1.4, particleIntensity: 0.9, backgroundMotion: 0.8 },
    ai: { personality: 'playful', tone: 'enthusiastic and creative', verbosity: 'expressive' },
    mechanics: {
      allowHints: true,
      allowUndo: true,
      timeScale: 1.5,
      scoreMultiplier: 1.2,
    }
  },

  'night-wind-down': {
    id: 'night-wind-down',
    name: 'Night Wind-Down',
    description: 'Stars. Silence. The day becomes memory.',
    icon: '🌙',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#020208',
      backgroundGradient: 'linear-gradient(135deg, #020208 0%, #090614 50%, #020208 100%)',
      surface: 'rgba(5, 4, 14, 0.85)',
      surfaceHover: 'rgba(10, 8, 25, 0.9)',
      text: '#ede9fe',
      textMuted: '#4c1d95',
      tileGlow: 'rgba(139, 92, 246, 0.4)',
      particleColor: '#8b5cf6',
    },
    animation: { speed: 0.5, particleIntensity: 0.7, backgroundMotion: 0.3 },
    ai: { personality: 'reflective', tone: 'poetic and serene', verbosity: 'moderate' },
    mechanics: {
      allowHints: true,
      allowUndo: true,
      timeScale: 0.7,
      scoreMultiplier: 1.0,
    }
  },
};

export const MOOD_ORDER: MoodType[] = [
  'focus',
  'relax',
  'deep-work',
  'anxiety-reset',
  'creative-flow',
  'night-wind-down',
];

export function getMoodTheme(mood: MoodType): MoodTheme {
  return MOOD_THEMES[mood];
}
