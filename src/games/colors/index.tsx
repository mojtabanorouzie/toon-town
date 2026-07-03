import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
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

const { width, height } = Dimensions.get('window');
const TILE_HEIGHT = height * 0.38;

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.level}>Level {level}</Text>
        <ProgressBar current={currentRound} total={totalRounds} color={colors.primary} />
      </View>

      <View style={styles.targetContainer}>
        <Text style={styles.instruction}>Find this color!</Text>
        <View style={[styles.targetColor, { backgroundColor: targetColor?.hex }]} />
        <Text style={styles.targetName}>{targetColor?.name}</Text>
      </View>

      <View style={styles.choicesContainer}>
        {choices.map((color) => {
          const isSelected = selectedId === color.id;
          const isTarget = color.id === targetColor?.id;

          return (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorTile,
                { backgroundColor: color.hex },
                isSelected && isCorrect && styles.correctTile,
                isSelected && !isCorrect && styles.wrongTile,
              ]}
              onPress={() => handleChoice(color)}
              activeOpacity={0.85}
            >
              <Text style={styles.colorEmoji}>{color.emoji}</Text>
              <Text style={[styles.colorLabel, { color: getContrastColor(color.hex) }]}>
                {color.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CelebrationOverlay
        visible={showCelebration}
        stars={score >= totalRounds ? 3 : score >= totalRounds * 0.6 ? 2 : 1}
        message="Colors Master!"
      />
    </SafeAreaView>
  );
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#2D3436' : '#FFFFFF';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  level: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  targetContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  instruction: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  targetColor: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xs,
  },
  targetName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  choicesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  colorTile: {
    width: width * 0.45,
    height: TILE_HEIGHT,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  correctTile: {
    borderWidth: 6,
    borderColor: colors.success,
    transform: [{ scale: 1.05 }],
  },
  wrongTile: {
    borderWidth: 6,
    borderColor: colors.error,
    transform: [{ scale: 0.95 }],
  },
  colorEmoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  colorLabel: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
});
