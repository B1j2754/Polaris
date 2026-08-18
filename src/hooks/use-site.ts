import { useProfile } from "@/lib/profile";
import type { Site } from "@/lib/sites";

import { useEffect, useState } from "react";

import * as Location from "expo-location";

/** Roughly New York. */
const DEFAULT_SITE: Site = {
    id: "default",
    name: "New York",
    lat: 40.71,
    lon: -74.01,
    elevation: 0,
    horizonDeg: 0,
};

// Fire once per app-launch as a module. No need to constantly evaluate, movements while app is open are next to negligible.
// TODO: Re-evaluate this later.
let gpsOnce: Promise<{ site: Site; denied: boolean }> | null = null;

/**
 * Resolves user's current location. Falls back to default if permission denied.
 *
 * Prefers the cached last-known position to avoid a GPS fix;
 * only calls {@link Location.getCurrentPositionAsync} when no cache exists.
 *
 * @returns The resolved {@link Site} and whether permission was denied.
 * When `denied` is `true`, `site` is `DEFAULT_SITE`
 */
async function locate(): Promise<{ site: Site; denied: boolean }> {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) return { site: DEFAULT_SITE, denied: true };

    const position =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
        }));

    return {
        site: {
            id: "here",
            name: "Current location",
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            elevation: position.coords.altitude ?? 0,
            horizonDeg: 0,
        },
        denied: false,
    };
}

/**
 * Resolves active observing site, from profile or from GPS (as backup)
 *
 * @returns The resolved {@link Site} and whether permission was denied.
 * When `denied` is `true`, `site` is `DEFAULT_SITE`
 */
export function useSite() {
    const { profile } = useProfile();
    const saved = profile?.sites.find((s) => s.id === profile.activeSite) ?? null;

    const [located, setLocated] = useState<{
        site: Site;
        denied: boolean;
    } | null>(null);

    useEffect(() => {
        if (saved) return; // a saved site needs no GPS at all

        let cancelled = false;
        (gpsOnce ??= locate()).then((result) => !cancelled && setLocated(result));
        return () => {
            cancelled = true;
        };
    }, [saved]);

    if (saved) return { site: saved, denied: false };
    return { site: located?.site ?? null, denied: located?.denied ?? false };
}
