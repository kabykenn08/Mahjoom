'use client';

// ============================================
// Mahjoom — How to Play Modal
// Simple instructions for new players
// ============================================

import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useMoodStore } from '@/store/moodStore';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { Target, Unlock, Sparkles, Brain } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HowToPlay({ open, onOpenChange }: Props) {
  const theme = useMoodStore((s) => s.theme);

  const steps = [
    {
      icon: <Target size={24} />,
      title: 'Match Pairs',
      desc: 'Find two identical tiles to remove them. Special tiles like Flowers and Seasons match even if they differ.',
    },
    {
      icon: <Unlock size={24} />,
      title: 'Free Tiles Only',
      desc: 'A tile is "free" if it\'s not covered and has at least one side (left or right) open.',
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Clear the Board',
      desc: 'Remove all 144 tiles. If you get stuck, use a Hint or Reshuffle.',
    },
    {
      icon: <Brain size={24} />,
      title: 'Listen to the Coach',
      desc: 'Our AI coach provides strategic insights based on your play style and current mood.',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-sm w-[90vw] p-0 overflow-hidden bg-transparent border-none shadow-none outline-none ring-0 focus:ring-0"
      >
        <div className="relative overflow-hidden rounded-[2rem] p-7 shadow-2xl"
          style={{ 
            background: 'rgba(10, 10, 18, 0.95)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          }}>
          
          {/* Decorative Animated Glows */}
          <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] pointer-events-none" 
            style={{ background: theme.colors.primary, opacity: 0.15 }} />

          {/* Clean Integrated Close Button */}
          <button 
            onClick={() => onOpenChange(false)}
            className="absolute top-6 right-6 z-50 p-1.5 rounded-full hover:bg-white/10 transition-all text-white/20 hover:text-white group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <DialogHeader className="relative z-10 text-left mb-8">
            <DialogTitle className="font-display text-3xl font-bold mb-1 tracking-tight text-white">
              How to Play
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40" style={{ color: theme.colors.accent }}>
              The Way of Mahjoom
            </DialogDescription>
          </DialogHeader>

          <div className="relative z-10 space-y-6 mb-8">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex items-start gap-4 group"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 border border-white/5"
                  style={{ 
                    color: theme.colors.primary, 
                    background: 'rgba(255, 255, 255, 0.03)',
                  }}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-0.5 text-white/90 group-hover:text-white transition-colors">{step.title}</h3>
                  <p className="text-[10px] leading-relaxed text-white/40 group-hover:text-white/70 transition-colors">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-4 rounded-2xl font-bold text-base hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                color: '#fff',
                boxShadow: `0 10px 40px ${theme.colors.primary}30`,
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
