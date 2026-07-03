import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressState {
  completedLevels: Record<string, number[]>;
  totalStars: number;
  highScores: Record<string, number>;
  setGameCompleted: (gameId: string, level: number, stars: number, score: number) => void;
  getCompletedLevels: (gameId: string) => number[];
  getStars: (gameId: string) => number;
  getHighScore: (gameId: string) => number;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLevels: {},
      totalStars: 0,
      highScores: {},

      setGameCompleted: (gameId: string, level: number, stars: number, score: number) => {
        const state = get();
        const currentLevels = state.completedLevels[gameId] || [];
        const currentStars = state.highScores[gameId] || 0;

        if (!currentLevels.includes(level)) {
          set({
            completedLevels: {
              ...state.completedLevels,
              [gameId]: [...currentLevels, level],
            },
            totalStars: state.totalStars + stars,
            highScores: {
              ...state.highScores,
              [gameId]: Math.max(currentStars, score),
            },
          });
        } else if (score > currentStars) {
          set({
            highScores: {
              ...state.highScores,
              [gameId]: score,
            },
          });
        }
      },

      getCompletedLevels: (gameId: string) => {
        return get().completedLevels[gameId] || [];
      },

      getStars: (gameId: string) => {
        const levels = get().completedLevels[gameId] || [];
        return levels.length;
      },

      getHighScore: (gameId: string) => {
        return get().highScores[gameId] || 0;
      },

      resetProgress: () => {
        set({
          completedLevels: {},
          totalStars: 0,
          highScores: {},
        });
      },
    }),
    {
      name: 'toontown-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
