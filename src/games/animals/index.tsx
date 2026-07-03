import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, fontSize, fontWeight, touchTarget, borderRadius } from '../../theme/constants';
import { ProgressBar } from '../../components/ProgressBar';
import { CelebrationOverlay } from '../../components/CelebrationOverlay';
import { SoundManager } from '../../audio/SoundManager';
import { triggerHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '../../utils/haptics';
import { shuffle, pickRandom } from '../../utils/shuffle';
import { animals as animalData, getAnimalsForLevel, getRoundsForLevel, AnimalData } from './data';
import type { GameScreenProps } from '../types';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min(width * 0.38, 140);

export function AnimalSoundsGame({ level, onComplete, onBack }: GameScreenProps) {
  const [targetAnimal, setTargetAnimal] = useState<AnimalData | null>(null);
  const [choices, setChoices] = useState<AnimalData[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [revealedAnimals, setRevealedAnimals] = useState<Set<string>>(new Set());

  const totalRounds = getRoundsForLevel(level);
  const availableAnimals = getAnimalsForLevel(level);

  const setupRound = useCallback(() => {
    const target = pickRandom(availableAnimals, 1)[0];
    const distractors = availableAnimals.filter((a) => a.id !== target.id);
    const roundChoices = [target, ...pickRandom(distractors, Math.min(3, distractors.length))];
    setTargetAnimal(target);
    setChoices(shuffle(roundChoices));
    setSelectedId(null);
    setIsCorrect(null);
    setRevealedAnimals(new Set());

    // Play the animal sound
    setTimeout(() => {
      SoundManager.playSound(`animal-${target.id}`, 1.0);
    }, 500);
  }, [availableAnimals]);

  useEffect(() => {
    setupRound();
  }, [setupRound]);

  const handleChoice = async (animal: AnimalData) => {
    if (selectedId) return;

    setSelectedId(animal.id);
    setRevealedAnimals((prev) => new Set([...prev, animal.id]));

    const correct = animal.id === targetAnimal?.id;
    setIsCorrect(correct);

    if (correct) {
      await triggerSuccessHaptic();
      await SoundManager.playSound(`animal-${animal.id}`, 1.0);
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
      }, 1000);
    } else {
      await triggerErrorHaptic();
      await SoundManager.playFeedback('wrong');
      setTimeout(() => {
        setSelectedId(null);
        setIsCorrect(null);
        setRevealedAnimals((prev) => {
          const next = new Set(prev);
          next.delete(animal.id);
          return next;
        });
      }, 800);
    }
  };

  const handlePlaySound = async () => {
    if (targetAnimal) {
      await triggerHaptic('light');
      await SoundManager.playSound(`animal-${targetAnimal.id}`, 1.0);
    }
  };

  const getCardStyle = (animal: AnimalData) => {
    const isSelected = selectedId === animal.id;
    const isTarget = animal.id === targetAnimal?.id;
    const isRevealed = revealedAnimals.has(animal.id);

    return {
      backgroundColor: isRevealed ? animal.color : colors.lockedLight,
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
        <ProgressBar current={currentRound} total={totalRounds} color={colors.secondary} />
        <Text style={styles.score}>Score: {score}/{totalRounds}</Text>
      </View>

      <View style={styles.soundContainer}>
        <Text style={styles.instruction}>Listen and find the animal!</Text>
        <Animated.View
          style={styles.soundButton}
          onTouchEnd={handlePlaySound}
        >
          <Ionicons name="volume-high" size={48} color={colors.textInverse} />
          <Text style={styles.soundText}>{targetAnimal?.sound}</Text>
        </Animated.View>
      </View>

      <View style={styles.choicesContainer}>
        {choices.map((animal) => (
          <Animated.View key={animal.id} style={[styles.cardWrapper, getCardStyle(animal)]}>
            <Animated.View
              style={styles.card}
              onTouchEnd={() => handleChoice(animal)}
            >
              <Text style={styles.animalEmoji}>
                {revealedAnimals.has(animal.id) ? animal.emoji : '❓'}
              </Text>
              {revealedAnimals.has(animal.id) && (
                <Text style={styles.animalName}>{animal.name}</Text>
              )}
            </Animated.View>
          </Animated.View>
        ))}
      </View>

      <CelebrationOverlay
        visible={showCelebration}
        stars={score >= totalRounds ? 3 : score >= totalRounds * 0.6 ? 2 : 1}
        message="Animal Expert!"
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
  soundContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  instruction: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  soundButton: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  soundText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textInverse,
    marginTop: spacing.sm,
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
  animalEmoji: {
    fontSize: 48,
  },
  animalName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.xs,
  },
});
