import { View, Text } from 'react-native';
import { Colors } from '../theme/colors';
export default function Onboarding() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: Colors.snow }}>Onboarding</Text>
    </View>
  );
}
