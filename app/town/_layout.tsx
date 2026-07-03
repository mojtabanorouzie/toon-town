import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function TownLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.sky },
      }}
    />
  );
}
