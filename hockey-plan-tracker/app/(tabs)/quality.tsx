import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Vibration } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { IceParticles } from '../../components/ui/IceParticles';
import { ProgressRing } from '../../components/ui/ProgressRing';
import { IceButton } from '../../components/ui/IceButton';
import { IceCard } from '../../components/ui/IceCard';
import { usePlanStore } from '../../store/planStore';

export default function QualityTab() {
  const plan = usePlanStore(s => s.plan);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayDrills = plan?.plan_data.weekly_schedule.find(d => d.day === today)?.drills ?? [];

  const [drillIndex, setDrillIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [ratings, setRatings] = useState<number[]>([]);

  const currentDrill = todayDrills[drillIndex];
  const totalSeconds = (currentDrill?.duration ?? 0) * 60;
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  const glowPulse = useSharedValue(1);
  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: Colors.accent,
    shadowRadius: glowPulse.value * 20,
    shadowOpacity: glowPulse.value * 0.8,
    shadowOffset: { width: 0, height: 0 },
  }));

  useEffect(() => {
    if (running) {
      glowPulse.value = withRepeat(withSequence(withTiming(1.5, { duration: 800 }), withTiming(1, { duration: 800 })), -1, true);
    } else {
      glowPulse.value = withTiming(1, { duration: 300 });
    }
  }, [running]);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(interval); setRunning(false); Vibration.vibrate(500); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, secondsLeft]);

  function startDrill() {
    setSecondsLeft(totalSeconds);
    setRunning(true);
  }

  function rateDrill(rating: number) {
    setRatings(prev => [...prev, rating]);
    if (drillIndex < todayDrills.length - 1) {
      setDrillIndex(i => i + 1);
      setSecondsLeft(0);
      setRunning(false);
    }
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timeLabel = `${mins}:${secs.toString().padStart(2, '0')}`;
  const allDone = ratings.length === todayDrills.length && todayDrills.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <View style={styles.content}>
        <Text style={[Typography.h1, styles.title]}>⏱ Focus Mode</Text>

        {!plan && <Text style={Typography.body}>Generate your plan first.</Text>}
        {plan && todayDrills.length === 0 && <Text style={Typography.body}>Rest day — no drills scheduled today.</Text>}

        {currentDrill && !allDone && (
          <>
            <Text style={[Typography.caption, { marginBottom: 8 }]}>Drill {drillIndex + 1} of {todayDrills.length}</Text>
            <IceCard style={styles.drillCard}>
              <Text style={[Typography.h2, { textAlign: 'center' }]}>{currentDrill.name}</Text>
              <Text style={[Typography.caption, { textAlign: 'center', marginTop: 6 }]}>{currentDrill.why}</Text>
            </IceCard>

            <Animated.View style={[styles.ringWrapper, glowStyle]}>
              <ProgressRing progress={progress} size={160} label={running ? timeLabel : `${currentDrill.duration}m`} />
            </Animated.View>

            {!running && secondsLeft === 0 && (
              <IceButton label="▶ Start Timer" onPress={startDrill} style={styles.btn} />
            )}

            {!running && secondsLeft === 0 && ratings.length === drillIndex && (
              <>
                <Text style={[Typography.body, { marginTop: 16, textAlign: 'center' }]}>Rate your effort:</Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Text key={star} onPress={() => rateDrill(star)} style={styles.star}>★</Text>
                  ))}
                </View>
              </>
            )}
          </>
        )}

        {allDone && (
          <IceCard style={styles.drillCard}>
            <Text style={[Typography.h2, { textAlign: 'center' }]}>🏆 Session Complete!</Text>
            <Text style={[Typography.body, { textAlign: 'center', marginTop: 8 }]}>
              Avg effort: {'★'.repeat(Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length))}
            </Text>
          </IceCard>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  title: { marginBottom: 16, alignSelf: 'flex-start' },
  drillCard: { width: '100%', marginBottom: 24 },
  ringWrapper: { marginVertical: 24 },
  btn: { width: '100%' },
  stars: { flexDirection: 'row', gap: 12, marginTop: 8 },
  star: { fontSize: 36, color: Colors.amber },
});
