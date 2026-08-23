import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



import { Link, useFocusEffect } from "expo-router";



import { Icon } from "@/components/icon";
import { LookaheadSection } from "@/components/lookahead-section";
import { ObjectCard } from "@/components/object-card";
import { SegmentedPill } from "@/components/segmented-pill";
import { WeatherOverviewBox } from "@/components/weather-overview-box";
import { BottomTabInset } from "@/constants/theme";
import { useEntryFocus } from "@/hooks/use-entry-focus";
import { useSite } from "@/hooks/use-site";
import { useWeather } from "@/hooks/use-weather";
import { Greetings } from "@/lib/greetings";
import { useProfile } from "@/lib/profile";
import { evaluate, type Verdict } from "@/lib/sky";
import { TARGETS, type Target } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

const SEGMENTS = ["Now", "Tonight", "Weeks ahead"] as const;

const rank = ({ target, verdict }: { target: Target; verdict: Verdict }, interests: string[]) =>
    verdict.score + (interests.includes(target.interest) ? 0.05 : 0);

export default function Home() {
    const { profile } = useProfile();
    const { site, denied } = useSite();
    const weather = useWeather();
    const [now, setNow] = useState(() => new Date());
    const [tab, setTab] = useState(0);
    const [byName, setByName] = useState(false);
    const Palette = usePalette();
    const entryFocus = useEntryFocus();
    const [query, setQuery] = useState("");

    // lazy load sky, at minute intervals to keep it seamless
    useFocusEffect(
        useCallback(() => {
            setNow(new Date());
            const timer = setInterval(() => setNow(new Date()), 60_000);
            return () => clearInterval(timer);
        }, []),
    );

    const greeting = useMemo(() => new Greetings(profile?.name ?? "Unknown").getGreeting(), [profile?.name]);

    if (!site) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">Finding you...</Text>
            </View>
        );
    }

    const interests = profile?.interests ?? [];
    let ranked = Object.values(TARGETS)
        .map((target) => ({
            target,
            verdict: evaluate(target, site, now, weather, profile?.equipment),
        }))
        // a matched interest breaks ties; it doesn't outrank something that is actually up
        .sort(
            (a, b) => (byName ? a.target.name.localeCompare(b.target.name) : rank(b, interests) - rank(a, interests)),
        );

    const upNow = ranked.filter((r) => r.verdict.visible).length;

    ranked = ranked.filter((item) => item.target.name.toLowerCase().includes(query.toLowerCase()));

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

                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search for a target by name..."
                            placeholderTextColor={Palette.placeholder}
                            {...entryFocus}
                            autoCorrect={false}
                            returnKeyType="search"
                            textAlignVertical="center"
                            className="font-sansation h-13 rounded-full border border-line bg-surface px-5 text-lg leading-tight text-fg"
                        />

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
                            <LookaheadSection site={site} weather={weather} now={now} tab={tab as 1 | 2} query={query}/>
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