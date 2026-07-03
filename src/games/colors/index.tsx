import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../../theme/constants';
import { ProgressBar } from '../../components/ProgressBar';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { SoundManager } from '../../audio/SoundManager';
import { triggerSuccessHaptic, triggerErrorHaptic } from '../../utils/haptics';
import { shuffle, pickRandom } from '../../utils/shuffle';
import { getColorsForLevel, getRoundsForLevel, ColorData } from './data';
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
  const mountedRef = useRef(true);

  const totalRounds = useMemo(() => getRoundsForLevel(level), [level]);
  const availableColors = useMemo(() => getColorsForLevel(level), [level]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const setupRound = useCallback(() => {
    if (!mountedRef.current) return;
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
  }, [level]);

  const handleChoice = useCallback(async (color: ColorData) => {
    if (selectedId) return;

    setSelectedId(color.id);
    const correct = color.id === targetColor?.id;
    setIsCorrect(correct);

    if (correct) {
      await triggerSuccessHaptic();
      await SoundManager.playFeedback('correct');
      setScore((prev) => prev + 1);

      setTimeout(() => {
        if (!mountedRef.current) return;
        setCurrentRound((prev) => {
          const nextRound = prev + 1;
          if (nextRound >= totalRounds) {
            setScore((s) => {
              const finalScore = s + 1;
              const stars = finalScore >= totalRounds ? 3 : finalScore >= totalRounds * 0.6 ? 2 : 1;
              setShowCelebration(true);
              setTimeout(() => {
                if (mountedRef.current) onComplete(finalScore, stars);
              }, 2000);
              return s;
            });
          } else {
            setTimeout(() => setupRound(), 100);
          }
          return nextRound;
        });
      }, 800);
    } else {
      await triggerErrorHaptic();
      await SoundManager.playFeedback('wrong');
      setTimeout(() => {
        if (mountedRef.current) {
          setSelectedId(null);
          setIsCorrect(null);
        }
      }, 600);
    }
  }, [selectedId, targetColor, totalRounds, onComplete, setupRound]);

  const getCardStyle = (color: ColorData) => {
    const isSelected = selectedId === color.id;
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
          <TouchableOpacity
            key={color.id}
            style={[styles.cardWrapper, getCardStyle(color)]}
            onPress={() => handleChoice(color)}
            activeOpacity={0.7}
          >
            <View style={styles.card}>
              <Text style={styles.colorEmoji}>{color.emoji}</Text>
            </View>
          </TouchableOpacity>
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
