import { Link } from "expo-router";
import { useDeferredValue, useMemo, type ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { Icon } from "@/components/icon";
import { upAhead, upTonight, type Upcoming } from "@/lib/lookAhead";
import type { Coords, Weather } from "@/lib/sky";
import { ICONS } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

const NIGHTS_AHEAD = 14;
const SLOT_MS = 15 * 60_000;

/** 1 = tonight until sunrise, 2 = the next couple of weeks. 0 (now) is the card list on Home. */
type Props = { site: Coords; weather: Weather | null; now: Date; tab: 1 | 2 };

const timeLabel = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
const dateLabel = (d: Date) =>
    d.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });

export function LookaheadSection({ site, weather, now, tab }: Props) {
    const shown = useDeferredValue(tab);
    const slot = Math.floor(now.getTime() / SLOT_MS) * SLOT_MS;

    if (tab !== shown) return <Loading />;
    return shown === 1 ? (
        <TonightPanel site={site} weather={weather} slot={slot} />
    ) : (
        <AheadPanel site={site} day={new Date(slot).toDateString()} slot={slot} />
    );
}

function TonightPanel({ site, weather, slot }: { site: Coords; weather: Weather | null; slot: number }) {
    const rows = useMemo(() => upTonight(site, weather, new Date(slot)), [site, weather, slot]);
    return (
        <Panel
            rows={rows}
            format={timeLabel}
            empty="Nothing clears the horizon or is visible (due to weather or other conditions) before sunrise."
        />
    );
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
    return <View className="gap-3 rounded-2xl border border-fg/10 bg-surface p-4">{children}</View>;
}

function Loading() {
    const Palette = usePalette();
    return (
        <Shell>
            <View className="flex-row items-center gap-3 py-2">
                <ActivityIndicator color={Palette.iconTertiary} />
                <Text className="font-sansation text-base text-fg-muted tracking-[1px]">Reading the sky...</Text>
            </View>
        </Shell>
    );
}

function Panel({ rows, format, empty }: { rows: Upcoming[]; format: (d: Date) => string; empty: string }) {
    const Palette = usePalette();
    if (rows.length === 0) {
        return (
            <Shell>
                <Text className="font-sansation text-base text-fg-muted tracking-[1px]">{empty}</Text>
            </Shell>
        );
    }
    return (
        <Shell>
            {rows.map(({ target, when }) => (
                <Link key={target.id} href={`/objects/${target.id}`} asChild>
                    <Pressable className="flex-row items-center gap-3 py-1 active:bg-line">
                        <Icon name={ICONS[target.kind]} size={20} color={Palette.iconTertiary} />
                        <Text numberOfLines={1} className="flex-1 font-sansation text-base text-fg tracking-[1px]">
                            {target.name}
                        </Text>
                        <Text className="font-sansation text-base text-fg-muted tracking-[1px]">
                            {when ? format(when) : "Up now"}
                        </Text>
                    </Pressable>
                </Link>
            ))}
        </Shell>
    );
}
