import React from 'react';

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  component: React.ComponentType<GameScreenProps>;
  topics: string[];
  maxLevel: number;
}

export interface GameScreenProps {
  level: number;
  onComplete: (score: number, stars: number) => void;
  onBack: () => void;
}

export interface GameState {
  currentLevel: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  isComplete: boolean;
}

export interface ProgressData {
  completedLevels: number[];
  totalStars: number;
  highScore: number;
}
