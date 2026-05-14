'use client';

// ============================================
// Mahjoom — How to Play Modal
// Simple instructions for new players
// ============================================

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useMoodStore } from '@/store/moodStore';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HowToPlay({ open, onOpenChange }: Props) {
  const theme = useMoodStore((s) => s.theme);

  const steps = [
    {
      icon: '🎯',
      title: 'Match Pairs',
      desc: 'Find two identical tiles to remove them. Special tiles like Flowers and Seasons match even if they differ.',
    },
    {
      icon: '🔓',
      title: 'Free Tiles Only',
      desc: 'A tile is "free" if it\'s not covered and has at least one side (left or right) open.',
    },
    {
      icon: '✨',
      title: 'Clear the Board',
      desc: 'Remove all 144 tiles. If you get stuck, use a Hint or Reshuffle.',
    },
    {
      icon: '🧠',
      title: 'Listen to the Coach',
      desc: 'Our AI coach provides strategic insights based on your play style and current mood.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false} 
        className="glass max-w-md border-none p-0 overflow-hidden shadow-2xl" 
        style={{ color: theme.colors.text }}
      >
        {/* Close Button */}
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 p-2 rounded-full glass hover:bg-white/10 transition-colors"
          style={{ color: theme.colors.textMuted }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Decorative background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl" style={{ background: theme.colors.primary }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl" style={{ background: theme.colors.secondary }} />
        </div>

        <div className="relative z-10 p-8">
          <DialogHeader className="mb-8">
            <DialogTitle className="font-display text-3xl font-bold tracking-tight">How to Play</DialogTitle>
            <DialogDescription className="text-sm font-medium" style={{ color: theme.colors.accent }}>
              Master the art of mindful matching.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl glass transition-transform group-hover:scale-110"
                  style={{ borderColor: `${theme.colors.primary}20` }}>
                  {step.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: theme.colors.text }}>{step.title}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: theme.colors.textMuted }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-4 rounded-2xl text-base font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                color: '#fff',
                boxShadow: `0 8px 24px ${theme.colors.tileGlow}`,
              }}
            >
              Begin Journey
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
