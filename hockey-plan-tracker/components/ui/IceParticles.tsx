import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
  Easing, interpolate,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 18;

function Particle({ index }: { index: number }) {
  const progress = useSharedValue(Math.random());
  const x = (index / PARTICLE_COUNT) * width + (Math.random() - 0.5) * 40;
  const duration = 8000 + Math.random() * 6000;
  const size = 2 + Math.random() * 3;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [x - 20, x + 20]) },
      { translateY: interpolate(progress.value, [0, 1], [-size, height + size]) },
    ],
    opacity: interpolate(progress.value, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0]),
  }));

  return (
    <Animated.View style={[styles.particle, { width: size, height: size, borderRadius: size / 2 }, style]} />
  );
}

export function IceParticles() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <Particle key={i} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: { position: 'absolute', backgroundColor: Colors.snow },
});
