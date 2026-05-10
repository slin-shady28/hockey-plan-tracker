import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Onboarding from '../app/onboarding';

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View, createAnimatedComponent: (c: any) => c },
    useSharedValue: (val: any) => ({ value: val }),
    useAnimatedStyle: (fn: any) => ({}),
    withSpring: (val: any) => val,
    withTiming: (val: any, _opts: any, cb?: any) => { if (cb) cb(true); return val; },
    runOnJS: (fn: any) => fn,
  };
});
jest.mock('expo-router', () => ({ useRouter: () => ({ replace: jest.fn() }) }));
jest.mock('../db/client', () => ({ getDb: jest.fn(() => ({ runSync: jest.fn(), execSync: jest.fn() })) }));
jest.mock('../db/queries/profile', () => ({ insertProfile: jest.fn(), getProfile: jest.fn(() => null) }));
jest.mock('../store/profileStore', () => ({
  useProfileStore: (sel: any) => sel({ setProfile: jest.fn(), setHasOnboarded: jest.fn() }),
}));
jest.mock('../components/ui/IceParticles', () => ({ IceParticles: () => null }));
jest.mock('../components/ui/IceCard', () => ({ IceCard: ({ children }: any) => children }));
jest.mock('../components/ui/IceButton', () => ({
  IceButton: ({ label, onPress, disabled }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return <TouchableOpacity onPress={onPress} disabled={disabled}><Text>{label}</Text></TouchableOpacity>;
  },
}));

describe('Onboarding', () => {
  it('renders the first step with age prompt', () => {
    const { getByText } = render(<Onboarding />);
    expect(getByText('Know Your Target')).toBeTruthy();
    expect(getByText('How old are you?')).toBeTruthy();
  });

  it('advances to position step after selecting age and pressing Next', () => {
    const { getByText } = render(<Onboarding />);
    fireEvent.press(getByText('14'));
    fireEvent.press(getByText('Next →'));
    expect(getByText('Your Position')).toBeTruthy();
  });
});
