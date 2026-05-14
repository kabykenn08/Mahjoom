'use client';

// ============================================
// Mahjoom — Leaderboard Page
// Global / country / city / daily rankings
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMoodStore } from '@/store/moodStore';
import { getLeaderboard } from '@/lib/supabase/queries';
import { LeaderboardEntry } from '@/types';
import AmbientBackground from '@/components/effects/AmbientBackground';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Medal, Globe, Calendar, Map } from 'lucide-react';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function LeaderboardPage() {
  const router = useRouter();
  const { currentMood, theme } = useMoodStore();
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const entries = await getLeaderboard(50);
      setData(entries);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const podium = data.slice(0, 3);
  const rest = data.slice(3);

  if (isLoading) return <LoadingScreen message="Unveiling the Hall of Zen..." />;

  return (
    <div className="relative min-h-dvh overflow-hidden flex flex-col">
      <AmbientBackground mood={currentMood} />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6">
        <button onClick={() => router.push('/')} className="font-display text-2xl font-bold transition-transform hover:scale-105" style={{ color: theme.colors.text }}>
          Mahj<span style={{ color: theme.colors.primary }}>oom</span>
        </button>
        <button 
          onClick={() => router.push('/profile')} 
          className="glass px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-full transition-all hover:bg-white/10" 
          style={{ color: theme.colors.text }}
        >
          My Sanctuary
        </button>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pb-20 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-display font-black mb-4 tracking-tighter"
            style={{ color: theme.colors.text }}
          >
            The Hall of <span style={{ color: theme.colors.primary }}>Zen</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base opacity-40 max-w-md mx-auto font-medium"
            style={{ color: theme.colors.text }}
          >
            Recognizing the most mindful and efficient players across the globe.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_240px] gap-12 w-full items-start">
          
          {/* Left Column: Navigation / Filters */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-30" style={{ color: theme.colors.text }}>Rankings</h4>
            {[
              { label: 'World', icon: <Globe size={14} />, active: true },
              { label: 'Daily', icon: <Calendar size={14} /> },
              { label: 'Region', icon: <Map size={14} /> }
            ].map((f) => (
              <button 
                key={f.label} 
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-bold transition-all ${f.active ? 'glass bg-white/10' : 'hover:bg-white/5 opacity-50 hover:opacity-100'}`}
                style={{ color: theme.colors.text }}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </motion.aside>

          {/* Center Column: Podium & List */}
          <div className="space-y-16">
            <LeaderboardPodium podium={podium} theme={theme} />
            <LeaderboardList rest={rest} theme={theme} />
          </div>

          {/* Right Column: Call to Action */}
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-[2.5rem] p-8 text-center border-t border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 tracking-tight" style={{ color: theme.colors.text }}>Ready to join?</h3>
              <p className="text-[11px] mb-8 opacity-40 leading-relaxed font-medium" style={{ color: theme.colors.text }}>
                Every match counts. Claim your place in the Hall of Zen.
              </p>
              <button 
                onClick={() => router.push('/game')}
                className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl"
                style={{ background: theme.colors.primary, color: '#fff' }}
              >
                Begin Session
              </button>
            </div>
            {/* Background Glow */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20 rounded-full" style={{ background: theme.colors.primary }} />
          </motion.aside>

        </div>
      </main>
    </div>
  );
}

function LeaderboardPodium({ podium, theme }: any) {
  const order = [1, 0, 2]; // Silver, Gold, Bronze order

  return (
    <div className="flex items-end justify-center gap-4 md:gap-8 h-[380px]">
      {order.map((idx) => {
        const entry = podium[idx];
        if (!entry) return <div key={idx} className="flex-1" />;

        const isGold = idx === 0;
        const color = isGold ? '#fbbf24' : idx === 1 ? '#94a3b8' : '#cd7c3f';
        const height = isGold ? 'h-full' : idx === 1 ? 'h-[85%]' : 'h-[75%]';
        const glassHeight = isGold ? '180px' : idx === 1 ? '140px' : '110px';

        return (
          <motion.div 
            key={entry.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
            className={`flex-1 flex flex-col items-center justify-end ${height} group`}
          >
            {/* Avatar & Info */}
            <div className="mb-6 text-center z-10">
              <div className="relative mb-4 inline-block">
                <Avatar className="w-16 h-16 md:w-24 md:h-24 border-4 shadow-2xl transition-transform group-hover:scale-110" 
                  style={{ borderColor: `${color}30` }}>
                  <AvatarFallback className="text-xl md:text-2xl font-black" style={{ background: `${color}15`, color }}>
                    {entry.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 drop-shadow-lg">
                  {isGold ? <Crown size={36} style={{ color }} fill={`${color}30`} /> : <Medal size={28} style={{ color }} />}
                </div>
              </div>
              <h3 className="font-bold text-sm md:text-lg truncate max-w-[140px] mb-0.5" style={{ color: theme.colors.text }}>{entry.username}</h3>
              <p className="text-[10px] opacity-30 uppercase tracking-[0.2em] font-black" style={{ color: theme.colors.text }}>{entry.city}</p>
            </div>

            {/* Base */}
            <div 
              className="w-full glass rounded-t-[3rem] p-6 flex flex-col items-center justify-start border-t border-white/10 shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.3)] transition-all group-hover:bg-white/5 relative"
              style={{ height: glassHeight, borderColor: `${color}20` }}
            >
              <div className="text-2xl md:text-4xl font-black mb-1" style={{ color }}>{entry.score.toLocaleString()}</div>
              <div className="text-[9px] font-black opacity-20 uppercase tracking-widest" style={{ color: theme.colors.text }}>Points</div>
              
              {/* Internal Glow for Gold */}
              {isGold && (
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent rounded-t-[3rem] pointer-events-none" />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function LeaderboardList({ rest, theme }: any) {
  return (
    <div className="space-y-3 w-full">
      {rest.map((entry: any, i: number) => (
        <motion.div 
          key={entry.id}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.03 }}
          className="glass glass-hover rounded-[1.5rem] px-8 py-5 flex items-center gap-8 group border border-white/5"
        >
          <div className="w-8 text-xs font-black opacity-20 group-hover:opacity-100 transition-opacity" style={{ color: theme.colors.text }}>
            {String(i + 4).padStart(2, '0')}
          </div>
          <Avatar className="w-12 h-12 border border-white/10 shadow-lg">
            <AvatarFallback className="font-bold text-sm" style={{ background: `${theme.colors.primary}10`, color: theme.colors.text }}>
              {entry.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-base truncate mb-0.5" style={{ color: theme.colors.text }}>{entry.username}</div>
            <div className="text-[10px] opacity-30 uppercase tracking-widest font-black flex items-center gap-3" style={{ color: theme.colors.text }}>
              <span className="flex items-center gap-1.5">🌏 {entry.country}</span>
              <span className="w-1 h-1 rounded-full bg-current opacity-20" />
              <span>{entry.city}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black tracking-tight" style={{ color: theme.colors.primary }}>{entry.score.toLocaleString()}</div>
            <div className="text-[9px] font-black opacity-20 uppercase tracking-widest" style={{ color: theme.colors.text }}>Total Score</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
