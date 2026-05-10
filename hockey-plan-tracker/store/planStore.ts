import { create } from 'zustand';
import { TrainingPlan } from '../db/queries/plan';

interface PlanState {
  plan: TrainingPlan | null;
  isGenerating: boolean;
  setPlan: (plan: TrainingPlan | null) => void;
  setIsGenerating: (value: boolean) => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  plan: null,
  isGenerating: false,
  setPlan: (plan) => set({ plan }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
