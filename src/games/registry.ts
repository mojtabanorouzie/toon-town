import { GameConfig } from './types';
import { ColorMatchGame } from './colors';
import { AnimalSoundsGame } from './animals';

export const games: GameConfig[] = [
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match the colors!',
    icon: 'color-palette',
    color: '#FF6B6B',
    component: ColorMatchGame,
    topics: ['colors'],
    maxLevel: 5,
  },
  {
    id: 'animal-sounds',
    title: 'Animal Sounds',
    description: 'Listen and find the animal!',
    icon: 'volume-high',
    color: '#4ECDC4',
    component: AnimalSoundsGame,
    topics: ['animals'],
    maxLevel: 5,
  },
];

export function getGameById(id: string): GameConfig | undefined {
  return games.find((game) => game.id === id);
}

export function getGamesByTopic(topic: string): GameConfig[] {
  return games.filter((game) => game.topics.includes(topic));
}
