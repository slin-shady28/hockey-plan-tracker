import * as SQLite from 'expo-sqlite';

export interface UserProfile {
  id?: number;
  age: number;
  position: 'forward' | 'defense' | 'goalie';
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  plan_generated_at?: string | null;
}

export function insertProfile(db: SQLite.SQLiteDatabase, profile: Omit<UserProfile, 'id'>): void {
  db.runSync(
    'INSERT INTO user_profile (age, position, skill_level, goals) VALUES (?, ?, ?, ?)',
    [profile.age, profile.position, profile.skill_level, JSON.stringify(profile.goals)]
  );
}

export function getProfile(db: SQLite.SQLiteDatabase): (UserProfile & { id: number }) | null {
  const row = db.getFirstSync<any>('SELECT * FROM user_profile ORDER BY id DESC LIMIT 1', []);
  if (!row) return null;
  return { ...row, goals: JSON.parse(row.goals) };
}

export function updateProfile(db: SQLite.SQLiteDatabase, id: number, patch: Partial<UserProfile>): void {
  if (patch.goals !== undefined) {
    db.runSync('UPDATE user_profile SET goals = ? WHERE id = ?', [JSON.stringify(patch.goals), id]);
  }
  if (patch.plan_generated_at !== undefined) {
    db.runSync('UPDATE user_profile SET plan_generated_at = ? WHERE id = ?', [patch.plan_generated_at, id]);
  }
}
