import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { daysInMonth } from '../utils/date';

interface StreakCalendarProps {
  year: number;
  month: number;
  activeDates: Set<string>;
}

export function StreakCalendar({ year, month, activeDates }: StreakCalendarProps) {
  const days = daysInMonth(year, month);
  const monthStr = `${year}-${String(month).padStart(2, '0')}`;

  return (
    <View style={styles.grid}>
      {Array.from({ length: days }, (_, i) => {
        const day = i + 1;
        const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
        const isActive = activeDates.has(dateStr);
        return <CalendarCell key={day} day={day} isActive={isActive} index={i} />;
      })}
    </View>
  );
}

function CalendarCell({ day, isActive, index }: { day: number; isActive: boolean; index: number }) {
  const opacity = useSharedValue(isActive ? 0 : 0.3);
  const scale = useSharedValue(isActive ? 0.6 : 1);

  useEffect(() => {
    if (isActive) {
      opacity.value = withDelay(index * 20, withTiming(1, { duration: 300 }));
      scale.value = withDelay(index * 20, withTiming(1, { duration: 300 }));
    } else {
      opacity.value = withTiming(0.3, { duration: 200 });
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isActive]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[styles.cell, isActive && styles.cellActive, style]}>
      <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  cell: { width: 36, height: 36, borderRadius: 6, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  cellActive: { backgroundColor: `${Colors.accent}33`, borderWidth: 1, borderColor: Colors.accent },
  dayText: { color: Colors.textMuted, fontSize: 12, fontWeight: '500' },
  dayTextActive: { color: Colors.accent, fontWeight: '700' },
});
