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
      desc: 'Find two identical tiles to remove them from the board. Some special tiles like Flowers and Seasons match even if they aren\'t identical.',
    },
    {
      icon: '🔓',
      title: 'Free Tiles Only',
      desc: 'A tile is "free" if it is not covered by another tile and has at least one side (left or right) open.',
    },
    {
      icon: '✨',
      title: 'Clear the Board',
      desc: 'The goal is to remove all 144 tiles. If you get stuck, use a Hint or Reshuffle the remaining tiles.',
    },
    {
      icon: '🧠',
      title: 'Listen to the Coach',
      desc: 'Our AI coach provides strategic insights based on your play style and current mood.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-lg border-none" style={{ color: theme.colors.text }}>
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">How to Play</DialogTitle>
          <DialogDescription style={{ color: theme.colors.textMuted }}>
            Master the art of mindful matching.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="text-3xl">{step.icon}</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: theme.colors.textMuted }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 rounded-xl text-sm font-semibold"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
              color: '#fff',
            }}
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
