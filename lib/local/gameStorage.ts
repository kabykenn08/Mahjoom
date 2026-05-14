// ============================================
// Mahjoom — Local Storage Utility
// Fallback for game history and stats
// ============================================

export interface LocalGameRun {
  id: string;
  userId: string; // Now tied to a specific user
  boardSeed: string;
  mood: string;
  duration: number;
  moves: number;
  hintsUsed: number;
  won: boolean;
  score: number;
  timestamp: number;
}

const STORAGE_KEY = 'mahjoom_history';

/**
 * Save a game run to LocalStorage
 */
export function saveLocalRun(run: Omit<LocalGameRun, 'id' | 'timestamp'>) {
  try {
    const history = getRawHistory();
    const newRun: LocalGameRun = {
      ...run,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
    };
    
    history.unshift(newRun);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
    return newRun;
  } catch (e) {
    return null;
  }
}

/**
 * Get raw history for internal use
 */
function getRawHistory(): LocalGameRun[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get history for a specific user
 */
export function getLocalHistory(userId: string): LocalGameRun[] {
  return getRawHistory().filter(r => r.userId === userId);
}

/**
 * Calculate stats from local history for a specific user
 */
export function getLocalStats(userId: string) {
  const history = getLocalHistory(userId);
  const totalPlayed = history.length;
  const wonRuns = history.filter(r => r.won);
  const totalWon = wonRuns.length;
  const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
  const totalScore = history.reduce((acc, r) => acc + r.score, 0);
  const bestTime = wonRuns.length > 0 ? Math.min(...wonRuns.map(r => r.duration)) : 0;

  return {
    totalPlayed,
    totalScore,
    winRate,
    bestTime,
    recentRuns: history.slice(0, 10),
  };
}
