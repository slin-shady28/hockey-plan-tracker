import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const Typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '800', color: Colors.snow, letterSpacing: 0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: Colors.snow },
  h3: { fontSize: 18, fontWeight: '600', color: Colors.snow },
  body: { fontSize: 15, fontWeight: '400', color: Colors.text, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400', color: Colors.textMuted },
  accent: { fontSize: 15, fontWeight: '600', color: Colors.accent },
});
