import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { IceParticles } from '../../components/ui/IceParticles';
import { DrillItem } from '../../components/DrillItem';
import { IceButton } from '../../components/ui/IceButton';
import { usePlanStore } from '../../store/planStore';
import { getDb } from '../../db/client';
import { insertSession } from '../../db/queries/sessions';
import { todayISO } from '../../utils/date';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function RoutineTab() {
  const plan = usePlanStore(s => s.plan);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(DAYS.includes(today) ? today : 'Monday');
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const dayPlan = plan?.plan_data.weekly_schedule.find(d => d.day === selectedDay);

  function toggleDrill(name: string) {
    setCompleted(prev => ({ ...prev, [name]: !prev[name] }));
  }

  function rateDrill(name: string, rating: number) {
    setRatings(prev => ({ ...prev, [name]: rating }));
  }

  function saveSession() {
    const drillsDone = Object.entries(completed).filter(([, done]) => done).map(([name]) => name);
    const avgRating = Object.values(ratings).length > 0
      ? Math.round(Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length)
      : undefined;
    const totalMin = dayPlan?.drills.filter(d => completed[d.name]).reduce((sum, d) => sum + d.duration, 0);

    const db = getDb();
    insertSession(db, {
      date: todayISO(),
      drills_completed: drillsDone,
      quality_rating: avgRating,
      duration_minutes: totalMin,
    });

    setCompleted({});
    setRatings({});
  }

  const completedCount = Object.values(completed).filter(Boolean).length;
  const totalDrills = dayPlan?.drills.length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h1, styles.title]}>📅 Your Routine</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker}>
          {DAYS.map(day => (
            <TouchableOpacity
              key={day}
              style={[styles.dayChip, selectedDay === day && styles.dayChipActive]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={[Typography.caption, selectedDay === day && { color: Colors.accent }]}>
                {day.slice(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!plan && <Text style={Typography.body}>Generate your plan first on the Know Your Target tab.</Text>}

        {dayPlan?.drills.map(drill => (
          <DrillItem
            key={drill.name}
            name={drill.name}
            duration={drill.duration}
            why={drill.why}
            completed={!!completed[drill.name]}
            rating={ratings[drill.name]}
            onToggle={() => toggleDrill(drill.name)}
            onRate={(r) => rateDrill(drill.name, r)}
          />
        ))}

        {completedCount > 0 && completedCount === totalDrills && (
          <IceButton label="✅ Save Session" onPress={saveSession} style={{ marginTop: 8 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  title: { marginBottom: 12 },
  dayPicker: { marginBottom: 16 },
  dayChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: `${Colors.textMuted}44`, marginRight: 8, backgroundColor: Colors.surface },
  dayChipActive: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}22` },
});
