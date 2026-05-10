import { apiPost } from './client';
import { UserProfile } from '../db/queries/profile';
import { TrainingPlan } from '../db/queries/plan';

export async function generatePlan(profile: UserProfile): Promise<TrainingPlan['plan_data']> {
  return apiPost<TrainingPlan['plan_data']>('/generate-plan', {
    age: profile.age,
    position: profile.position,
    skill_level: profile.skill_level,
    goals: profile.goals,
  });
}
