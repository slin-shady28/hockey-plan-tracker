import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors } from '../../theme/colors';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const glowOpacity = useSharedValue(focused ? 1 : 0);
  glowOpacity.value = withTiming(focused ? 1 : 0, { duration: 200 });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, { color: focused ? Colors.accent : Colors.textMuted }]}>
        {name}
      </Text>
      <Animated.View style={[styles.glowBar, glowStyle]} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="target" options={{ tabBarIcon: ({ focused }) => <TabIcon name="🎯" focused={focused} /> }} />
      <Tabs.Screen name="fundamentals" options={{ tabBarIcon: ({ focused }) => <TabIcon name="🏒" focused={focused} /> }} />
      <Tabs.Screen name="routine" options={{ tabBarIcon: ({ focused }) => <TabIcon name="📅" focused={focused} /> }} />
      <Tabs.Screen name="quality" options={{ tabBarIcon: ({ focused }) => <TabIcon name="⏱" focused={focused} /> }} />
      <Tabs.Screen name="discipline" options={{ tabBarIcon: ({ focused }) => <TabIcon name="🔥" focused={focused} /> }} />
      <Tabs.Screen name="coach" options={{ tabBarIcon: ({ focused }) => <TabIcon name="🎥" focused={focused} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: '#1E2A3A',
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
  },
  iconContainer: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  iconText: { fontSize: 22 },
  glowBar: { width: 24, height: 2, backgroundColor: Colors.accent, borderRadius: 1 },
});
