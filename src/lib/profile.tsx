import type { Equipment } from "@/lib/equipment";
import type { Site } from "@/lib/sites";

import { type PropsWithChildren, createContext, use, useEffect, useState } from "react";

import { useSQLiteContext } from "expo-sqlite";

export type Profile = {
    name?: string;
    interests: string[];
    equipment: Equipment[];
    /** false while the user is still partway through signup */
    onboarded: boolean;
    sites: Site[];
    /** site id to run calculations from; null -> phone location */
    activeSite: string | null;
};

type ProfileRow = {
    name: string | null;
    interests: string;
    equipment: string;
    onboarded: number;
    sites: string;
    active_site: string | null;
};

const ProfileContext = createContext<{
    profile: Profile | null;
    isLoading: boolean;
    save: (patch: Partial<Profile>) => Promise<void>;
    reset: () => Promise<void>;
} | null>(null);

export function useProfile() {
    const value = use(ProfileContext);
    if (!value) throw new Error("useProfile must be used inside <ProfileProvider>");
    return value;
}

export function ProfileProvider({ children }: PropsWithChildren) {
    const db = useSQLiteContext();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        db.getFirstAsync<ProfileRow>(
            "SELECT name, interests, equipment, onboarded, sites, active_site FROM profile WHERE id = 1",
        )
            .then((row) =>
                setProfile(
                    row && {
                        name: row.name ?? undefined,
                        interests: JSON.parse(row.interests),
                        equipment: JSON.parse(row.equipment),
                        onboarded: row.onboarded === 1,
                        sites: JSON.parse(row.sites),
                        activeSite: row.active_site,
                    },
                ),
            )
            .finally(() => setIsLoading(false));
    }, [db]);

    const save = async (patch: Partial<Profile>) => {
        const base: Profile = profile ?? {
            interests: [],
            equipment: [],
            onboarded: false,
            sites: [],
            activeSite: null,
        };
        const next: Profile = { ...base, ...patch };
        await db.runAsync(
            `INSERT INTO profile (id, name, interests, equipment, onboarded, sites, active_site)
       VALUES (1, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET name = excluded.name,
                                     interests = excluded.interests,
                                     equipment = excluded.equipment,
                                     onboarded = excluded.onboarded,
                                     sites = excluded.sites,
                                     active_site = excluded.active_site`,
            next.name ?? null,
            JSON.stringify(next.interests),
            JSON.stringify(next.equipment),
            next.onboarded ? 1 : 0,
            JSON.stringify(next.sites),
            next.activeSite,
        );
        setProfile(next);
    };

    const reset = async () => {
        await db.runAsync("DELETE FROM profile WHERE id = 1");
        setProfile(null);
    };

    return <ProfileContext value={{ profile, isLoading, save, reset }}>{children}</ProfileContext>;
}
