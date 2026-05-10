import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import { buildVideoPrompt, VideoAnalysisContext } from '../prompts/videoPrompt';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function handleAnalyzeVideo(req: Request, res: Response): Promise<void> {
  const videoFile = req.file;
  if (!videoFile) {
    res.status(400).json({ error: 'No video file provided' });
    return;
  }

  let context: VideoAnalysisContext;
  try {
    context = JSON.parse(req.body.context);
    context.skill_category = req.body.skill_category;
  } catch {
    res.status(400).json({ error: 'Invalid context JSON' });
    return;
  }

  const videoBuffer = fs.readFileSync(videoFile.path);
  const base64Video = videoBuffer.toString('base64');

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'image',
          source: { type: 'base64', media_type: 'image/jpeg', data: base64Video },
        },
        { type: 'text', text: buildVideoPrompt(context) },
      ],
    }],
  });

  fs.unlinkSync(videoFile.path);

  const content = message.content[0];
  if (content.type !== 'text') {
    res.status(500).json({ error: 'Unexpected Claude response' });
    return;
  }

  let feedback: unknown;
  try {
    feedback = JSON.parse(content.text);
  } catch {
    res.status(500).json({ error: 'Claude returned invalid JSON', raw: content.text });
    return;
  }

  res.json(feedback);
}
