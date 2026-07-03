export interface ColorData {
  id: string;
  name: string;
  hex: string;
  emoji: string;
}

export const colors: ColorData[] = [
  { id: 'red', name: 'Red', hex: '#FF6B6B', emoji: '🔴' },
  { id: 'blue', name: 'Blue', hex: '#4ECDC4', emoji: '🔵' },
  { id: 'yellow', name: 'Yellow', hex: '#FFE66D', emoji: '🟡' },
  { id: 'green', name: 'Green', hex: '#A8E6CF', emoji: '🟢' },
  { id: 'purple', name: 'Purple', hex: '#DDA0DD', emoji: '🟣' },
  { id: 'orange', name: 'Orange', hex: '#FFB347', emoji: '🟠' },
  { id: 'pink', name: 'Pink', hex: '#FFB6C1', emoji: '🩷' },
  { id: 'brown', name: 'Brown', hex: '#D2691E', emoji: '🟤' },
];

export const levelConfig = [
  { level: 1, choices: 2, rounds: 3 },
  { level: 2, choices: 3, rounds: 3 },
  { level: 3, choices: 4, rounds: 4 },
  { level: 4, choices: 6, rounds: 4 },
  { level: 5, choices: 8, rounds: 5 },
];

export function getColorsForLevel(level: number): ColorData[] {
  const config = levelConfig[Math.min(level - 1, levelConfig.length - 1)];
  return colors.slice(0, config.choices);
}

export function getRoundsForLevel(level: number): number {
  const config = levelConfig[Math.min(level - 1, levelConfig.length - 1)];
  return config.rounds;
}
