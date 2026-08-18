import { Icon } from "@/components/icon";
import { LookaheadSection } from "@/components/lookahead-section";
import { ObjectCard } from "@/components/object-card";
import { SegmentedPill } from "@/components/segmented-pill";
import { WeatherOverviewBox } from "@/components/weather-overview-box";
import { BottomTabInset } from "@/constants/theme";
import { useSite } from "@/hooks/use-site";
import { Greetings } from "@/lib/greetings";
import { useProfile } from "@/lib/profile";
import { type Verdict, type Weather, evaluate, fetchWeather } from "@/lib/sky";
import { TARGETS, type Target } from "@/lib/targets";

import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

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

const SEGMENTS = ["Now", "Tonight", "Weeks ahead"] as const;

const rank = ({ target, verdict }: { target: Target; verdict: Verdict }, interests: string[]) =>
    verdict.score + (interests.includes(target.interest) ? 0.05 : 0);

export default function Home() {
    const { profile } = useProfile();
    const { site, denied } = useSite();
    const db = useSQLiteContext();
    const [weather, setWeather] = useState<Weather | null>(null);
    const [now, setNow] = useState(() => new Date());
    const [tab, setTab] = useState(0);
    const [byName, setByName] = useState(false);

    // lazy load weather, capped to 2 calls per 24h by the sqlite cache above
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

    // lazy load sky, at minute intervals to keep it seamless
    useFocusEffect(
        useCallback(() => {
            setNow(new Date());
            const timer = setInterval(() => setNow(new Date()), 60_000);
            return () => clearInterval(timer);
        }, []),
    );

    if (!site) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">Finding you...</Text>
            </View>
        );
    }

    const interests = profile?.interests ?? [];
    const ranked = Object.values(TARGETS)
        .map((target) => ({
            target,
            verdict: evaluate(target, site, now, weather),
        }))
        // a matched interest breaks ties; it doesn't outrank something that is actually up
        .sort(
            (a, b) => (byName ? a.target.name.localeCompare(b.target.name) : rank(b, interests) - rank(a, interests)), // British spelling :(
        );

    const upNow = ranked.filter((r) => r.verdict.visible).length;

    // Generate greeting
    const greetingGen = new Greetings(profile?.name ?? "Unknown");
    const greeting = greetingGen.getGreeting();

    return (
        <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
            <FlatList
                data={tab === 0 ? ranked : []}
                keyExtractor={({ target }) => target.id}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: BottomTabInset + 24,
                    gap: 8,
                }}
                ListHeaderComponent={
                    <View className="gap-3 pb-4">
                        <Text className="font-sansation text-3xl text-fg text-center tracking-[1px] pt-2 px-3">
                            {greeting}
                        </Text>
                        <WeatherOverviewBox site={site} now={now} weather={weather} />
                        <SegmentedPill segments={SEGMENTS} value={tab} onChange={setTab} />
                        {tab === 0 ? (
                            <View className="flex-row items-center justify-between">
                                <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">
                                    {upNow} of {ranked.length} worth looking at
                                </Text>
                                <Pressable
                                    onPress={() => setByName((v) => !v)}
                                    hitSlop={12}
                                    className="flex-row items-center gap-2 rounded-full border border-fg/20 bg-surface px-3 py-1.5 active:opacity-60"
                                >
                                    <Icon name="arrowUpDown" size={16} />
                                    <Text className="font-sansation text-lg text-fg tracking-[1px]">
                                        {byName ? "Best first" : "A–Z"}
                                    </Text>
                                </Pressable>
                            </View>
                        ) : (
                            <LookaheadSection site={site} weather={weather} now={now} tab={tab as 1 | 2} />
                        )}
                        {denied && (
                            <Text className="font-sansation text-base text-fg-dim tracking-[1px]">
                                Location off. Showing the sky from Polaris' default site.
                            </Text>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <Link href={`/objects/${item.target.id}`} asChild>
                        <Pressable>
                            <ObjectCard target={item.target} verdict={item.verdict} />
                        </Pressable>
                    </Link>
                )}
            />
        </SafeAreaView>
    );
}
