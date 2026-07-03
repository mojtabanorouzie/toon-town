import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getGameById } from '../../src/games/registry';
import { useProgressStore } from '../../src/store/useProgressStore';
import { colors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius, touchTarget } from '../../src/theme/constants';
import { triggerHaptic } from '../../src/utils/haptics';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function GameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const getCompletedLevels = useProgressStore((state) => state.getCompletedLevels);
  const setGameCompleted = useProgressStore((state) => state.setGameCompleted);

  const game = getGameById(gameId || '');

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const completedLevels = getCompletedLevels(game.id);
  const nextLevel = completedLevels.length + 1;

  const handleLevelSelect = async (level: number) => {
    await triggerHaptic('light');
    router.push(`/game/${game.id}/${level}`);
  };

  const handleBack = async () => {
    await triggerHaptic('light');
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{game.title}</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={[styles.gameIcon, { backgroundColor: game.color }]}>
          <Ionicons name={game.icon as any} size={64} color={colors.textInverse} />
        </View>

        <Text style={styles.description}>{game.description}</Text>

        <Text style={styles.levelTitle}>Select Level</Text>

        <View style={styles.levelsGrid}>
          {Array.from({ length: game.maxLevel }, (_, i) => i + 1).map((level) => {
            const isCompleted = completedLevels.includes(level);
            const isLocked = level > nextLevel;
            const isCurrent = level === nextLevel;

            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  isCompleted && styles.levelCompleted,
                  isCurrent && styles.levelCurrent,
                  isLocked && styles.levelLocked,
                ]}
                onPress={() => !isLocked && handleLevelSelect(level)}
                disabled={isLocked}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark-circle" size={32} color={colors.success} />
                ) : isLocked ? (
                  <Ionicons name="lock-closed" size={32} color={colors.locked} />
                ) : (
                  <Text style={styles.levelNumber}>{level}</Text>
                )}
                <Text style={[styles.levelText, isLocked && styles.levelTextLocked]}>
                  Level {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xxl,
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  gameIcon: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: fontSize.lg,
    color: colors.textLight,
    marginBottom: spacing.xl,
  },
  levelTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
    alignSelf: 'flex-start',
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  levelButton: {
    width: 100,
    height: 100,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelCompleted: {
    backgroundColor: colors.successLight,
  },
  levelCurrent: {
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  levelLocked: {
    backgroundColor: colors.lockedLight,
  },
  levelNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  levelText: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  levelTextLocked: {
    color: colors.locked,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
