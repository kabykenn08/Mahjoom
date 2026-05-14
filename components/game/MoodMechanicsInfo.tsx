'use client';

// ============================================
// Mahjoom — Mood Mechanics Info
// Explains active rules for the current mood
// ============================================

import { motion } from 'framer-motion';
import { useMoodStore } from '@/store/moodStore';

export default function MoodMechanicsInfo() {
  const { theme } = useMoodStore();
  const { mechanics } = theme;

  const rules = [
    { label: 'Time Speed', value: `${mechanics.timeScale}x`, active: mechanics.timeScale !== 1 },
    { label: 'Score Bonus', value: `${mechanics.scoreMultiplier}x`, active: mechanics.scoreMultiplier !== 1 },
    { label: 'Hints', value: mechanics.allowHints ? 'Enabled' : 'Disabled', active: !mechanics.allowHints },
    { label: 'Undo', value: mechanics.allowUndo ? 'Enabled' : 'Disabled', active: !mechanics.allowUndo },
  ];

  return (
    <div className="glass rounded-xl p-3 space-y-2 mt-4" style={{ borderColor: `${theme.colors.primary}20` }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{theme.icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.colors.text }}>
          {theme.name} Rules
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {rules.map((rule) => (
          <div key={rule.label} className="flex flex-col">
            <span className="text-[10px] uppercase tracking-tighter" style={{ color: theme.colors.textMuted }}>
              {rule.label}
            </span>
            <span className="text-xs font-semibold" style={{ color: rule.active ? theme.colors.primary : theme.colors.text }}>
              {rule.value}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] leading-tight italic mt-2" style={{ color: theme.colors.textMuted }}>
        {theme.description}
      </p>
    </div>
  );
}
