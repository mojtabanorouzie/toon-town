import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight, touchTarget } from '../theme/constants';
import { triggerHaptic } from '../utils/haptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  size?: 'small' | 'medium' | 'large';
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function Card({
  children,
  onPress,
  style,
  variant = 'default',
  size = 'medium',
}: CardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: spacing.sm,
          minHeight: 60,
        };
      case 'medium':
        return {
          padding: spacing.md,
          minHeight: touchTarget.min,
        };
      case 'large':
        return {
          padding: spacing.lg,
          minHeight: touchTarget.recommended,
        };
    }
  };

  return (
    <AnimatedView
      style={[
        styles.container,
        getVariantStyles(),
        getSizeStyles(),
        animatedStyle,
        style,
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
