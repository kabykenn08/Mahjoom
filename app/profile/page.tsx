'use client';

// ============================================
// Mahjoom — Profile Page
// Analytics, archetype, mood history, upgrade
// ============================================

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMoodStore } from '@/store/moodStore';
import AmbientBackground from '@/components/effects/AmbientBackground';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const ARCHETYPE_DATA = {
  icon: '🎯',
  name: 'Strategic Explorer',
  description: 'You approach each board as a system to be understood — not just solved. You clear layers deliberately, reading structure before acting.',
};

const MOOD_HISTORY = [
  { mood: 'focus', count: 12, color: '#3b82f6' },
  { mood: 'deep-work', count: 8, color: '#6366f1' },
  { mood: 'relax', count: 5, color: '#f59e0b' },
  { mood: 'night-wind-down', count: 4, color: '#8b5cf6' },
  { mood: 'creative-flow', count: 3, color: '#ec4899' },
  { mood: 'anxiety-reset', count: 2, color: '#10b981' },
];

const STATS_DATA = [
  { label: 'Games Played', value: 34 },
  { label: 'Win Rate', value: '71%' },
  { label: 'Best Time', value: '4:22' },
  { label: 'Avg Efficiency', value: '84%' },
  { label: 'Hints Used', value: 18 },
  { label: 'Current Streak', value: '5 days' },
];

const ACHIEVEMENTS = [
  { icon: '🔥', name: 'On Fire', desc: '5-day streak', unlocked: true },
  { icon: '⚡', name: 'Speed Run', desc: 'Under 5 minutes', unlocked: true },
  { icon: '🧘', name: 'No Hints', desc: 'Complete without hints', unlocked: false },
  { icon: '🌙', name: 'Night Owl', desc: '10 night sessions', unlocked: false },
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentMood, theme } = useMoodStore();
  const totalMoods = MOOD_HISTORY.reduce((a, b) => a + b.count, 0);

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AmbientBackground mood={currentMood} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <button onClick={() => router.push('/')} className="font-display text-xl font-bold" style={{ color: theme.colors.text }}>
          Mahj<span style={{ color: theme.colors.primary }}>oom</span>
        </button>
        <button onClick={() => router.push('/game')}
          className="glass px-4 py-2 text-sm font-medium rounded-full btn-magnetic"
          style={{ color: theme.colors.text }}>
          Play Now
        </button>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16 space-y-6">
        {/* Archetype Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-6"
          style={{ borderColor: `${theme.colors.primary}25` }}>
          <div className="flex items-start gap-4">
            <div className="text-5xl">{ARCHETYPE_DATA.icon}</div>
            <div>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: theme.colors.textMuted }}>Your Archetype</div>
              <h2 className="font-display text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>{ARCHETYPE_DATA.name}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.colors.textMuted }}>{ARCHETYPE_DATA.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3">
          {STATS_DATA.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-2xl p-4 text-center">
              <div className="font-display text-2xl font-bold mb-1" style={{ color: theme.colors.text }}>{s.value}</div>
              <div className="text-xs" style={{ color: theme.colors.textMuted }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mood History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>Mood History</h3>
          <div className="space-y-3">
            {MOOD_HISTORY.map((m) => (
              <div key={m.mood} className="flex items-center gap-3">
                <div className="text-xs w-28 capitalize" style={{ color: theme.colors.textMuted }}>{m.mood.replace('-', ' ')}</div>
                <div className="flex-1 rounded-full overflow-hidden" style={{ background: `${m.color}15`, height: 6 }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(m.count / totalMoods) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
                <div className="text-xs w-6 text-right" style={{ color: theme.colors.textMuted }}>{m.count}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-semibold mb-4" style={{ color: theme.colors.text }}>Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((a) => (
              <div key={a.name} className="glass rounded-2xl p-4 flex items-center gap-3"
                style={{ opacity: a.unlocked ? 1 : 0.4 }}>
                <div className="text-2xl">{a.icon}</div>
                <div>
                  <div className="text-sm font-medium" style={{ color: theme.colors.text }}>{a.name}</div>
                  <div className="text-xs" style={{ color: theme.colors.textMuted }}>{a.desc}</div>
                </div>
                {a.unlocked && (
                  <Badge className="ml-auto text-xs" style={{ background: `${theme.colors.primary}20`, color: theme.colors.accent, border: 'none' }}>✓</Badge>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upgrade Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.secondary}15)`, border: `1px solid ${theme.colors.primary}30` }}>
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.colors.accent }}>Mahjoom Pro</div>
            <h3 className="font-display text-xl font-bold mb-1" style={{ color: theme.colors.text }}>Unlock everything.</h3>
            <p className="text-sm mb-4" style={{ color: theme.colors.textMuted }}>Premium worlds, locked AI personalities, exclusive themes.</p>
            <div className="flex gap-2 flex-wrap">
              {['🌸 Sakura World', '🌌 Deep Space', '🔮 Crystal AI', '🎭 6 Personalities'].map((f) => (
                <span key={f} className="text-xs px-3 py-1 rounded-full glass" style={{ color: theme.colors.textMuted }}>
                  🔒 {f.split(' ').slice(1).join(' ')}
                </span>
              ))}
            </div>
            <button className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`, color: '#fff' }}>
              Upgrade to Pro
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
