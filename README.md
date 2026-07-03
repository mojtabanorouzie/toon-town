# Toon Town 🏠

A React Native (Expo) educational game platform for kids ages 2-6. Kids explore a cartoon town and play story-driven games to learn colors, numbers, animals, shapes, and letters.

## Features

- **Color Match** - Learn and match colors with fun animations
- **Animal Sounds** - Listen to animal sounds and find the matching animal
- **Progress Tracking** - Earn stars and track your progress
- **Toddler Friendly** - Large tap targets, instant feedback, forgiving UX

## Tech Stack

- React Native + Expo (SDK 57)
- Expo Router for navigation
- Zustand for state management
- React Native Reanimated for animations
- Expo AV for sound effects
- Expo Haptics for tactile feedback

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/mojtabanorouzie/toon-town.git
cd toon-town

# Install dependencies
npm install

# Start the app
npx expo start
```

### Running on Device

```bash
# iOS
npx expo start --ios

# Android
npx expo start --android

# Web
npx expo start --web
```

## Project Structure

```
toon-town/
├── app/                          # Expo Router pages
│   ├── index.tsx                 # Home / splash screen
│   ├── town/                     # Town map (hub)
│   └── game/                     # Game screens
├── src/
│   ├── components/               # Shared UI components
│   ├── games/                    # Game modules
│   │   ├── colors/               # Color Match game
│   │   └── animals/              # Animal Sounds game
│   ├── store/                    # Zustand stores
│   ├── audio/                    # Sound manager
│   └── theme/                    # Colors, constants
└── assets/                       # Images, sounds
```

## Adding New Games

1. Create a new folder in `src/games/`
2. Add game data in `data.ts`
3. Create game component in `index.tsx`
4. Register the game in `registry.ts`

## License

MIT
