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

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <AmbientBackground mood={currentMood} />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <button
          onClick={() => router.push('/')}
          className="font-display text-xl font-bold"
          style={{ color: theme.colors.text }}
        >
          Mahj<span style={{ color: theme.colors.primary }}>oom</span>
        </button>
        <button
          onClick={() => router.push('/game')}
          className="glass px-4 py-2 text-sm font-medium rounded-full btn-magnetic"
          style={{ color: theme.colors.text }}
        >
          Play Now
        </button>
      </nav>

      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: theme.colors.text }}>
            Leaderboard
          </h1>
          <p className="text-sm mb-8" style={{ color: theme.colors.textMuted }}>
            Global rankings — updated daily
          </p>

          <Tabs defaultValue="global">
            <TabsList className="glass mb-6 rounded-xl p-1">
              {['global', 'daily', 'country'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-lg capitalize text-sm font-medium data-[state=active]:text-white"
                  style={{
                    color: theme.colors.textMuted,
                  }}
                >
                  {tab === 'global' ? '🌍 Global' : tab === 'daily' ? '📅 Today' : '🗺 Country'}
                </TabsTrigger>
              ))}
            </TabsList>

            {['global', 'daily', 'country'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-2">
                  {isLoading ? (
                    <div className="text-center py-12" style={{ color: theme.colors.textMuted }}>
                      <div className="text-2xl animate-pulse mb-2">🀄</div>
                      <p className="text-sm">Fetching rankings...</p>
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="text-center py-12" style={{ color: theme.colors.textMuted }}>
                      <p className="text-sm">No entries yet. Be the first!</p>
                    </div>
                  ) : (
                    entries.map((entry, i) => {
                      const rankStyle = getRankStyle(i + 1);
                      return (
                        <motion.div
                          key={entry.username}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="glass glass-hover rounded-2xl px-5 py-4 flex items-center gap-4"
                          style={{ borderColor: i < 3 ? `${rankStyle.color}30` : 'transparent' }}
                        >
                          {/* Rank */}
                          <div className="w-8 text-center font-display font-bold text-sm" style={{ color: rankStyle.color }}>
                            {rankStyle.icon}
                          </div>

                          {/* Avatar */}
                          <Avatar className="w-9 h-9">
                            <AvatarFallback
                              style={{ background: `${theme.colors.primary}20`, color: theme.colors.primary, fontSize: 13 }}
                            >
                              {entry.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {/* Name & location */}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate" style={{ color: theme.colors.text }}>
                              {entry.username}
                            </div>
                            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
                              {entry.country} {entry.city}
                            </div>
                          </div>

                          {/* Score & time */}
                          <div className="text-right">
                            <div className="font-display font-semibold text-sm" style={{ color: theme.colors.accent }}>
                              {entry.score.toLocaleString()}
                            </div>
                            <div className="text-xs" style={{ color: theme.colors.textMuted }}>
                              {formatTime(entry.time)}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Sign-in prompt */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="glass rounded-2xl p-6 text-center mt-6"
                  style={{ borderColor: `${theme.colors.primary}20` }}
                >
                  <p className="text-sm mb-3" style={{ color: theme.colors.textMuted }}>
                    Sign in to appear on the leaderboard
                  </p>
                  <button
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      color: '#fff',
                    }}
                  >
                    Join Rankings
                  </button>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
