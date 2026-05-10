import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

interface DrillItemProps {
  name: string;
  duration: number;
  why: string;
  completed: boolean;
  rating?: number;
  onToggle: () => void;
  onRate: (rating: number) => void;
}

export function DrillItem({ name, duration, why, completed, rating, onToggle, onRate }: DrillItemProps) {
  return (
    <View style={[styles.container, completed && styles.completedContainer]}>
      <TouchableOpacity style={styles.row} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.checkbox, completed && styles.checkboxDone]}>
          {completed && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <View style={styles.info}>
          <Text style={[Typography.body, { fontWeight: '600' }, completed && styles.completedText]}>{name}</Text>
          <Text style={Typography.caption}>{duration} min · {why}</Text>
        </View>
      </TouchableOpacity>
      {completed && (
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => onRate(star)}>
              <Text style={{ fontSize: 18, color: star <= (rating ?? 0) ? Colors.amber : Colors.textMuted }}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: `${Colors.accent}22` },
  completedContainer: { borderColor: `${Colors.accent}55`, backgroundColor: `${Colors.accent}0A` },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: Colors.textMuted, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  checkMark: { color: Colors.background, fontWeight: '700', fontSize: 14 },
  info: { flex: 1 },
  completedText: { textDecorationLine: 'line-through', color: Colors.textMuted },
  stars: { flexDirection: 'row', gap: 4, marginTop: 10, justifyContent: 'center' },
});
