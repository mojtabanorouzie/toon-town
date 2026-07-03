export interface AnimalData {
  id: string;
  name: string;
  emoji: string;
  sound: string;
  color: string;
}

export const animals: AnimalData[] = [
  { id: 'cat', name: 'Cat', emoji: '🐱', sound: 'Meow!', color: '#FFB347' },
  { id: 'dog', name: 'Dog', emoji: '🐶', sound: 'Woof!', color: '#D2691E' },
  { id: 'cow', name: 'Cow', emoji: '🐮', sound: 'Moo!', color: '#8B4513' },
  { id: 'chicken', name: 'Chicken', emoji: '🐔', sound: 'Cluck!', color: '#FFD700' },
  { id: 'duck', name: 'Duck', emoji: '🦆', sound: 'Quack!', color: '#FFA500' },
  { id: 'pig', name: 'Pig', emoji: '🐷', sound: 'Oink!', color: '#FFB6C1' },
  { id: 'horse', name: 'Horse', emoji: '🐴', sound: 'Neigh!', color: '#8B4513' },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', sound: 'Baa!', color: '#F5F5DC' },
  { id: 'frog', name: 'Frog', emoji: '🐸', sound: 'Ribbit!', color: '#32CD32' },
  { id: 'lion', name: 'Lion', emoji: '🦁', sound: 'Roar!', color: '#FFD700' },
];

export const levelConfig = [
  { level: 1, choices: 2, rounds: 3 },
  { level: 2, choices: 4, rounds: 3 },
  { level: 3, choices: 6, rounds: 4 },
  { level: 4, choices: 8, rounds: 4 },
  { level: 5, choices: 10, rounds: 5 },
];

export function getAnimalsForLevel(level: number): AnimalData[] {
  const config = levelConfig[Math.min(level - 1, levelConfig.length - 1)];
  return animals.slice(0, config.choices);
}

export function getRoundsForLevel(level: number): number {
  const config = levelConfig[Math.min(level - 1, levelConfig.length - 1)];
  return config.rounds;
}
