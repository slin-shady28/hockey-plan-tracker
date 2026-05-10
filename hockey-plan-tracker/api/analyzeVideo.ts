import { apiPostFormData } from './client';
import { AiAnalysis } from '../db/queries/analysis';

export async function analyzeVideo(
  videoUri: string,
  skillCategory: AiAnalysis['skill_category'],
  context: { age: number; position: string; goals: string[] }
): Promise<AiAnalysis['feedback']> {
  const formData = new FormData();
  formData.append('video', { uri: videoUri, name: 'clip.mp4', type: 'video/mp4' } as any);
  formData.append('skill_category', skillCategory);
  formData.append('context', JSON.stringify(context));
  return apiPostFormData<AiAnalysis['feedback']>('/analyze-video', formData);
}
