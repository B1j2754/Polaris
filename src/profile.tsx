import { useSQLiteContext } from 'expo-sqlite';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

export type Profile = {
  name?: string;
  interests: string[];
  equipment: string[];
};

type ProfileRow = { name: string | null; interests: string; equipment: string };

const ProfileContext = createContext<{
  profile: Profile | null;
  isLoading: boolean;
  save: (patch: Partial<Profile>) => Promise<void>;
  reset: () => Promise<void>;
} | null>(null);

export function useProfile() {
  const value = use(ProfileContext);
  if (!value) throw new Error('useProfile must be used inside <ProfileProvider>');
  return value;
}

export function ProfileProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.getFirstAsync<ProfileRow>('SELECT name, interests, equipment FROM profile WHERE id = 1')
      .then((row) =>
        setProfile(
          row && {
            name: row.name ?? undefined,
            interests: JSON.parse(row.interests),
            equipment: JSON.parse(row.equipment),
          }
        )
      )
      .finally(() => setIsLoading(false));
  }, [db]);

  const save = async (patch: Partial<Profile>) => {
    const next: Profile = { interests: [], equipment: [], ...profile, ...patch };
    await db.runAsync(
      `INSERT INTO profile (id, name, interests, equipment) VALUES (1, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name,
                                     interests = excluded.interests,
                                     equipment = excluded.equipment`,
      next.name ?? null,
      JSON.stringify(next.interests),
      JSON.stringify(next.equipment)
    );
    setProfile(next);
  };

  const reset = async () => {
    await db.runAsync('DELETE FROM profile WHERE id = 1');
    setProfile(null);
  };

  return (
    <ProfileContext value={{ profile, isLoading, save, reset }}>{children}</ProfileContext>
  );
}
