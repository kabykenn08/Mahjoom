// ============================================
// Mahjoom — Supabase Queries
// Helper functions for database operations
// ============================================

import { supabase } from './client';
import { PlayerStats, LeaderboardEntry } from '@/types';

/**
 * Save a completed or failed game run
 */
export async function saveGameRun(data: {
  userId?: string;
  boardSeed: string;
  mood: string;
  duration: number;
  moves: number;
  hintsUsed: number;
  won: boolean;
}) {
  const { error } = await supabase.from('runs').insert({
    user_id: data.userId,
    board_seed: data.boardSeed,
    mood: data.mood,
    duration: data.duration,
    moves: data.moves,
    hints_used: data.hintsUsed,
    won: data.won,
  });

  if (error) {
    console.error('Error saving game run:', error);
    return false;
  }
  return true;
}

/**
 * Fetch global leaderboard
 */
export async function getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select(`
      id,
      score,
      time,
      country,
      city,
      users (
        username,
        avatar_url
      )
    `)
    .order('score', { ascending: false })
    .limit(limit);

  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (error || isPlaceholder) {

    if (error) console.warn('Supabase fetch failed, using mock fallback:', error);
    
    // Mock data for development
    return [
      { id: '1', username: 'KiyoSolver', country: '🇯🇵', city: 'Tokyo', score: 9840, time: 312, rank: 1 },
      { id: '2', username: 'ZenMaster', country: '🇰🇷', city: 'Seoul', score: 9220, time: 340, rank: 2 },
      { id: '3', username: 'TileWhisperer', country: '🇺🇸', city: 'NY', score: 8900, time: 378, rank: 3 },
      { id: '4', username: 'CalmFlow_99', country: '🇩🇪', city: 'Berlin', score: 8450, time: 401, rank: 4 },
      { id: '5', username: 'PuzzleMonk', country: '🇬🇧', city: 'London', score: 8100, time: 425, rank: 5 },
    ];
  }


  // Transform to match LeaderboardEntry type
  return (data as any[]).map((entry) => ({
    id: entry.id,
    username: entry.users?.username || 'Anonymous',
    avatar: entry.users?.avatar_url,
    score: entry.score,
    time: entry.time,
    rank: 0, // Calculated on frontend if needed
    country: entry.country,
    city: entry.city,
  }));
}

/**
 * Fetch detailed stats for a user
 */
export async function getUserStats(userId: string) {
  const { data: runs, error } = await supabase
    .from('runs')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }

  const totalPlayed = runs.length;
  const wonRuns = runs.filter(r => r.won);
  const totalWon = wonRuns.length;
  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
  
  const bestTime = wonRuns.length > 0 
    ? Math.min(...wonRuns.map(r => r.duration)) 
    : 0;

  const totalHints = runs.reduce((acc, r) => acc + (r.hints_used || 0), 0);
  
  // Calculate mood distribution
  const moodCounts: Record<string, number> = {};
  runs.forEach(r => {
    moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
  });

  return {
    totalPlayed,
    winRate,
    bestTime,
    totalHints,
    moodCounts,
    recentRuns: runs.slice(-5).reverse(),
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
