import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';

interface IceButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
}

export function IceButton({ label, onPress, variant = 'primary', style, disabled }: IceButtonProps) {
  if (variant === 'ghost') {
    return (
      <TouchableOpacity style={[styles.ghost, style]} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
        <Text style={styles.ghostText}>{label}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={[Colors.accent, Colors.electric]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.primary, disabled && styles.disabled]}
      >
        <Text style={styles.primaryText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' },
  primaryText: { color: Colors.background, fontWeight: '700', fontSize: 16 },
  ghost: { borderRadius: 12, borderWidth: 1, borderColor: Colors.accent, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' },
  ghostText: { color: Colors.accent, fontWeight: '600', fontSize: 16 },
  disabled: { opacity: 0.5 },
});
