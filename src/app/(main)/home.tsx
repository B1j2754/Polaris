import { Link, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "@/components/icon";
import { LookaheadSection } from "@/components/lookahead-section";
import { WeatherOverviewBox } from "@/components/weather-overview-box";
import { BottomTabInset } from "@/constants/theme";
import { Greetings } from "@/greetings";
import { useSite } from "@/hooks/use-site";
import { useProfile } from "@/profile";
import { compassPoint, evaluate, fetchWeather, type Verdict, type Weather } from "@/sky";
import { ICONS, TARGETS, type Target } from "@/targets";

const WEATHER_MAX_AGE_MS = 5 * 60 * 1000;

export default function Home() {
    const { profile } = useProfile();
    const { site, denied } = useSite();
    const [weather, setWeather] = useState<Weather | null>(null);
    const [now, setNow] = useState(() => new Date());

    // lazy load weather
    useEffect(() => {
        if (!site) return;
        let cancelled = false;
        const load = () => fetchWeather(site).then(w => !cancelled && setWeather(w));
        load();
        const timer = setInterval(load, WEATHER_MAX_AGE_MS);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [site]);

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
            <View className="flex-1 items-center justify-center bg-[#000000]">
                <Text className="font-sansation text-lg text-neutral-400 tracking-[1px]">Finding you…</Text>
            </View>
        );
    }

    const interests = profile?.interests ?? [];
    const ranked = Object.values(TARGETS).map(target => ({ target, verdict: evaluate(target, site, now, weather) }))
        // a matched interest breaks ties; it doesn't outrank something that is actually up
        .sort((a, b) => rank(b, interests) - rank(a, interests));

    const upNow = ranked.filter(r => r.verdict.visible).length;

    // Generate greeting
    const greetingGen = new Greetings(profile?.name ?? "Unkown");
    const greeting = greetingGen.getGreeting();

    return (
        <SafeAreaView className="flex-1 bg-[#000000]" edges={["top"]}>
            <FlatList
                data={ranked}
                keyExtractor={({ target }) => target.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: BottomTabInset + 24, gap: 8 }}
                ListHeaderComponent={
                    <View className="gap-3 pb-4">
                        <Text className="font-sansation text-4xl text-white tracking-[1px] pt-2">{greeting}</Text>
                        <WeatherOverviewBox site={site} now={now} weather={weather} />
                        <Text className="font-sansation text-2xl text-white tracking-[1px] pt-2">
                            Current Sky Diagnosis
                        </Text>
                        <Text className="font-sansation text-lg text-neutral-400 tracking-[1px]">
                            {upNow} worth looking at
                        </Text>
                        <LookaheadSection />
                        {denied && (
                            <Text className="font-sansation text-base text-neutral-500 tracking-[1px]">
                                Location off. Showing the sky from a default site.
                            </Text>
                        )}
                    </View>
                }
                renderItem={({ item }) => (
                    <Link href={`/objects/${item.target.id}`} asChild>
                        <Pressable>
                            <Card target={item.target} verdict={item.verdict} />
                        </Pressable>
                    </Link>
                )}
            />
        </SafeAreaView>
    );
}

const rank = ({ target, verdict }: { target: Target; verdict: Verdict }, interests: string[]) =>
    verdict.score + (interests.includes(target.interest) ? 0.05 : 0);

function Card({ target, verdict }: { target: Target; verdict: Verdict }) {
    const { visible, altitude, azimuth, reasons } = verdict;
    const formatSign = (num: string): string => +num > 0 ? `+${num}` : `${num}`;
    return (
        <View
            className={`flex-row items-center gap-4 rounded-2xl border bg-neutral-900 p-4 ${
                visible ? "border-white/20" : "border-transparent opacity-50"
            }`}
        >
            <Icon name={ICONS[target.kind]} size={32} color={visible ? "#ffffff" : "#6b7280"} />
            <View className="flex-1 gap-1">
                <Text className="font-sansation text-xl text-white tracking-[1px]">{target.name}</Text>
                <Text numberOfLines={2} className="font-sansation text-base text-neutral-400 tracking-[1px]">
                    {target.blurb}
                </Text>
                <Text className="font-sansation text-base text-neutral-300 tracking-[1px]">
                    {visible ? `Az/Alt ${azimuth.toFixed(0)}° (facing) ${compassPoint(azimuth)}, ${formatSign(altitude.toFixed(0))}° (above horizon)` : reasons.join(" · ")}
                </Text>
            </View>
        </View>
    );
}
