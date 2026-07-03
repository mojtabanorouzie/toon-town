import { Audio, AVPlaybackStatus } from 'expo-av';

class SoundManagerClass {
  private sounds: Map<string, Audio.Sound> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      this.isInitialized = true;
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  }

  async preloadSound(key: string, source: any): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync(source);
      this.sounds.set(key, sound);
    } catch (error) {
      console.log(`Failed to preload sound ${key}:`, error);
    }
  }

  async playSound(key: string, volume: number = 1.0): Promise<void> {
    try {
      const sound = this.sounds.get(key);
      if (sound) {
        await sound.setPositionAsync(0);
        await sound.setVolumeAsync(volume);
        await sound.playAsync();
      }
    } catch (error) {
      console.log(`Failed to play sound ${key}:`, error);
    }
  }

  async playFeedback(type: 'correct' | 'wrong'): Promise<void> {
    await this.playSound(type, 0.8);
  }

  async playLevelComplete(): Promise<void> {
    await this.playSound('level-complete', 1.0);
  }

  async playTap(): Promise<void> {
    await this.playSound('tap', 0.5);
  }

  async playAnimalSound(animalId: string): Promise<void> {
    await this.playSound(`animal-${animalId}`, 1.0);
  }

  async stopAll(): Promise<void> {
    for (const sound of this.sounds.values()) {
      try {
        await sound.stopAsync();
      } catch (error) {
        // Ignore errors
      }
    }
  }

  async unloadAll(): Promise<void> {
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore errors
      }
    }
    this.sounds.clear();
  }
}

export const SoundManager = new SoundManagerClass();
