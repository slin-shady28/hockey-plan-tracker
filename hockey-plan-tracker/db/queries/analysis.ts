import * as SQLite from 'expo-sqlite';

export interface AiAnalysis {
  id?: number;
  video_path: string;
  skill_category: 'skating' | 'shooting' | 'passing' | 'defending';
  feedback: {
    strengths: string[];
    corrections: Array<{ issue: string; fix: string }>;
    drill: string;
  };
  created_at: string;
}

export function insertAnalysis(db: SQLite.SQLiteDatabase, analysis: Omit<AiAnalysis, 'id'>): void {
  db.runSync(
    'INSERT INTO ai_analysis (video_path, skill_category, feedback, created_at) VALUES (?, ?, ?, ?)',
    [analysis.video_path, analysis.skill_category, JSON.stringify(analysis.feedback), analysis.created_at]
  );
}

export function getAllAnalyses(db: SQLite.SQLiteDatabase): AiAnalysis[] {
  const rows = db.getAllSync<any>('SELECT * FROM ai_analysis ORDER BY created_at DESC', []);
  return rows.map(r => ({ ...r, feedback: JSON.parse(r.feedback) }));
}
