import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { IceCard } from '../components/ui/IceCard';
import { IceButton } from '../components/ui/IceButton';
import { IceParticles } from '../components/ui/IceParticles';
import { getDb } from '../db/client';
import { insertProfile } from '../db/queries/profile';
import { useProfileStore } from '../store/profileStore';

const AGES = Array.from({ length: 9 }, (_, i) => i + 10);
const POSITIONS = ['forward', 'defense', 'goalie'] as const;
const LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
const GOAL_OPTIONS = [
  'Improve skating speed', 'Better wrist shot', 'Make the team',
  'Stronger defensive play', 'Improve stickhandling', 'Score more goals',
  'Better passing', 'Improve positioning',
];

const STEPS = ['Know Your Target', 'Your Position', 'Skill Level', 'Your Goals'];

export default function Onboarding() {
  const router = useRouter();
  const setProfile = useProfileStore(s => s.setProfile);
  const setHasOnboarded = useProfileStore(s => s.setHasOnboarded);

  const [step, setStep] = useState(0);
  const [age, setAge] = useState<number | null>(null);
  const [position, setPosition] = useState<typeof POSITIONS[number] | null>(null);
  const [level, setLevel] = useState<typeof LEVELS[number] | null>(null);
  const [goals, setGoals] = useState<string[]>([]);

  const translateX = useSharedValue(0);

  function goToNextStep() {
    translateX.value = 400;
    setStep(s => s + 1);
    translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
  }

  function advance() {
    translateX.value = withTiming(-400, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(goToNextStep)();
      }
    });
  }

  const cardStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));

  function toggleGoal(goal: string) {
    setGoals(prev =>
      prev.includes(goal) ? prev.filter(g => g !== goal) : prev.length < 3 ? [...prev, goal] : prev
    );
  }

  async function finish() {
    if (!age || !position || !level || goals.length === 0) return;
    const db = getDb();
    insertProfile(db, { age, position, skill_level: level, goals });
    const { getProfile } = await import('../db/queries/profile');
    const profile = getProfile(db);
    setProfile(profile);
    setHasOnboarded(true);
    router.replace('/(tabs)/target');
  }

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <View style={styles.header}>
        <Text style={[Typography.h2, styles.title]}>🏒 Hockey Plan Tracker</Text>
        <View style={styles.steps}>
          {STEPS.map((s, i) => (
            <View key={s} style={[styles.dot, i <= step && { backgroundColor: Colors.accent }]} />
          ))}
        </View>
      </View>

      <Animated.View style={[styles.content, cardStyle]}>
        {step === 0 && (
          <IceCard>
            <Text style={Typography.h3}>Know Your Target</Text>
            <Text style={[Typography.body, { marginVertical: 12 }]}>How old are you?</Text>
            <View style={styles.grid}>
              {AGES.map(a => (
                <TouchableOpacity key={a} style={[styles.chip, age === a && styles.chipSelected]} onPress={() => setAge(a)}>
                  <Text style={[styles.chipText, age === a && styles.chipTextSelected]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <IceButton label="Next →" onPress={advance} disabled={!age} style={{ marginTop: 16 }} />
          </IceCard>
        )}

        {step === 1 && (
          <IceCard>
            <Text style={Typography.h3}>Your Position</Text>
            <Text style={[Typography.body, { marginVertical: 12 }]}>What do you play?</Text>
            {POSITIONS.map(p => (
              <TouchableOpacity key={p} style={[styles.row, position === p && styles.rowSelected]} onPress={() => setPosition(p)}>
                <Text style={[Typography.body, { textTransform: 'capitalize' }, position === p && { color: Colors.accent }]}>{p}</Text>
              </TouchableOpacity>
            ))}
            <IceButton label="Next →" onPress={advance} disabled={!position} style={{ marginTop: 16 }} />
          </IceCard>
        )}

        {step === 2 && (
          <IceCard>
            <Text style={Typography.h3}>Skill Level</Text>
            {LEVELS.map(l => (
              <TouchableOpacity key={l} style={[styles.row, level === l && styles.rowSelected]} onPress={() => setLevel(l)}>
                <Text style={[Typography.body, { textTransform: 'capitalize' }, level === l && { color: Colors.accent }]}>{l}</Text>
              </TouchableOpacity>
            ))}
            <IceButton label="Next →" onPress={advance} disabled={!level} style={{ marginTop: 16 }} />
          </IceCard>
        )}

        {step === 3 && (
          <IceCard>
            <Text style={Typography.h3}>Your Goals</Text>
            <Text style={[Typography.caption, { marginBottom: 12 }]}>Pick up to 3 goals</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {GOAL_OPTIONS.map(g => (
                <TouchableOpacity key={g} style={[styles.row, goals.includes(g) && styles.rowSelected]} onPress={() => toggleGoal(g)}>
                  <Text style={[Typography.body, goals.includes(g) && { color: Colors.accent }]}>{g}</Text>
                  {goals.includes(g) && <Text style={{ color: Colors.accent }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <IceButton label="Generate My Plan 🤖" onPress={finish} disabled={goals.length === 0} style={{ marginTop: 16 }} />
          </IceCard>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 24, alignItems: 'center', gap: 16 },
  title: { color: Colors.accent },
  steps: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.accent },
  content: { flex: 1, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.textMuted },
  chipSelected: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}22` },
  chipText: { color: Colors.text, fontWeight: '600' },
  chipTextSelected: { color: Colors.accent },
  row: { padding: 14, borderRadius: 12, marginBottom: 8, backgroundColor: Colors.surface, borderWidth: 1, borderColor: `${Colors.textMuted}44`, flexDirection: 'row', justifyContent: 'space-between' },
  rowSelected: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}11` },
});
