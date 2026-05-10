import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { IceParticles } from '../../components/ui/IceParticles';
import { FundamentalItem, FundamentalStatus } from '../../components/FundamentalItem';
import { usePlanStore } from '../../store/planStore';

export default function FundamentalsTab() {
  const plan = usePlanStore(s => s.plan);
  const [statuses, setStatuses] = useState<Record<string, FundamentalStatus>>({});

  function updateStatus(id: string, status: FundamentalStatus) {
    setStatuses(prev => ({ ...prev, [id]: status }));
  }

  const mastered = Object.values(statuses).filter(s => s === 'mastered').length;
  const total = plan?.plan_data.fundamentals.length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <IceParticles />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.h1, styles.title]}>🏒 Fundamentals</Text>
        {total > 0 && (
          <Text style={[Typography.caption, { marginBottom: 16 }]}>
            {mastered} / {total} mastered
          </Text>
        )}
        {!plan && (
          <Text style={Typography.body}>Generate your plan first on the Know Your Target tab.</Text>
        )}
        {plan?.plan_data.fundamentals.map(f => (
          <FundamentalItem
            key={f.id}
            title={f.title}
            description={f.description}
            drills={f.drills}
            status={statuses[f.id] ?? 'not_started'}
            onStatusChange={(s) => updateStatus(f.id, s)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 20 },
  title: { marginBottom: 4 },
});
