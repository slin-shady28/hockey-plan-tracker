import { Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { buildVideoPrompt, VideoAnalysisContext } from '../prompts/videoPrompt';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function extractFrame(videoPath: string, framePath: string): Promise<void> {
  const folder = framePath.substring(0, framePath.lastIndexOf('/'));
  const filename = framePath.substring(framePath.lastIndexOf('/') + 1);
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({ timestamps: [0], filename, folder })
      .on('end', () => resolve())
      .on('error', (err: Error) => reject(err));
  });
}

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
    fs.unlinkSync(videoFile.path);
    res.status(400).json({ error: 'Invalid context JSON' });
    return;
  }

  const framePath = `${videoFile.path}_frame.jpg`;
  try {
    await extractFrame(videoFile.path, framePath);
  } catch {
    fs.unlinkSync(videoFile.path);
    res.status(422).json({ error: 'Could not extract frame from video. Ensure ffmpeg is installed on the server.' });
    return;
  }

  let message: Awaited<ReturnType<typeof anthropic.messages.create>>;
  try {
    const frameBuffer = fs.readFileSync(framePath);
    const base64Frame = frameBuffer.toString('base64');

    message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64Frame },
          },
          { type: 'text', text: buildVideoPrompt(context) },
        ],
      }],
    });
  } catch {
    res.status(502).json({ error: 'Analysis service unavailable' });
    return;
  } finally {
    fs.unlinkSync(videoFile.path);
    if (fs.existsSync(framePath)) fs.unlinkSync(framePath);
  }

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
