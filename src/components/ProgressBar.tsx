import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/constants';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  height?: number;
}

export function ProgressBar({
  current,
  total,
  color = colors.primary,
  height = 12,
}: ProgressBarProps) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(current / total, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.track, { height }]}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: color, height },
            animatedStyle,
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    backgroundColor: colors.backgroundDark,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: borderRadius.full,
  },
});
