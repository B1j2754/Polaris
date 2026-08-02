import type { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'polaris.db';

/**
 * Removed versioning to avoid the need for a migration path.
 * TODO: Reimplement versioning when we have a more complex schema change that requires migrations.
 */
export async function migrate(db: SQLiteDatabase) {
  // interests/equipment/sites are JSON arrays.
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';

    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT,
      interests TEXT NOT NULL DEFAULT '[]',
      equipment TEXT NOT NULL DEFAULT '[]',
      onboarded INTEGER NOT NULL DEFAULT 0,
      sites TEXT NOT NULL DEFAULT '[]',
      active_site TEXT
    );

    CREATE TABLE IF NOT EXISTS captures (
      id TEXT PRIMARY KEY,
      file TEXT NOT NULL,
      target_id TEXT,
      site_id TEXT,
      taken_at INTEGER NOT NULL,
      note TEXT
    );
  `);
}
