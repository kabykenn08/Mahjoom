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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DynamicIcon from '@/components/ui/DynamicIcon';
import { Globe, Calendar, Map, Crown, Medal } from 'lucide-react';

function formatTime(s: number) {
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function getRankStyle(rank: number) {
  if (rank === 1) return { color: '#fbbf24', icon: '🥇' };
  if (rank === 2) return { color: '#94a3b8', icon: '🥈' };
  if (rank === 3) return { color: '#cd7c3f', icon: '🥉' };
  return { color: '#475569', icon: `#${rank}` };
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { currentMood, theme } = useMoodStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getLeaderboard();
      setEntries(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <div className="relative min-h-dvh overflow-hidden flex flex-col">
      <AmbientBackground mood={currentMood} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <button onClick={() => router.push('/')} className="font-display text-2xl font-bold" style={{ color: theme.colors.text }}>
          Mahj<span style={{ color: theme.colors.primary }}>oom</span>
        </button>
        <button onClick={() => router.push('/game')} className="glass px-5 py-2.5 text-sm font-bold rounded-full btn-magnetic transition-all"
          style={{ color: theme.colors.text, borderColor: `${theme.colors.primary}40` }}>
          Play Now
        </button>
      </nav>

      <div className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <header className="text-center mb-12">
            <Badge className="mb-4 glass px-4 py-1" style={{ color: theme.colors.accent, background: `${theme.colors.primary}15`, border: 'none' }}>
              Global Rankings
            </Badge>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 tracking-tight" style={{ color: theme.colors.text }}>
              The Hall of <span style={{ color: theme.colors.primary }}>Zen</span>
            </h1>
            <p className="text-base max-w-md mx-auto" style={{ color: theme.colors.textMuted }}>
              Recognizing the most mindful and efficient players across the globe.
            </p>
          </header>

            <Tabs defaultValue="global" className="w-full">
              <div className="flex justify-center mb-10">
                <TabsList className="glass p-1 rounded-2xl h-12">
                  <TabsTrigger value="global" className="px-8 rounded-xl capitalize text-sm font-bold flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">
                    <Globe size={16} /> World
                  </TabsTrigger>
                  <TabsTrigger value="daily" className="px-8 rounded-xl capitalize text-sm font-bold flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">
                    <Calendar size={16} /> Daily
                  </TabsTrigger>
                  <TabsTrigger value="country" className="px-8 rounded-xl capitalize text-sm font-bold flex items-center gap-2 data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">
                    <Map size={16} /> My Region
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Permanent CTA - Moved outside TabsContent to persist across all tabs */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2rem] p-10 text-center relative overflow-hidden mb-12"
                style={{ borderColor: `${theme.colors.primary}30` }}>
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-3" style={{ color: theme.colors.text }}>Ready to join them?</h3>
                  <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: theme.colors.textMuted }}>Every match counts. Start your session and claim your place in the Hall of Zen.</p>
                  <button onClick={() => router.push('/game')}
                    className="px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`, color: '#fff' }}>
                    Start New Game
                  </button>
                </div>
              </motion.div>

              <TabsContent value="global" className="space-y-12 outline-none">
                {!isLoading && (
                  <>
                    {/* Podium */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-16">
                    {/* Rank 2 */}
                    {podium[1] && (
                      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="glass rounded-3xl p-6 text-center order-2 md:order-1 h-64 flex flex-col justify-center relative border-t-4"
                        style={{ borderColor: '#94a3b840' }}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">
                          <Medal size={32} style={{ color: '#94a3b8' }} />
                        </div>
                        <Avatar className="w-16 h-16 mx-auto mb-4 border-2 border-slate-400/30">
                          <AvatarFallback style={{ background: '#94a3b820', color: '#94a3b8' }}>{podium[1].username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-lg truncate" style={{ color: theme.colors.text }}>{podium[1].username}</h3>
                        <p className="text-xs mb-3" style={{ color: theme.colors.textMuted }}>{podium[1].country} {podium[1].city}</p>
                        <div className="font-display text-2xl font-black" style={{ color: theme.colors.accent }}>{podium[1].score.toLocaleString()}</div>
                      </motion.div>
                    )}

                    {/* Rank 1 */}
                    {podium[0] && (
                      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="glass rounded-[2.5rem] p-8 text-center order-1 md:order-2 h-80 flex flex-col justify-center relative border-t-4 shadow-2xl"
                        style={{ borderColor: '#fbbf2460', boxShadow: `0 0 40px #fbbf2415` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                          <Crown size={48} style={{ color: '#fbbf24' }} fill="#fbbf2430" />
                        </div>
                        <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-amber-400/40">
                          <AvatarFallback style={{ background: '#fbbf2420', color: '#fbbf24' }}>{podium[0].username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-xl truncate" style={{ color: theme.colors.text }}>{podium[0].username}</h3>
                        <p className="text-sm mb-4" style={{ color: theme.colors.textMuted }}>{podium[0].country} {podium[0].city}</p>
                        <div className="font-display text-4xl font-black text-gradient" style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                          {podium[0].score.toLocaleString()}
                        </div>
                      </motion.div>
                    )}

                    {/* Rank 3 */}
                    {podium[2] && (
                      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass rounded-3xl p-6 text-center order-3 md:order-3 h-56 flex flex-col justify-center relative border-t-4"
                        style={{ borderColor: '#cd7c3f40' }}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <Medal size={28} style={{ color: '#cd7c3f' }} />
                        </div>
                        <Avatar className="w-14 h-14 mx-auto mb-4 border-2 border-orange-700/30">
                          <AvatarFallback style={{ background: '#cd7c3f20', color: '#cd7c3f' }}>{podium[2].username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-bold text-base truncate" style={{ color: theme.colors.text }}>{podium[2].username}</h3>
                        <p className="text-xs mb-2" style={{ color: theme.colors.textMuted }}>{podium[2].country} {podium[2].city}</p>
                        <div className="font-display text-xl font-black" style={{ color: theme.colors.accent }}>{podium[2].score.toLocaleString()}</div>
                      </motion.div>
                    )}
                  </div>

                  {/* List for the rest */}
                  <div className="space-y-3">
                    {rest.map((entry, i) => (
                      <motion.div key={entry.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                        className="glass glass-hover rounded-2xl px-6 py-4 flex items-center gap-6 group">
                        <div className="w-6 text-sm font-bold opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: theme.colors.text }}>
                          {i + 4}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarFallback style={{ background: `${theme.colors.primary}15`, color: theme.colors.text }}>{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-bold text-sm" style={{ color: theme.colors.text }}>{entry.username}</div>
                          <div className="text-xs" style={{ color: theme.colors.textMuted }}>{entry.country} • {entry.city}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-black text-sm" style={{ color: theme.colors.accent }}>{entry.score.toLocaleString()}</div>
                          <div className="text-[10px] font-medium" style={{ color: theme.colors.textMuted }}>{formatTime(entry.time)}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}

            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
