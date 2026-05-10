import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { IceCard } from '../../components/ui/IceCard';
import { IceButton } from '../../components/ui/IceButton';
import { IceParticles } from '../../components/ui/IceParticles';
import { useProfileStore } from '../../store/profileStore';
import { usePlanStore } from '../../store/planStore';
import { getDb } from '../../db/client';
import { getLatestPlan, insertPlan } from '../../db/queries/plan';
import { updateProfile } from '../../db/queries/profile';
import { generatePlan } from '../../api/generatePlan';

export default function TargetTab() {
  const profile = useProfileStore(s => s.profile);
  const { plan, setPlan, isGenerating, setIsGenerating } = usePlanStore();

  useEffect(() => {
    if (!profile) return;
    const db = getDb();
    const existing = getLatestPlan(db, profile.id);
    if (existing) setPlan(existing);
  }, [profile]);

  async function handleGeneratePlan() {
    if (!profile) return;
    setIsGenerating(true);
    try {
      const planData = await generatePlan(profile);
      const db = getDb();
      const now = new Date().toISOString();
      insertPlan(db, { user_profile_id: profile.id, plan_data: planData, created_at: now });
      updateProfile(db, profile.id, { plan_generated_at: now });
      const saved = getLatestPlan(db, profile.id);
      setPlan(saved);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h1, styles.title]}>🎯 Know Your Target</Text>

        {profile && (
          <IceCard style={styles.card}>
            <Text style={Typography.h3}>Your Profile</Text>
            <Text style={[Typography.body, { marginTop: 8 }]}>
              Age: <Text style={{ color: Colors.accent }}>{profile.age}</Text>
              {'  '}Position: <Text style={{ color: Colors.accent, textTransform: 'capitalize' }}>{profile.position}</Text>
              {'  '}Level: <Text style={{ color: Colors.accent, textTransform: 'capitalize' }}>{profile.skill_level}</Text>
            </Text>
            <Text style={[Typography.caption, { marginTop: 8 }]}>Goals: {profile.goals.join(' · ')}</Text>
          </IceCard>
        )}

        {!plan && !isGenerating && (
          <IceCard style={styles.card}>
            <Text style={Typography.body}>Your AI coach is ready to build your personalized plan.</Text>
            <IceButton label="Generate My Plan 🤖" onPress={handleGeneratePlan} style={{ marginTop: 12 }} />
          </IceCard>
        )}

        {isGenerating && (
          <View style={styles.loading}>
            <ActivityIndicator color={Colors.accent} size="large" />
            <Text style={[Typography.body, { marginTop: 12 }]}>Building your plan...</Text>
          </View>
        )}

        {plan && (
          <IceCard style={styles.card}>
            <Text style={Typography.h3}>✅ Plan Ready</Text>
            <Text style={[Typography.body, { marginTop: 8 }]}>
              {plan.plan_data.fundamentals.length} fundamentals · {plan.plan_data.weekly_schedule.length} training days/week
            </Text>
            <IceButton label="Regenerate Plan" onPress={handleGeneratePlan} variant="ghost" style={{ marginTop: 12 }} />
          </IceCard>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, gap: 16 },
  title: { marginBottom: 8 },
  card: { marginBottom: 0 },
  loading: { alignItems: 'center', padding: 32 },
});
