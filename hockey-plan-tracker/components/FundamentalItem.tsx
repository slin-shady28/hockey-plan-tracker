import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withSequence,
} from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';

export type FundamentalStatus = 'not_started' | 'working' | 'mastered';

interface FundamentalItemProps {
  title: string;
  description: string;
  drills: string[];
  status: FundamentalStatus;
  onStatusChange: (status: FundamentalStatus) => void;
}

export function FundamentalItem({ title, description, drills, status, onStatusChange }: FundamentalItemProps) {
  const scale = useSharedValue(1);

  function handlePress() {
    const next: FundamentalStatus =
      status === 'not_started' ? 'working' : status === 'working' ? 'mastered' : 'not_started';
    if (next === 'mastered') {
      scale.value = withSequence(withSpring(1.1), withSpring(0.95), withSpring(1));
    }
    onStatusChange(next);
  }

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const statusColor = status === 'mastered' ? Colors.accent : status === 'working' ? Colors.amber : Colors.textMuted;
  const statusLabel = status === 'mastered' ? '✅ Mastered' : status === 'working' ? '🏒 Working on it' : '○ Not started';

  return (
    <Animated.View style={[styles.container, cardStyle]}>
      <View style={styles.header}>
        <Text style={[Typography.h3, { flex: 1 }]}>{title}</Text>
        <TouchableOpacity onPress={handlePress} style={[styles.statusBadge, { borderColor: statusColor }]}>
          <Text style={[Typography.caption, { color: statusColor }]}>{statusLabel}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[Typography.body, { marginTop: 6 }]}>{description}</Text>
      <View style={styles.drills}>
        {drills.map(drill => (
          <View key={drill} style={styles.drillChip}>
            <Text style={[Typography.caption, { color: Colors.electric }]}>⬡ {drill}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: `${Colors.accent}22`,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  statusBadge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  drills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  drillChip: { backgroundColor: `${Colors.electric}11`, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
});
