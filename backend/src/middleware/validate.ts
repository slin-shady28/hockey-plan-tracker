import { Request, Response, NextFunction } from 'express';

export function validatePlanRequest(req: Request, res: Response, next: NextFunction): void {
  const { age, position, skill_level, goals } = req.body;
  if (typeof age !== 'number' || age < 10 || age > 18) {
    res.status(400).json({ error: 'age must be a number between 10 and 18' });
    return;
  }
  if (!['forward', 'defense', 'goalie'].includes(position)) {
    res.status(400).json({ error: 'position must be forward, defense, or goalie' });
    return;
  }
  if (!['beginner', 'intermediate', 'advanced'].includes(skill_level)) {
    res.status(400).json({ error: 'skill_level must be beginner, intermediate, or advanced' });
    return;
  }
  if (!Array.isArray(goals) || goals.length === 0 || goals.length > 3) {
    res.status(400).json({ error: 'goals must be an array of 1–3 strings' });
    return;
  }
  next();
}
