import { useEffect, useState } from "react";

import { useSQLiteContext } from "expo-sqlite";

import { fetchWeather, type Weather } from "@/lib/sky";

import { useSite } from "./use-site";

// 24h / this = max weather API calls per site per day. Cached in sqlite, one row per site.
const WEATHER_MAX_AGE_MS = 12 * 60 * 60 * 1000;

type WeatherRow = { cloud_cover: number; humidity: number; temperature_c: number; last_fetched_at: number };

async function loadCachedWeather(db: ReturnType<typeof useSQLiteContext>, siteId: string): Promise<Weather | null> {
    const row = await db.getFirstAsync<WeatherRow>("SELECT * FROM weather_cache WHERE site_id = ?", siteId);
    if (!row || Date.now() - row.last_fetched_at >= WEATHER_MAX_AGE_MS) return null;

    return { cloudCover: row.cloud_cover, humidity: row.humidity, temperatureC: row.temperature_c };
}

async function cacheWeather(db: ReturnType<typeof useSQLiteContext>, siteId: string, weather: Weather) {
    await db.runAsync(
        `INSERT INTO weather_cache (site_id, cloud_cover, humidity, temperature_c, last_fetched_at) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(site_id) DO UPDATE SET cloud_cover = excluded.cloud_cover, humidity = excluded.humidity,
                                            temperature_c = excluded.temperature_c, last_fetched_at = excluded.last_fetched_at`,
        siteId,
        weather.cloudCover,
        weather.humidity,
        weather.temperatureC,
        Date.now(),
    );
}

/**
 * Current weather for the active site, lazily loaded and capped to 2 API calls per site per day
 * by the sqlite cache above.
 *
 * Every screen that scores a target has to read this: `evaluate` with a null weather falls back to
 * a fixed-fair-sky constant, so a screen without it contradicts one with it.
 */
export function useWeather(): Weather | null {
    const { site } = useSite();
    const db = useSQLiteContext();
    const [weather, setWeather] = useState<Weather | null>(null);

    useEffect(() => {
        if (!site) return;
        let cancelled = false;
        const load = async () => {
            const cached = await loadCachedWeather(db, site.id);
            if (cached) return !cancelled && setWeather(cached);

            const fresh = await fetchWeather(site);
            if (cancelled) return;

            setWeather(fresh);
            if (fresh) await cacheWeather(db, site.id, fresh);
        };

        load();
        const timer = setInterval(load, WEATHER_MAX_AGE_MS);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [site, db]);

    return weather;
}
