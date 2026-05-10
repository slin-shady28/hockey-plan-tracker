import * as SQLite from 'expo-sqlite';

export interface SessionLog {
  id?: number;
  date: string;
  drills_completed: string[];
  quality_rating?: number;
  notes?: string;
  duration_minutes?: number;
}

export function insertSession(db: SQLite.SQLiteDatabase, session: Omit<SessionLog, 'id'>): void {
  db.runSync(
    'INSERT INTO session_log (date, drills_completed, quality_rating, notes, duration_minutes) VALUES (?, ?, ?, ?, ?)',
    [session.date, JSON.stringify(session.drills_completed), session.quality_rating ?? null, session.notes ?? null, session.duration_minutes ?? null]
  );
}

export function getSessionsForMonth(db: SQLite.SQLiteDatabase, yearMonth: string): SessionLog[] {
  const rows = db.getAllSync<any>(
    "SELECT * FROM session_log WHERE date LIKE ? ORDER BY date ASC",
    [`${yearMonth}%`]
  );
  return rows.map(r => ({ ...r, drills_completed: JSON.parse(r.drills_completed) }));
}

export function getStreak(db: SQLite.SQLiteDatabase): number {
  const rows = db.getAllSync<{ date: string }>(
    'SELECT DISTINCT date FROM session_log ORDER BY date DESC',
    []
  );
  if (rows.length === 0) return 0;
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  let expected = today;
  for (const row of rows) {
    if (row.date === expected) {
      streak++;
      const d = new Date(expected);
      d.setDate(d.getDate() - 1);
      expected = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
}
