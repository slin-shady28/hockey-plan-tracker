export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    age INTEGER NOT NULL,
    position TEXT NOT NULL CHECK(position IN ('forward','defense','goalie')),
    skill_level TEXT NOT NULL CHECK(skill_level IN ('beginner','intermediate','advanced')),
    goals TEXT NOT NULL,
    plan_generated_at TEXT
  );

  CREATE TABLE IF NOT EXISTS training_plan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_profile_id INTEGER NOT NULL,
    plan_data TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_profile_id) REFERENCES user_profile(id)
  );

  CREATE TABLE IF NOT EXISTS session_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    drills_completed TEXT NOT NULL DEFAULT '[]',
    quality_rating INTEGER CHECK(quality_rating BETWEEN 1 AND 5),
    notes TEXT,
    duration_minutes INTEGER
  );

  CREATE TABLE IF NOT EXISTS ai_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_path TEXT NOT NULL,
    skill_category TEXT NOT NULL CHECK(skill_category IN ('skating','shooting','passing','defending')),
    feedback TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`;
