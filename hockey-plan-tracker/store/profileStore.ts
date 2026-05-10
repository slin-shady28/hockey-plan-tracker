import { create } from 'zustand';
import { UserProfile } from '../db/queries/profile';

interface ProfileState {
  profile: (UserProfile & { id: number }) | null;
  hasOnboarded: boolean;
  setProfile: (profile: (UserProfile & { id: number }) | null) => void;
  setHasOnboarded: (value: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  hasOnboarded: false,
  setProfile: (profile) => set({ profile }),
  setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),
}));
