import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { IceParticles } from '../../components/ui/IceParticles';
import { IceCard } from '../../components/ui/IceCard';
import { StreakCalendar } from '../../components/StreakCalendar';
import { getDb } from '../../db/client';
import { getStreak, getSessionsForMonth } from '../../db/queries/sessions';

const BADGES = [
  { streak: 3, label: '3-Day Grinder', icon: '🏒' },
  { streak: 7, label: 'Week Warrior', icon: '❄️' },
  { streak: 14, label: 'Two-Week Machine', icon: '💪' },
  { streak: 30, label: 'Iron Skater', icon: '🏆' },
];

export default function DisciplineTab() {
  const [streak, setStreak] = useState(0);
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const now = new Date();

  useEffect(() => {
    const db = getDb();
    setStreak(getStreak(db));
    const sessions = getSessionsForMonth(db, `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    setActiveDates(new Set(sessions.map(s => s.date)));
  }, []);

  const earnedBadges = BADGES.filter(b => streak >= b.streak);

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h1, styles.title]}>🔥 Discipline</Text>

        <IceCard style={styles.card}>
          <View style={styles.streakRow}>
            <Text style={styles.streakNum}>{streak}</Text>
            <View>
              <Text style={Typography.h3}>Day Streak</Text>
              <Text style={Typography.caption}>Keep training daily to grow it</Text>
            </View>
          </View>
        </IceCard>

        <IceCard style={styles.card}>
          <Text style={[Typography.h3, { marginBottom: 12 }]}>
            {now.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <StreakCalendar year={now.getFullYear()} month={now.getMonth() + 1} activeDates={activeDates} />
        </IceCard>

        <IceCard style={styles.card}>
          <Text style={[Typography.h3, { marginBottom: 12 }]}>Badges</Text>
          {BADGES.map(badge => (
            <View key={badge.streak} style={[styles.badgeRow, earnedBadges.includes(badge) && styles.badgeEarned]}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <View>
                <Text style={[Typography.body, { fontWeight: '600' }, !earnedBadges.includes(badge) && { color: Colors.textMuted }]}>
                  {badge.label}
                </Text>
                <Text style={Typography.caption}>{badge.streak}-day streak</Text>
              </View>
              {earnedBadges.includes(badge) && <Text style={{ color: Colors.accent, marginLeft: 'auto' }}>✓</Text>}
            </View>
          ))}
        </IceCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20, gap: 16 },
  title: { marginBottom: 4 },
  card: {},
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  streakNum: { fontSize: 56, fontWeight: '800', color: Colors.amber },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, marginBottom: 6, backgroundColor: Colors.background, opacity: 0.5 },
  badgeEarned: { opacity: 1, backgroundColor: `${Colors.accent}11` },
  badgeIcon: { fontSize: 28 },
});
