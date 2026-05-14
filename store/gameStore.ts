// ============================================
// Mahjoom — Game Store (Zustand)
// ============================================

'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  GameState, GameStatus, Tile, Board, Difficulty, GameMove,
} from '@/types';
import { canMatch } from '@/core/mahjong/tiles';
import {
  isTileFree, findAvailablePairs, removePair, undoMove,
  isGameWon, isGameLost, getHint, calculateGameStats,
} from '@/core/mahjong/rules';
import { reshuffleBoard } from '@/core/mahjong/generator';
import { useMoodStore } from './moodStore';

interface GameStore extends GameState {
  // Actions
  initGame: (board: Board, difficulty?: Difficulty) => void;
  selectTile: (tileId: string) => void;
  useHint: () => [Tile, Tile] | null;
  undoLastMove: () => void;
  reshuffle: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  finishGame: (won: boolean) => void;
  incrementElapsed: () => void;

  // Computed helpers
  getFreeTiles: () => Tile[];
  getAvailablePairs: () => [Tile, Tile][];
  getStats: () => ReturnType<typeof calculateGameStats>;
}

const initialState: GameState = {
  board: null,
  status: 'idle',
  selectedTileId: null,
  moves: [],
  undoStack: [],
  startTime: null,
  elapsed: 0,
  hintsUsed: 0,
  reshufflesUsed: 0,
  difficulty: 'medium',
  isPaused: false,
};

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    initGame: (board, difficulty = 'medium') => {
      set({
        ...initialState,
        board,
        difficulty,
        status: 'playing',
        startTime: Date.now(),
      });
    },

    selectTile: (tileId) => {
      const { board, selectedTileId, status, moves } = get();
      if (!board || status !== 'playing') return;

      const tile = board.tiles.find((t) => t.id === tileId);
      if (!tile || tile.isRemoved) return;
      if (!isTileFree(tile, board.tiles)) return;

      // Deselect if clicking the same tile
      if (selectedTileId === tileId) {
        set({ selectedTileId: null });
        return;
      }

      // If another tile is selected, try to match
      if (selectedTileId) {
        const selectedTile = board.tiles.find((t) => t.id === selectedTileId);
        if (!selectedTile) {
          set({ selectedTileId: tileId });
          return;
        }

        // Attempt match
        if (canMatch(selectedTile.face, tile.face)) {
          const move: GameMove = {
            tile1Id: selectedTileId,
            tile2Id: tileId,
            timestamp: Date.now(),
            moveNumber: moves.length + 1,
          };

          const newTiles = removePair(board.tiles, selectedTileId, tileId);
          const newBoard = { ...board, tiles: newTiles };

          let newStatus: GameStatus = 'playing';
          if (isGameWon(newTiles)) newStatus = 'won';
          else if (isGameLost(newTiles)) newStatus = 'lost';

          set({
            board: newBoard,
            selectedTileId: null,
            moves: [...moves, move],
            undoStack: [...get().undoStack, move],
            status: newStatus,
          });
        } else {
          // No match — switch selection to new tile
          set({ selectedTileId: tileId });
        }
      } else {
        set({ selectedTileId: tileId });
      }
    },

    useHint: () => {
      const { board } = get();
      const theme = useMoodStore.getState().theme;
      if (!board || !theme.mechanics.allowHints) return null;
      
      const hint = getHint(board.tiles);
      if (hint) {
        set((s) => ({ hintsUsed: s.hintsUsed + 1 }));
      }
      return hint;
    },

    undoLastMove: () => {
      const { board, undoStack } = get();
      const theme = useMoodStore.getState().theme;
      if (!board || undoStack.length === 0 || !theme.mechanics.allowUndo) return;

      const lastMove = undoStack[undoStack.length - 1];
      const restoredTiles = undoMove(board.tiles, lastMove);

      set({
        board: { ...board, tiles: restoredTiles },
        undoStack: undoStack.slice(0, -1),
        selectedTileId: null,
        status: 'playing',
      });
    },

    finishGame: (won: boolean) => {
      set({ status: won ? 'won' : 'lost', isPaused: false });
    },

    reshuffle: () => {
      const { board } = get();
      if (!board) return;
      const reshuffled = reshuffleBoard(board.tiles, board.seed);
      set({
        board: { ...board, tiles: reshuffled },
        selectedTileId: null,
        reshufflesUsed: get().reshufflesUsed + 1,
      });
    },

    pauseGame: () => set({ isPaused: true, status: 'paused' }),

    resumeGame: () => set({ isPaused: false, status: 'playing' }),

    resetGame: () => set(initialState),

    incrementElapsed: () => set((s) => ({ elapsed: s.elapsed + 1 })),

    getFreeTiles: () => {
      const { board } = get();
      if (!board) return [];
      return board.tiles.filter((t) => !t.isRemoved && isTileFree(t, board.tiles));
    },

    getAvailablePairs: () => {
      const { board } = get();
      if (!board) return [];
      return findAvailablePairs(board.tiles);
    },

    getStats: () => {
      const { board, moves, elapsed } = get();
      if (!board) return { totalMoves: 0, matchedPairs: 0, remainingTiles: 0, availablePairs: 0, efficiency: 0, timeElapsed: 0 };
      return calculateGameStats(board.tiles, moves, elapsed);
    },
  }))
);
