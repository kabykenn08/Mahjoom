// ============================================
// Mahjoom — Core Type Definitions
// ============================================

// --- Tile Types ---

export type TileSuit = 'bamboo' | 'circle' | 'character';
export type TileWind = 'east' | 'south' | 'west' | 'north';
export type TileDragon = 'red' | 'green' | 'white';
export type TileFlower = 'plum' | 'orchid' | 'chrysanthemum' | 'bamboo_flower';
export type TileSeason = 'spring' | 'summer' | 'autumn' | 'winter';

export type TileCategory = 'suit' | 'wind' | 'dragon' | 'flower' | 'season';

export interface TileFace {
  id: string;
  category: TileCategory;
  suit?: TileSuit;
  value?: number; // 1-9 for suits
  wind?: TileWind;
  dragon?: TileDragon;
  flower?: TileFlower;
  season?: TileSeason;
  label: string;
  emoji: string;
}

export interface TilePosition {
  col: number;
  row: number;
  layer: number;
}

export type TileState = 'idle' | 'selected' | 'matched' | 'hint' | 'blocked';

export interface Tile {
  id: string;
  face: TileFace;
  position: TilePosition;
  state: TileState;
  isRemoved: boolean;
  matchedWith?: string; // ID of matched tile
}

// --- Board Types ---

export type LayoutName = 'turtle' | 'fortress' | 'pyramid' | 'bridge' | 'spider';

export interface BoardLayout {
  name: LayoutName;
  positions: TilePosition[];
  displayName: string;
  difficulty: number; // 1-5
  description: string;
}

export interface Board {
  tiles: Tile[];
  layout: BoardLayout;
  seed: string;
  createdAt: number;
}

// --- Game Types ---

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'lost';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface GameMove {
  tile1Id: string;
  tile2Id: string;
  timestamp: number;
  moveNumber: number;
}

export interface GameState {
  board: Board | null;
  status: GameStatus;
  selectedTileId: string | null;
  moves: GameMove[];
  undoStack: GameMove[];
  startTime: number | null;
  elapsed: number;
  hintsUsed: number;
  reshufflesUsed: number;
  difficulty: Difficulty;
  isPaused: boolean;
}

export interface GameStats {
  totalMoves: number;
  matchedPairs: number;
  remainingTiles: number;
  availablePairs: number;
  efficiency: number; // percentage
  timeElapsed: number;
}

// --- Mood Types ---

export type MoodType = 'focus' | 'relax' | 'deep-work' | 'anxiety-reset' | 'creative-flow' | 'night-wind-down';

export interface MoodTheme {
  id: MoodType;
  name: string;
  description: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textMuted: string;
    tileGlow: string;
    particleColor: string;
  };
  animation: {
    speed: number; // multiplier: 0.5 = slow, 1 = normal, 1.5 = fast
    particleIntensity: number; // 0-1
    backgroundMotion: number; // 0-1
  };
  ai: {
    personality: string;
    tone: string;
    verbosity: 'minimal' | 'moderate' | 'expressive';
  };
}

// --- Player Types ---

export type PlayerArchetype = 'strategic-explorer' | 'layer-thinker' | 'fast-pattern-hunter' | 'calm-solver';

export interface PlayerProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  country?: string;
  city?: string;
  createdAt: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  averageTime: number;
  bestTime: number;
  totalMoves: number;
  averageMoves: number;
  hintsUsed: number;
  currentStreak: number;
  bestStreak: number;
  preferredMood: MoodType;
  archetype: PlayerArchetype;
  moveEfficiency: number;
}

// --- Leaderboard Types ---

export type LeaderboardScope = 'global' | 'country' | 'city' | 'daily';

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  score: number;
  time: number;
  country?: string;
  city?: string;
  rank: number;
  createdAt: string;
}

// --- AI Types ---

export interface AICoachMessage {
  id: string;
  type: 'observation' | 'hint' | 'encouragement' | 'warning' | 'summary';
  content: string;
  timestamp: number;
  mood: MoodType;
}

export interface AIGameContext {
  remainingTiles: number;
  totalTiles: number;
  availableMoves: number;
  recentMoves: GameMove[];
  elapsedTime: number;
  hintsUsed: number;
  layerDistribution: Record<number, number>;
  mood: MoodType;
  moveEfficiency: number;
}

export interface AIEndGameSummary {
  playStyle: string;
  strengths: string[];
  observations: string[];
  archetype: PlayerArchetype;
  emotionalReflection: string;
}

// --- Daily Challenge Types ---

export interface DailyChallenge {
  id: string;
  date: string;
  seed: string;
  theme: MoodType;
  difficulty: Difficulty;
}

export interface DailyChallengeResult {
  challengeId: string;
  userId: string;
  time: number;
  moves: number;
  completed: boolean;
  rank?: number;
}

// --- UI Types ---

export interface ModalState {
  isOpen: boolean;
  type: 'settings' | 'results' | 'upgrade' | 'profile' | 'pause' | null;
}

export interface UIState {
  isSidebarOpen: boolean;
  isCoachVisible: boolean;
  modal: ModalState;
  isLoading: boolean;
  reducedMotion: boolean;
}
