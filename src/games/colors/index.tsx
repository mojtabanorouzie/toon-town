import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight, touchTarget, borderRadius } from '../../theme/constants';
import { ProgressBar } from '../../components/ProgressBar';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { SoundManager } from '../../audio/SoundManager';
import { triggerHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '../../utils/haptics';
import { shuffle, pickRandom } from '../../utils/shuffle';
import { colors as colorData, getColorsForLevel, getRoundsForLevel, ColorData } from './data';
import type { GameScreenProps } from '../types';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width * 0.38, 140);

export function ColorMatchGame({ level, onComplete, onBack }: GameScreenProps) {
  const [targetColor, setTargetColor] = useState<ColorData | null>(null);
  const [choices, setChoices] = useState<ColorData[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const totalRounds = getRoundsForLevel(level);
  const availableColors = getColorsForLevel(level);

  const setupRound = useCallback(() => {
    const target = pickRandom(availableColors, 1)[0];
    const distractors = availableColors.filter((c) => c.id !== target.id);
    const roundChoices = [target, ...pickRandom(distractors, Math.min(3, distractors.length))];
    setTargetColor(target);
    setChoices(shuffle(roundChoices));
    setSelectedId(null);
    setIsCorrect(null);
  }, [availableColors]);

  useEffect(() => {
    setupRound();
  }, [setupRound]);

  const handleChoice = async (color: ColorData) => {
    if (selectedId) return;

    setSelectedId(color.id);
    const correct = color.id === targetColor?.id;
    setIsCorrect(correct);

    if (correct) {
      await triggerSuccessHaptic();
      await SoundManager.playFeedback('correct');
      setScore((prev) => prev + 1);

      setTimeout(() => {
        if (currentRound + 1 >= totalRounds) {
          const stars = score + 1 >= totalRounds ? 3 : score + 1 >= totalRounds * 0.6 ? 2 : 1;
          setShowCelebration(true);
          setTimeout(() => {
            onComplete(score + 1, stars);
          }, 2000);
        } else {
          setCurrentRound((prev) => prev + 1);
          setupRound();
        }
      }, 800);
    } else {
      await triggerErrorHaptic();
      await SoundManager.playFeedback('wrong');
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
      }, 600);
    }
  };

  const getCardStyle = (color: ColorData) => {
    const isSelected = selectedId === color.id;
    const isTarget = color.id === targetColor?.id;

    return {
      backgroundColor: color.hex,
      transform: [{ scale: isSelected ? (isCorrect ? 1.1 : 0.9) : 1 }],
      borderWidth: isSelected ? 4 : 0,
      borderColor: isSelected
        ? isCorrect
          ? colors.success
          : colors.error
        : 'transparent',
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.level}>Level {level}</Text>
        <ProgressBar current={currentRound} total={totalRounds} color={colors.primary} />
        <Text style={styles.score}>Score: {score}/{totalRounds}</Text>
      </View>

      <View style={styles.targetContainer}>
        <Text style={styles.instruction}>Find this color!</Text>
        <View style={[styles.targetColor, { backgroundColor: targetColor?.hex }]} />
        <Text style={styles.targetName}>{targetColor?.name}</Text>
      </View>

      <View style={styles.choicesContainer}>
        {choices.map((color) => (
          <Animated.View key={color.id} style={[styles.cardWrapper, getCardStyle(color)]}>
            <Animated.View
              style={styles.card}
              onTouchEnd={() => handleChoice(color)}
            >
              <Text style={styles.colorEmoji}>{color.emoji}</Text>
            </Animated.View>
          </Animated.View>
        ))}
      </View>

      <CelebrationOverlay
        visible={showCelebration}
        stars={score >= totalRounds ? 3 : score >= totalRounds * 0.6 ? 2 : 1}
        message="Colors Master!"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  level: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  score: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  targetContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  instruction: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  targetColor: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  targetName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  choicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
  },
  cardWrapper: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorEmoji: {
    fontSize: 48,
  },
});
