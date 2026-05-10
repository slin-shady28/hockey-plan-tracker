export interface VideoAnalysisContext {
  age: number;
  position: string;
  goals: string[];
  skill_category: 'skating' | 'shooting' | 'passing' | 'defending';
}

export function buildVideoPrompt(context: VideoAnalysisContext): string {
  return `You are an expert hockey coach analyzing a video of a ${context.age}-year-old ${context.position} player.
The player is working on: ${context.skill_category}.
Their goals are: ${context.goals.join(', ')}.

Analyze the attached video frames and provide coaching feedback.

Return ONLY valid JSON (no markdown) in this exact structure:
{
  "strengths": ["Positive observation 1", "Positive observation 2"],
  "corrections": [
    { "issue": "What needs fixing", "fix": "Specific actionable correction" },
    { "issue": "Second issue if present", "fix": "How to fix it" }
  ],
  "drill": "Name and brief description of one drill to practice the correction"
}

Rules:
- Keep language encouraging and age-appropriate (ages 10–18)
- Maximum 3 corrections (focus on the most impactful)
- The drill must directly address the primary correction
- Be specific about body positioning, stick angle, weight distribution, etc.`;
}
