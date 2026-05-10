import { withTiming, withSpring, Easing } from 'react-native-reanimated';

export const Animations = {
  fadeIn: (duration = 300) =>
    withTiming(1, { duration, easing: Easing.out(Easing.ease) }),
  fadeOut: (duration = 200) =>
    withTiming(0, { duration, easing: Easing.in(Easing.ease) }),
  slideInRight: () =>
    withSpring(0, { damping: 20, stiffness: 200 }),
  springBounce: () =>
    withSpring(1, { damping: 10, stiffness: 300 }),
  glowPulse: (toValue: number) =>
    withTiming(toValue, { duration: 800, easing: Easing.inOut(Easing.sine) }),
};
