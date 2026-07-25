import { Link } from "expo-router";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { Icon } from "@/components/icon";
import { SegmentedPill } from "@/components/segmented-pill";
import { upAhead, upTonight, type Upcoming } from "@/lookAhead";
import type { Coords, Weather } from "@/sky";
import { ICONS } from "@/targets";

const SEGMENTS = ["Tonight, until sunrise", "Coming weeks"] as const;
const NIGHTS_AHEAD = 14;
const SLOT_MS = 15 * 60_000;

type Props = { site: Coords; weather: Weather | null; now: Date };

const timeLabel = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
const dateLabel = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

export function LookaheadSection({ site, weather, now }: Props) {
    const [tab, setTab] = useState(0);
    const shown = useDeferredValue(tab);
    const slot = Math.floor(now.getTime() / SLOT_MS) * SLOT_MS;

    return (
        <View className="gap-3">
            <SegmentedPill segments={SEGMENTS} value={tab} onChange={setTab} />
            {tab !== shown ? (
                <Loading />
            ) : shown === 0 ? (
                <TonightPanel site={site} weather={weather} slot={slot} />
            ) : (
                <AheadPanel site={site} day={new Date(slot).toDateString()} slot={slot} />
            )}
        </View>
    );
}

function TonightPanel({ site, weather, slot }: { site: Coords; weather: Weather | null; slot: number }) {
    const rows = useMemo(() => upTonight(site, weather, new Date(slot)), [site, weather, slot]);
    return <Panel rows={rows} format={timeLabel} empty="Nothing clears the horizon before sunrise." />;
}

function AheadPanel({ site, day, slot }: { site: Coords; day: string; slot: number }) {
    const rows = useMemo(() => {
        const from = new Date(slot);
        from.setDate(from.getDate() + 1);
        return upAhead(site, from, NIGHTS_AHEAD);
    }, [site, day]);
    return <Panel rows={rows} format={dateLabel} empty={`Nothing new in the next ${NIGHTS_AHEAD} nights.`} />;
}

function Shell({ children }: { children: ReactNode }) {
    return <View className="gap-3 rounded-2xl border border-white/10 bg-neutral-900 p-4">{children}</View>;
}

function Loading() {
    return (
        <Shell>
            <View className="flex-row items-center gap-3 py-2">
                <ActivityIndicator color="#a3a3a3" />
                <Text className="font-sansation text-base text-neutral-400 tracking-[1px]">Reading the sky…</Text>
            </View>
        </Shell>
    );
}

function Panel({ rows, format, empty }: { rows: Upcoming[]; format: (d: Date) => string; empty: string }) {
    if (rows.length === 0) {
        return (
            <Shell>
                <Text className="font-sansation text-base text-neutral-400 tracking-[1px]">{empty}</Text>
            </Shell>
        );
    }
    return (
        <Shell>
            {rows.map(({ target, when }) => (
                <Link key={target.id} href={`/objects/${target.id}`} asChild>
                    <Pressable className="flex-row items-center gap-3 py-1 active:bg-neutral-800">
                        <Icon name={ICONS[target.kind]} size={20} color="#a3a3a3" />
                        <Text numberOfLines={1} className="flex-1 font-sansation text-base text-white tracking-[1px]">
                            {target.name}
                        </Text>
                        <Text className="font-sansation text-base text-neutral-400 tracking-[1px]">
                            {when ? format(when) : "Up now"}
                        </Text>
                    </Pressable>
                </Link>
            ))}
        </Shell>
    );
}
