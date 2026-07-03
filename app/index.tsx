import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { SoundManager } from '../src/audio/SoundManager';
import { colors } from '../src/theme/colors';
import { spacing, fontSize, fontWeight } from '../src/theme/constants';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const titleScale = useSharedValue(0.8);
  const characterY = useSharedValue(0);

  useEffect(() => {
    SoundManager.initialize();

    titleScale.value = withSpring(1, { damping: 10, stiffness: 200 });
    characterY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const characterStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: characterY.value }],
  }));

  const handleStart = () => {
    router.push('/town');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sky} />
      <View style={styles.ground} />

      <Animated.View style={[styles.character, characterStyle]}>
        <Text style={styles.characterEmoji}>🏠</Text>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleStyle]}>
          <Text style={styles.title}>Toon Town</Text>
          <Text style={styles.subtitle}>Where learning is an adventure!</Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Button
            title="Let's Play!"
            onPress={handleStart}
            variant="primary"
            size="large"
            icon="play"
          />
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🎨</Text>
            <Text style={styles.featureText}>Colors</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🐾</Text>
            <Text style={styles.featureText}>Animals</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🔢</Text>
            <Text style={styles.featureText}>Numbers</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.6,
    backgroundColor: colors.sky,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: colors.grass,
  },
  character: {
    position: 'absolute',
    top: height * 0.15,
    alignSelf: 'center',
  },
  characterEmoji: {
    fontSize: 120,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xxl,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textLight,
    marginTop: spacing.sm,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl,
  },
  feature: {
    alignItems: 'center',
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
});
