'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMoodStore } from '@/store/moodStore';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getUserStats } from '@/lib/supabase/queries';
import AmbientBackground from '@/components/effects/AmbientBackground';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import DynamicIcon from '@/components/ui/DynamicIcon';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { 
  Target, Waves, Zap, Leaf, Sparkles, Moon, 
  Trophy, Zap as Speed, Brain, Flame, Info, LogOut
} from 'lucide-react';

function formatTime(s: number) {
  if (!s) return '--:--';
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

const ARCHETYPES: Record<string, { name: string; desc: string; icon: string }> = {
  focus: { icon: 'Target', name: 'The Laser', desc: 'Surgical precision. You cut through the board with unwavering focus.' },
  relax: { icon: 'Waves', name: 'The Zen Seeker', desc: 'Calm and steady. For you, the journey is more important than the speed.' },
  'deep-work': { icon: 'Zap', name: 'Flow Master', desc: 'Maximum efficiency. You enter the zone and stay there until the end.' },
  'anxiety-reset': { icon: 'Leaf', name: 'Peace Maker', desc: 'Grounding. You use Mahjong as a tool for mental clarity and calm.' },
  'creative-flow': { icon: 'Sparkles', name: 'Artistic Soul', desc: 'Playful patterns. You see the board as a canvas of possibilities.' },
  'night-wind-down': { icon: 'Moon', name: 'Evening Sage', desc: 'Reflective. You end your day by organizing the chaos into order.' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { currentMood, theme } = useMoodStore();
  
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadStats() {
      if (user?.id) {
        try {
          const data = await getUserStats(user.id);
          setStats(data);
        } catch (err) {
          // Silent fail for production
        } finally {
          setIsLoading(false);
        }
      }
    }
    if (isAuthenticated) loadStats();
  }, [user, isAuthenticated]);

  if (authLoading || isLoading || !isAuthenticated) {
    return <LoadingScreen message="Accessing Sanctuary..." />;
  }

  // Calculate top mood for Archetype
  const topMood = Object.entries(stats.moodCounts).reduce((a: any, b: any) => a[1] > b[1] ? a : b, ['focus', 0])[0];
  const archetype = ARCHETYPES[topMood as string] || ARCHETYPES.focus;
  const totalMoods = Object.values(stats.moodCounts).reduce((a: any, b: any) => a + b, 0) as number;

  const displayStats = [
    { label: 'Total Score', value: stats.totalScore?.toLocaleString() || 0 },
    { label: 'Games Played', value: stats.totalPlayed },
    { label: 'Win Rate', value: `${stats.winRate}%` },
    { label: 'Best Time', value: formatTime(stats.bestTime) },
    { label: 'Recent Streak', value: stats.recentRuns.filter((r: any) => r.won).length },
    { label: 'Level', value: Math.floor(stats.totalPlayed / 5) + 1 },
  ];

  const achievements = [
    { icon: <Flame size={20} />, name: 'Consistent', desc: 'Play 10 games', unlocked: stats.totalPlayed >= 10 },
    { icon: <Speed size={20} />, name: 'Speedster', desc: 'Win under 4 min', unlocked: stats.bestTime > 0 && stats.bestTime < 240 },
    { icon: <Brain size={20} />, name: 'Purist', desc: 'No hints in a win', unlocked: stats.recentRuns.some((r: any) => r.won && r.hints_used === 0) },
    { icon: <Trophy size={20} />, name: 'Champion', desc: 'Win 5 games', unlocked: stats.totalPlayed >= 5 },
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden flex flex-col">
      <AmbientBackground mood={currentMood} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <button onClick={() => router.push('/')} className="font-display text-2xl font-bold" style={{ color: theme.colors.text }}>
          Mahj<span style={{ color: theme.colors.primary }}>oom</span>
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => router.push('/game')}
            className="glass px-5 py-2 text-sm font-bold rounded-full btn-magnetic"
            style={{ color: theme.colors.text }}>
            Play Now
          </button>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: theme.colors.text }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-20 space-y-8">
        {/* Profile Header */}
        <div className="flex items-end gap-6 mb-4">
          <div className="w-24 h-24 rounded-3xl glass flex items-center justify-center text-3xl font-black relative group overflow-hidden"
            style={{ color: theme.colors.primary, borderColor: `${theme.colors.primary}40` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {user?.email?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1" style={{ color: theme.colors.text }}>{user?.email?.split('@')[0]}</h1>
            <p className="text-sm font-medium" style={{ color: theme.colors.textMuted }}>Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Archetype & Stats */}
          <div className="md:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-[2rem] p-8 border-t-2"
              style={{ borderColor: `${theme.colors.primary}30` }}>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-primary"
                  style={{ color: theme.colors.primary }}>
                  <DynamicIcon name={archetype.icon} size={32} />
                </div>
                <div>
                  <Badge className="mb-2 glass bg-white/5 border-none text-[10px]" style={{ color: theme.colors.accent }}>YOUR ARCHETYPE</Badge>
                  <h2 className="text-3xl font-bold mb-3" style={{ color: theme.colors.text }}>{archetype.name}</h2>
                  <p className="text-sm leading-relaxed max-w-md" style={{ color: theme.colors.textMuted }}>{archetype.desc}</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {displayStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="glass rounded-2xl p-5 border-l-2"
                  style={{ borderColor: `${theme.colors.primary}20` }}>
                  <div className="text-2xl font-black mb-1" style={{ color: theme.colors.text }}>{s.value}</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-40" style={{ color: theme.colors.text }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Mood History Chart */}
            <div className="glass rounded-3xl p-8">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-60" style={{ color: theme.colors.text }}>Mood Distribution</h3>
              <div className="space-y-5">
                {Object.entries(stats.moodCounts).map(([mood, count]: [any, any]) => (
                  <div key={mood} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold" style={{ color: theme.colors.textMuted }}>
                      <span className="capitalize">{mood.replace('-', ' ')}</span>
                      <span>{Math.round((count / (totalMoods || 1)) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${(count / (totalMoods || 1)) * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full" 
                        style={{ background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent})` }} 
                      />
                    </div>
                  </div>
                ))}
                {totalMoods === 0 && <p className="text-xs text-center py-4 opacity-40">Play your first game to see mood data</p>}
              </div>
            </div>
          </div>

          {/* Right Column: Achievements & Pro */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-8">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-60" style={{ color: theme.colors.text }}>Achievements</h3>
              <div className="space-y-4">
                {achievements.map((a) => (
                  <div key={a.name} className="flex items-center gap-4 group" style={{ opacity: a.unlocked ? 1 : 0.25 }}>
                    <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform"
                      style={{ color: theme.colors.primary, borderColor: a.unlocked ? `${theme.colors.primary}40` : 'transparent' }}>
                      {a.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold" style={{ color: theme.colors.text }}>{a.name}</div>
                      <div className="text-[10px]" style={{ color: theme.colors.textMuted }}>{a.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-t-2 border-indigo-500/20">
              <Badge className="mb-4 bg-indigo-500 text-[10px] text-white">UPGRADE</Badge>
              <h3 className="text-xl font-bold mb-2 text-white">Mahjoom Pro</h3>
              <p className="text-xs text-white/60 mb-6 leading-relaxed">Access deeper analytics, exclusive meditative worlds, and advanced AI coaching modes.</p>
              <button className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-[1.02] transition-transform">
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
