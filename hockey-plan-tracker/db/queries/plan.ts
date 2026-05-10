import * as SQLite from 'expo-sqlite';

export interface TrainingPlan {
  id?: number;
  user_profile_id: number;
  plan_data: {
    fundamentals: Array<{ id: string; title: string; description: string; drills: string[] }>;
    weekly_schedule: Array<{ day: string; drills: Array<{ name: string; duration: number; why: string }> }>;
  };
  created_at: string;
}

export function insertPlan(db: SQLite.SQLiteDatabase, plan: Omit<TrainingPlan, 'id'>): void {
  db.runSync(
    'INSERT INTO training_plan (user_profile_id, plan_data, created_at) VALUES (?, ?, ?)',
    [plan.user_profile_id, JSON.stringify(plan.plan_data), plan.created_at]
  );
}

export function getLatestPlan(db: SQLite.SQLiteDatabase, profileId: number): TrainingPlan | null {
  const row = db.getFirstSync<any>(
    'SELECT * FROM training_plan WHERE user_profile_id = ? ORDER BY created_at DESC LIMIT 1',
    [profileId]
  );
  if (!row) return null;
  return { ...row, plan_data: JSON.parse(row.plan_data) };
}
