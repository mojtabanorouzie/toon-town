import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fontSize, fontWeight, spacing } from '../theme/constants';

const { width, height } = Dimensions.get('window');

interface CelebrationOverlayProps {
  visible: boolean;
  stars: number;
  message?: string;
  onDismiss?: () => void;
}

interface StarProps {
  delay: number;
  size: number;
  x: number;
  y: number;
}

function AnimatedStar({ delay, size, x, y }: StarProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      rotation.value = withRepeat(
        withSequence(
          withTiming(20, { duration: 500 }),
          withTiming(-20, { duration: 500 })
        ),
        -1,
        true
      );
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        { width: size, height: size, left: x, top: y },
        animatedStyle,
      ]}
    >
      <Text style={styles.starText}>⭐</Text>
    </Animated.View>
  );
}

export function CelebrationOverlay({
  visible,
  stars,
  message = 'Great Job!',
  onDismiss,
}: CelebrationOverlayProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withSpring(1, { damping: 10, stiffness: 200 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.5, { duration: 200 });
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  const starPositions = Array.from({ length: stars }, (_, i) => ({
    delay: i * 200,
    size: 40 + Math.random() * 20,
    x: width * 0.2 + Math.random() * width * 0.6,
    y: height * 0.3 + Math.random() * height * 0.2,
  }));

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      {starPositions.map((pos, index) => (
        <AnimatedStar key={index} {...pos} />
      ))}
      <Animated.View style={[styles.content, contentStyle]}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.stars}>
          {Array(stars).fill('⭐').join(' ')}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: '80%',
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  message: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stars: {
    fontSize: fontSize.xl,
    letterSpacing: 8,
  },
  star: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starText: {
    fontSize: 24,
  },
});
