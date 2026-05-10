import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { getDb } from '../db/client';
import { SCHEMA } from '../db/schema';
import { getProfile } from '../db/queries/profile';
import { useProfileStore } from '../store/profileStore';
import { Colors } from '../theme/colors';

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const setProfile = useProfileStore(s => s.setProfile);
  const setHasOnboarded = useProfileStore(s => s.setHasOnboarded);

  useEffect(() => {
    const db = getDb();
    db.execSync(SCHEMA);
    const profile = getProfile(db);
    if (profile) {
      setProfile(profile);
      setHasOnboarded(true);
      router.replace('/(tabs)/target');
    } else {
      router.replace('/onboarding');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </QueryClientProvider>
  );
}
