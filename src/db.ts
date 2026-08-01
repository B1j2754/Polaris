import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'polaris.db';

/**
 * Schema migrations, keyed off SQLite's built-in `user_version`.
 * To change the schema: bump DATABASE_VERSION, add an `if (version < n + 1)` block.
 */
export async function migrate(db: SQLiteDatabase) {
  const DATABASE_VERSION = 2;

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;

  if (version >= DATABASE_VERSION) return;

  // 0 -> profile, sites, interests, equipment
  // 1 -> captures

  if (version < 1) {
    // interests/equipment/sites are JSON arrays.
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE profile (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        name TEXT,
        interests TEXT NOT NULL DEFAULT '[]',
        equipment TEXT NOT NULL DEFAULT '[]',
        onboarded INTEGER NOT NULL DEFAULT 0,
        sites TEXT NOT NULL DEFAULT '[]',
        active_site TEXT
      );
    `);
  }

  if (version < 2) {
    await db.execAsync(`
      CREATE TABLE captures (
        id TEXT PRIMARY KEY,
        file TEXT NOT NULL,
        target_id TEXT,
        site_id TEXT,
        taken_at INTEGER NOT NULL,
        note TEXT
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
