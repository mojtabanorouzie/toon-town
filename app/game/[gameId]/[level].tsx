import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getGameById } from '../../../src/games/registry';
import { useProgressStore } from '../../../src/store/useProgressStore';
import { colors } from '../../../src/theme/colors';
import { spacing, borderRadius } from '../../../src/theme/constants';
import { triggerHaptic } from '../../../src/utils/haptics';

export default function PlayScreen() {
  const { gameId, level } = useLocalSearchParams<{ gameId: string; level: string }>();
  const router = useRouter();
  const setGameCompleted = useProgressStore((state) => state.setGameCompleted);

  const game = getGameById(gameId || '');
  const levelNumber = parseInt(level || '1', 10);

  if (!game) {
    return null;
  }

  const GameComponent = game.component;

  const handleComplete = (score: number, stars: number) => {
    setGameCompleted(game.id, levelNumber, stars, score);
    router.replace(`/game/${game.id}`);
  };

  const handleBack = async () => {
    await triggerHaptic('light');
    router.replace(`/game/${game.id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>
      <GameComponent
        level={levelNumber}
        onComplete={handleComplete}
        onBack={handleBack}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButtonContainer: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    zIndex: 100,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
