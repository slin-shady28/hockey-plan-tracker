import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { IceParticles } from '../../components/ui/IceParticles';
import { IceCard } from '../../components/ui/IceCard';
import { IceButton } from '../../components/ui/IceButton';
import { AnalysisCard } from '../../components/AnalysisCard';
import { getDb } from '../../db/client';
import { insertAnalysis, getAllAnalyses, AiAnalysis } from '../../db/queries/analysis';
import { analyzeVideo } from '../../api/analyzeVideo';
import { useProfileStore } from '../../store/profileStore';

const CATEGORIES = ['skating', 'shooting', 'passing', 'defending'] as const;

export default function CoachTab() {
  const profile = useProfileStore(s => s.profile);
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('skating');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<AiAnalysis[]>([]);

  const puckRotation = useSharedValue(0);
  const puckStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${puckRotation.value}deg` }],
  }));

  useEffect(() => {
    if (analyzing) {
      puckRotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
    } else {
      puckRotation.value = withTiming(0, { duration: 300 });
    }
  }, [analyzing]);

  useEffect(() => {
    const db = getDb();
    setHistory(getAllAnalyses(db));
  }, []);

  async function pickVideo() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 30,
    });
    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  }

  async function recordVideo() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoMaxDuration: 30,
    });
    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
    }
  }

  async function runAnalysis() {
    if (!videoUri || !profile) return;
    setAnalyzing(true);
    try {
      const feedback = await analyzeVideo(videoUri, category, {
        age: profile.age,
        position: profile.position,
        goals: profile.goals,
      });
      const db = getDb();
      insertAnalysis(db, {
        video_path: videoUri,
        skill_category: category,
        feedback,
        created_at: new Date().toISOString(),
      });
      setHistory(getAllAnalyses(db));
      setVideoUri(null);
    } catch {
      Alert.alert('Analysis failed', 'Check your internet connection and try again.');
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h1, styles.title]}>🎥 AI Coach</Text>

        <IceCard style={styles.card}>
          <Text style={[Typography.h3, { marginBottom: 12 }]}>Analyze Your Technique</Text>
          <Text style={[Typography.caption, { marginBottom: 8 }]}>Skill category:</Text>
          <View style={styles.categories}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, category === cat && styles.catChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    Typography.caption,
                    { textTransform: 'capitalize' },
                    category === cat && { color: Colors.accent },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {videoUri ? (
            <View style={styles.videoReady}>
              <Text style={[Typography.body, { color: Colors.accent }]}>✅ Video ready</Text>
              <Text style={Typography.caption}>{videoUri.split('/').pop()}</Text>
            </View>
          ) : (
            <View style={styles.btnRow}>
              <IceButton label="📁 Upload" onPress={pickVideo} variant="ghost" style={{ flex: 1 }} />
              <IceButton label="🎥 Record" onPress={recordVideo} variant="ghost" style={{ flex: 1 }} />
            </View>
          )}

          {analyzing ? (
            <View style={styles.loadingRow}>
              <Animated.Text style={[styles.puck, puckStyle]}>🏒</Animated.Text>
              <Text style={[Typography.body, { marginLeft: 12 }]}>Analyzing your technique...</Text>
            </View>
          ) : (
            videoUri && (
              <IceButton
                label="Analyze with AI →"
                onPress={runAnalysis}
                style={{ marginTop: 12 }}
              />
            )
          )}
        </IceCard>

        {history.length > 0 && (
          <>
            <Text style={[Typography.h3, { marginBottom: 12 }]}>Past Analyses</Text>
            {history.map(a => <AnalysisCard key={a.id} analysis={a} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  title: { marginBottom: 16 },
  card: { marginBottom: 20 },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.textMuted + '44',
    backgroundColor: Colors.surface,
  },
  catChipActive: { borderColor: Colors.accent, backgroundColor: `${Colors.accent}22` },
  videoReady: {
    padding: 12,
    backgroundColor: `${Colors.accent}11`,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  btnRow: { flexDirection: 'row', gap: 10 },
  loadingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  puck: { fontSize: 28 },
});
