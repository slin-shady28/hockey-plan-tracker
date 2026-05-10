import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';
import { Typography } from '../theme/typography';
import { IceCard } from './ui/IceCard';
import { AiAnalysis } from '../db/queries/analysis';

interface AnalysisCardProps {
  analysis: AiAnalysis;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <IceCard style={styles.card}>
      <View style={styles.header}>
        <Text style={[Typography.accent, { textTransform: 'capitalize' }]}>{analysis.skill_category}</Text>
        <Text style={Typography.caption}>{new Date(analysis.created_at).toLocaleDateString()}</Text>
      </View>

      <Text style={[Typography.body, { fontWeight: '600', marginTop: 10 }]}>✅ Strengths</Text>
      {analysis.feedback.strengths.map((s, i) => (
        <Text key={i} style={[Typography.body, { marginLeft: 8, marginTop: 4 }]}>· {s}</Text>
      ))}

      <Text style={[Typography.body, { fontWeight: '600', marginTop: 12 }]}>🔧 Corrections</Text>
      {analysis.feedback.corrections.map((c, i) => (
        <View key={i} style={styles.correction}>
          <Text style={[Typography.body, { color: Colors.amber }]}>⚠ {c.issue}</Text>
          <Text style={[Typography.body, { marginLeft: 8, color: Colors.snow }]}>→ {c.fix}</Text>
        </View>
      ))}

      <View style={styles.drill}>
        <Text style={[Typography.caption, { color: Colors.accent }]}>PRACTICE DRILL</Text>
        <Text style={[Typography.body, { marginTop: 4 }]}>{analysis.feedback.drill}</Text>
      </View>
    </IceCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  correction: { marginLeft: 8, marginTop: 6 },
  drill: {
    marginTop: 14,
    padding: 10,
    backgroundColor: `${Colors.accent}11`,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
});
