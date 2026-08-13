import { useMemo, useState } from "react";
import { Text, View } from "react-native";

import { SegmentedPill } from "@/components/segmented-pill";
import { nightlyPeaks, tonightCurve } from "@/lookAhead";
import { altitudeFloor, type Coords } from "@/sky";
import type { Target } from "@/targets";

const RANGES = ["Tonight", "Week", "3 Weeks"] as const;
const GRAPH_HEIGHT = 160;
const TICKS = 5;

type Bar = { key: string; date: Date; altitude: number; good: boolean };

const hourLabel = (d: Date) => `${d.getHours() % 12 || 12}${d.getHours() < 12 ? "am" : "pm"}`;
const dayLabel = (d: Date) => d.toLocaleDateString(undefined, { weekday: "short" });
const dateLabel = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

const pick = <T,>(items: T[], count: number): T[] =>
    items.length <= count
        ? items
        : Array.from({ length: count }, (_, i) => items[Math.round((i * (items.length - 1)) / (count - 1))]);

/** Altitude over time: tonight hour by hour, or the best moment of each night ahead. */
export function LookaheadGraph({ target, site }: { target: Target; site: Coords }) {
    const [range, setRange] = useState(0);
    const floor = altitudeFloor(target, site);

    const bars = useMemo<Bar[]>(() => {
        if (range === 0) {
            return tonightCurve(target, site, null).map(s => ({
                key: s.time.toISOString(),
                date: s.time,
                altitude: s.altitude,
                good: s.visible,
            }));
        }
        return nightlyPeaks(target, site, new Date(), range === 1 ? 7 : 21).map(p => ({
            key: p.date.toISOString(),
            date: p.date,
            altitude: p.altitude,
            good: p.dark && p.altitude >= floor,
        }));
    }, [target, site, range, floor]);

    const peak = Math.max(0, ...bars.map(b => b.altitude));
    const format = range === 0 ? hourLabel : range === 1 ? dayLabel : dateLabel;
    const ticks = pick(bars, range === 1 ? 7 : TICKS);
    const thresholdY = (floor / 90) * GRAPH_HEIGHT;

    if (peak < floor) {
        return (
            <View className="gap-3">
                <SegmentedPill segments={RANGES} value={range} onChange={setRange} />
                <View className="h-[160px] items-center justify-center rounded-2xl bg-surface px-4">
                    <Text className="text-center font-sansation text-base text-fg-muted tracking-[1px]">
                        {bars.length === 0
                            ? "The sky never gets dark enough here right now."
                            : `Never clears ${floor}° from here.`}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View className="gap-3">
            <SegmentedPill segments={RANGES} value={range} onChange={setRange} />

            <View className="rounded-2xl bg-surface p-3">
                <View className="flex-row justify-between pb-1">
                    <Text className="font-sansation text-[11px] text-fg-dim tracking-[1px]">
                        Altitude above horizon
                    </Text>
                    <Text className="font-sansation text-[11px] text-fg-dim">90°</Text>
                </View>

                <View className="flex-row items-end gap-[2px]" style={{ height: GRAPH_HEIGHT }}>
                    {bars.map(({ key, altitude, good }) => (
                        <View
                            key={key} 
                            className={`flex-1 rounded-t-sm ${good ? "bg-fg" : "bg-line-2"}`}
                            style={{ height: Math.max(1, (Math.max(0, altitude) / 90) * GRAPH_HEIGHT) }}
                        />
                    ))}

                    <View
                        className="absolute bg-black"
                        style={{ left: 0, right: 0, bottom: thresholdY, height: 1 }}
                    />
                    <Text
                        className="absolute font-sansation text-[10px] text-black bg-fg"
                        style={{ right: 0, bottom: thresholdY + 2 }}
                    >
                        {floor}°
                    </Text>
                </View>

                <View className="flex-row justify-between pt-2">
                    {ticks.map(t => (
                        <Text key={t.key} className="font-sansation text-[11px] text-fg-dim">
                            {format(t.date)}
                        </Text>
                    ))}
                </View>

                <Text className="pt-2 font-sansation text-sm text-fg-dim tracking-[1px]">
                    {range === 0
                        ? `Peaks at ${peak.toFixed(0)}° tonight`
                        : `Best night reaches ${peak.toFixed(0)}°`}
                </Text>
            </View>
        </View>
    );
}
