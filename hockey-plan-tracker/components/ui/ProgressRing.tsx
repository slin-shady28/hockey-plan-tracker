import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withRepeat, withSequence,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';

interface ProgressRingProps {
  progress: number; // 0–1
  size?: number;
  label?: string;
}

export function ProgressRing({ progress, size = 120, label }: ProgressRingProps) {
  const animatedProgress = useSharedValue(0);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 600 });
    glowOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 800 }), withTiming(0.5, { duration: 800 })),
      -1,
      true
    );
  }, [progress]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value * 100}%`,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: glowOpacity.value,
    shadowRadius: 8,
  }));

  return (
    <View style={{ width: size, alignItems: 'center', gap: 12 }}>
      <View style={[styles.track, { width: size }]}>
        <Animated.View style={[styles.fill, fillStyle, glowStyle]} />
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, backgroundColor: Colors.surface, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: `${Colors.accent}33` },
  fill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 4 },
  label: { color: Colors.snow, fontWeight: '700', fontSize: 18 },
});
