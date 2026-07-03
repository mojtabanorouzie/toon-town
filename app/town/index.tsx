import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { games } from '../../src/games/registry';
import { useProgressStore } from '../../src/store/useProgressStore';
import { colors, gameColors } from '../../src/theme/colors';
import { spacing, fontSize, fontWeight, borderRadius, touchTarget } from '../../src/theme/constants';
import { triggerHaptic } from '../../src/utils/haptics';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.42;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function GameBuilding({ game, index }: { game: typeof games[0]; index: number }) {
  const router = useRouter();
  const getStars = useProgressStore((state) => state.getStars);
  const scale = useSharedValue(1);

  const stars = getStars(game.id);
  const isLocked = index > 1; // Only first 2 games are unlocked

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = async () => {
    await triggerHaptic('light');
    if (!isLocked) {
      router.push(`/game/${game.id}`);
    }
  };

  return (
    <AnimatedTouchable
      style={[styles.building, animatedStyle, isLocked && styles.lockedBuilding]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <View style={[styles.buildingIcon, { backgroundColor: isLocked ? colors.locked : game.color }]}>
        <Ionicons
          name={game.icon as any}
          size={40}
          color={colors.textInverse}
        />
      </View>
      <Text style={[styles.buildingTitle, isLocked && styles.lockedText]}>
        {game.title}
      </Text>
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((i) => (
          <Text
            key={i}
            style={[styles.star, i <= stars && styles.starEarned]}
          >
            {i <= stars ? '⭐' : '☆'}
          </Text>
        ))}
      </View>
      {isLocked && (
        <View style={styles.lockOverlay}>
          <Ionicons name="lock-closed" size={24} color={colors.locked} />
        </View>
      )}
    </AnimatedTouchable>
  );
}

export default function TownScreen() {
  const totalStars = useProgressStore((state) => state.totalStars);
  const maxStars = games.length * 3;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏠 Toon Town</Text>
        <Text style={styles.starsCount}>⭐ {totalStars}/{maxStars}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.buildingsGrid}>
          {games.map((game, index) => (
            <GameBuilding key={game.id} game={game} index={index} />
          ))}
        </View>

        <View style={styles.lockedSection}>
          <Text style={styles.lockedTitle}>Coming Soon!</Text>
          <View style={styles.lockedGames}>
            {['Numbers', 'Shapes', 'Letters'].map((name, i) => (
              <View key={name} style={styles.lockedGame}>
                <View style={[styles.lockedIcon, { backgroundColor: colors.lockedLight }]}>
                  <Ionicons name="lock-closed" size={20} color={colors.locked} />
                </View>
                <Text style={styles.lockedGameText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sky,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  starsCount: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl * 2,
  },
  buildingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  building: {
    width: CARD_SIZE,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  lockedBuilding: {
    opacity: 0.7,
  },
  buildingIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  buildingTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  lockedText: {
    color: colors.locked,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  star: {
    fontSize: 20,
    color: colors.starEmpty,
  },
  starEarned: {
    color: colors.star,
  },
  lockOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  lockedSection: {
    marginTop: spacing.xxl,
  },
  lockedTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  lockedGames: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  lockedGame: {
    alignItems: 'center',
  },
  lockedIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lockedGameText: {
    fontSize: fontSize.sm,
    color: colors.locked,
    fontWeight: fontWeight.medium,
  },
});
