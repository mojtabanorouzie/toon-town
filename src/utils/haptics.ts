import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light'): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch (error) {
    // Haptics not available on all devices
    console.log('Haptic feedback not available');
  }
}

export async function triggerSuccessHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    console.log('Haptic feedback not available');
  }
}

export async function triggerErrorHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    console.log('Haptic feedback not available');
  }
}
