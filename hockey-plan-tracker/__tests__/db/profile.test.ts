import { openDatabaseSync } from 'expo-sqlite';
import { getDb } from '../../db/client';
import { insertProfile, getProfile, updateProfile } from '../../db/queries/profile';

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    getFirstSync: jest.fn(),
    runSync: jest.fn(),
    getAllSync: jest.fn(),
  })),
}));

describe('profile queries', () => {
  let db: ReturnType<typeof openDatabaseSync>;

  beforeEach(() => {
    db = openDatabaseSync('test.db');
    (db.execSync as jest.Mock).mockClear();
    (db.getFirstSync as jest.Mock).mockClear();
    (db.runSync as jest.Mock).mockClear();
  });

  it('insertProfile calls runSync with correct SQL', () => {
    insertProfile(db, { age: 14, position: 'forward', skill_level: 'intermediate', goals: ['faster skating'] });
    expect(db.runSync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO user_profile'),
      expect.arrayContaining([14, 'forward', 'intermediate', expect.any(String)])
    );
  });

  it('getProfile calls getFirstSync', () => {
    (db.getFirstSync as jest.Mock).mockReturnValue({ id: 1, age: 14, goals: '["faster skating"]' });
    const result = getProfile(db);
    expect(db.getFirstSync).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM user_profile'), []);
    expect(result).toEqual({ id: 1, age: 14, goals: ['faster skating'] });
  });
});
