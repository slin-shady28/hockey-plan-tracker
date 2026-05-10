export interface PlanRequestBody {
  age: number;
  position: 'forward' | 'defense' | 'goalie';
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
}

export function buildPlanPrompt(body: PlanRequestBody): string {
  return `You are an expert hockey development coach. Generate a personalized training plan for:
- Age: ${body.age} years old
- Position: ${body.position}
- Skill level: ${body.skill_level}
- Goals: ${body.goals.join(', ')}

Return ONLY valid JSON (no markdown, no explanation) with this exact structure:
{
  "fundamentals": [
    {
      "id": "f1",
      "title": "Skating Edges",
      "description": "Why this fundamental matters for their position and goals",
      "drills": ["Drill name 1", "Drill name 2"]
    }
  ],
  "weekly_schedule": [
    {
      "day": "Monday",
      "drills": [
        { "name": "Drill name", "duration": 15, "why": "How this helps their goal" }
      ]
    }
  ]
}

Rules:
- Include 5–8 fundamentals tailored to their position (${body.position}) and skill level
- Schedule 5 days (Mon–Fri) with 2–4 drills per day, totaling 30–60 minutes
- Keep descriptions short and motivating (ages 10–18 audience)
- Every drill must directly connect to one of their stated goals`;
}
