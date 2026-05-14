// ============================================
// Mahjoom — Supabase Queries
// Helper functions for database operations
// ============================================

import { supabase } from './client';
import { PlayerStats, LeaderboardEntry } from '@/types';
import { saveLocalRun, getLocalStats } from '../local/gameStorage';

/**
 * Save a completed or failed game run
 */
export async function saveGameRun(data: {
  userId: string;
  boardSeed: string;
  mood: string;
  duration: number;
  moves: number;
  hintsUsed: number;
  won: boolean;
  score: number;
}) {
  // Always save locally first as a backup (now with userId)
  saveLocalRun({
    userId: data.userId,
    boardSeed: data.boardSeed,
    mood: data.mood,
    duration: data.duration,
    moves: data.moves,
    hintsUsed: data.hintsUsed,
    won: data.won,
    score: data.score
  });

  const { error } = await supabase.from('runs').insert({
    user_id: data.userId === 'guest' ? null : data.userId,
    board_seed: data.boardSeed,
    mood: data.mood,
    duration: data.duration,
    moves: data.moves,
    hints_used: data.hintsUsed,
    won: data.won,
    score: data.score,
  });

  if (error) {
    console.warn('[Supabase] Cloud save failed, but local copy is safe:', error.message);
    return false;
  }
  
  return true;
}

/**
 * Fetch global leaderboard
 */
export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  // We use elite mock data for a "legendary" atmosphere as requested
  const mockMasters: LeaderboardEntry[] = [
    { id: 'm1', username: 'KiyoSolver', country: '🇯🇵', city: 'Kyoto', score: 142500, time: 185, rank: 1 },
    { id: 'm2', username: 'ZenMaster_Lee', country: '🇰🇷', city: 'Seoul', score: 138900, time: 210, rank: 2 },
    { id: 'm3', username: 'TileWhisperer', country: '🇺🇸', city: 'New York', score: 124200, time: 245, rank: 3 },
    { id: 'm4', username: 'LotusFlow', country: '🇨🇳', city: 'Hangzhou', score: 98400, time: 280, rank: 4 },
    { id: 'm5', username: 'CalmSpirit', country: '🇮🇳', city: 'Mumbai', score: 87600, time: 310, rank: 5 },
    { id: 'm6', username: 'JadeDragon', country: '🇻🇳', city: 'Hanoi', score: 76500, time: 345, rank: 6 },
    { id: 'm7', username: 'NordicZen', country: '🇳🇴', city: 'Oslo', score: 65400, time: 380, rank: 7 },
    { id: 'm8', username: 'DesertWind', country: '🇦🇪', city: 'Dubai', score: 54300, time: 420, rank: 8 },
    { id: 'm9', username: 'Amazonia', country: '🇧🇷', city: 'Manaus', score: 43200, time: 450, rank: 9 },
    { id: 'm10', username: 'AlpsShadow', country: '🇨🇭', city: 'Zurich', score: 32100, time: 480, rank: 10 },
  ];

  return mockMasters.slice(0, limit);
}

/**
 * Fetch detailed stats for a user
 */
export async function getUserStats(userId: string) {
  const localStats = getLocalStats(userId);

  const { data: user } = await supabase
    .from('users')
    .select('total_score, games_played, best_time')
    .eq('id', userId)
    .single();

  const { data: runs } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  const baseStats = {
    totalPlayed: Math.max(user?.games_played || 0, localStats.totalPlayed),
    totalScore: Math.max(Number(user?.total_score || 0), localStats.totalScore),
    bestTime: (user?.best_time && localStats.bestTime) 
      ? Math.min(user.best_time, localStats.bestTime) 
      : (user?.best_time || localStats.bestTime || 0),
  };

  const supabaseRuns = runs || [];
  const mergedRuns = [...supabaseRuns, ...localStats.recentRuns]
    .sort((a, b) => {
      const timeA = (a as any).created_at ? new Date((a as any).created_at).getTime() : (a as any).timestamp;
      const timeB = (b as any).created_at ? new Date((b as any).created_at).getTime() : (b as any).timestamp;
      return timeB - timeA;
    })
    .slice(0, 10);

  const totalWon = mergedRuns.filter(r => (r as any).won).length;
  const winRate = baseStats.totalPlayed > 0 ? Math.round((totalWon / Math.max(1, mergedRuns.length)) * 100) : 0;

  const moodCounts: Record<string, number> = {};
  mergedRuns.forEach(r => {
    moodCounts[(r as any).mood] = (moodCounts[(r as any).mood] || 0) + 1;
  });

  return {
    ...baseStats,
    winRate,
    moodCounts,
    recentRuns: mergedRuns,
  };
}

/**
 * Update player statistics
 */
export async function updatePlayerStats(userId: string, stats: PlayerStats) {
  const { error } = await supabase
    .from('users')
    .update({
      // Archetype could be calculated or updated here
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating player stats:', error);
    return false;
  }
  return true;
}
