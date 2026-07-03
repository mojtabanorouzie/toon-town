import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing, borderRadius, fontSize, fontWeight, touchTarget } from '../theme/constants';
import { triggerHaptic } from '../utils/haptics';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = async () => {
    await triggerHaptic('light');
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { backgroundColor: colors.primary },
          text: { color: colors.textInverse },
        };
      case 'secondary':
        return {
          container: { backgroundColor: colors.secondary },
          text: { color: colors.textInverse },
        };
      case 'accent':
        return {
          container: { backgroundColor: colors.accent },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
          text: { fontSize: fontSize.sm },
          iconSize: 16,
        };
      case 'medium':
        return {
          container: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
          text: { fontSize: fontSize.lg },
          iconSize: 20,
        };
      case 'large':
        return {
          container: {
            minHeight: touchTarget.recommended,
            paddingVertical: spacing.lg,
            paddingHorizontal: spacing.xl,
          },
          text: { fontSize: fontSize.xl },
          iconSize: 24,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <AnimatedTouchable
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={variantStyles.text.color}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, sizeStyles.text, variantStyles.text, textStyle]}>
        {title}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    minHeight: touchTarget.min,
  },
  text: {
    fontWeight: fontWeight.bold,
  },
  icon: {
    marginRight: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});
