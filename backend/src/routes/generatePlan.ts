import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { buildPlanPrompt, PlanRequestBody } from '../prompts/planPrompt';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function handleGeneratePlan(req: Request, res: Response): Promise<void> {
  const body = req.body as PlanRequestBody;

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: buildPlanPrompt(body) }],
  });

  const content = message.content[0];
  if (content.type !== 'text') {
    res.status(500).json({ error: 'Unexpected Claude response type' });
    return;
  }

  let planData: unknown;
  try {
    planData = JSON.parse(content.text);
  } catch {
    res.status(500).json({ error: 'Claude returned invalid JSON', raw: content.text });
    return;
  }

  res.json(planData);
}
