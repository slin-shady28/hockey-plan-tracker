import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../theme/colors';

interface IceCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function IceCard({ children, style }: IceCardProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.border} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: `${Colors.surface}CC`,
    borderWidth: 1,
    borderColor: `${Colors.accent}33`,
  },
  border: { ...StyleSheet.absoluteFillObject, borderRadius: 16, borderWidth: 1, borderColor: `${Colors.accent}22` },
  content: { padding: 16 },
});
