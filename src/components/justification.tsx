import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useWeather } from "@/hooks/use-weather";
import { useProfile } from "@/lib/profile";
import { Coords, evaluate, QualityBreakdown } from "@/lib/sky";
import { Target } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

import { Icon, IconName } from "./icon";


const sections: { key: keyof QualityBreakdown; icon: IconName; label: string; full: string; empty: string }[] = [
    {
        key: "altitudeScore",
        icon: "altitude",
        label: "altitude",
        full: "high overhead",
        empty: "scraping your horizon",
    },
    {
        key: "moonlightScore",
        icon: "moon",
        label: "dark moon",
        full: "moon isn't washing it out",
        empty: "bright moon drowning it",
    },
    {
        key: "sunlightScore",
        icon: "sun",
        label: "dark sky",
        full: "properly dark",
        empty: "daylight or bright twilight",
    },
    { key: "cloudScore", icon: "cloud", label: "clear sky", full: "clear and dry", empty: "clouded or humid" },
    {
        key: "equipmentScore",
        icon: "telescope",
        label: "gear",
        full: "your gear handles it easily",
        empty: "too faint for your gear",
    },
];

const SIZE = 56;
const STROKE = 5;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

function DoughnutWithIcon({ iconName, label, percent }: { iconName: IconName; label: string; percent: number }) {
    const Palette = usePalette();
    const filled = Math.max(0, Math.min(1, percent)) * CIRCUMFERENCE;
    return (
        <View className="flex flex-col">
            <View style={{ width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" }}>
                <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
                    <Circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        stroke={Palette.iconSubtle}
                        strokeWidth={STROKE}
                        fill="none"
                    />
                    <Circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={R}
                        stroke={Palette.white}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        fill="none"
                        strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
                        transform={`
                            translate(${SIZE}, 0) 
                            scale(-1, 1) 
                            rotate(-90, ${SIZE / 2}, ${SIZE / 2})
                        `}
                    />
                </Svg>
                <Icon name={iconName} size={22} />
            </View>
            <Text className="text-center text-white pt-1 text-xs">{label}</Text>
        </View>
    );
}

export function Justification({ objectData, site }: { objectData: Target; site: Coords }) {
    const Palette = usePalette();
    const { profile } = useProfile();
    const weather = useWeather();
    const [showInfo, setShowInfo] = useState(false);
    const verdict = evaluate(objectData, site, new Date(), weather, profile?.equipment);
    const reasons = verdict.reasons;
    return (
        <View style={[styles.cell, { backgroundColor: Palette.card, width: "100%" }]}>
            <View className="flex-row items-center gap-2 pb-3">
                <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: verdict.visible ? Palette.white : Palette.iconSubtle }}
                />
                <Text
                    className={`font-sansation text-xs tracking-[2px] uppercase ${verdict.visible ? "text-fg" : "text-fg-dim"}`}
                >
                    {verdict.visible ? "Visible" : "Hidden"}
                </Text>
                <Pressable className="ml-auto" onPress={() => setShowInfo(true)} hitSlop={12}>
                    <Icon name="info" size={18} color={Palette.iconMuted} />
                </Pressable>
            </View>

            <View style={styles.row}>
                {sections.map((s) => (
                    <DoughnutWithIcon key={s.key} iconName={s.icon} label={s.label} percent={reasons[s.key]} />
                ))}
            </View>
            <Modal visible={showInfo} transparent animationType="slide" onRequestClose={() => setShowInfo(false)}>
                <Pressable style={styles.backdrop} onPress={() => setShowInfo(false)} />
                <View className="rounded-t-3xl border-t border-line bg-sheet px-6 pb-12 pt-5">
                    <Text className="font-sansation text-2xl text-fg tracking-[1px]">Why these rings?</Text>
                    <Text className="font-sansation pt-3 text-sm text-fg-muted tracking-[1px]">
                        Each ring scores one condition affecting this target tonight, from 0 (empty) to 1 (full). Full
                        is always the good end. The five multiply together to rank targets, so one empty ring drags the
                        whole night down.
                    </Text>
                    {sections.map((s) => (
                        <View key={s.key} className="flex-row items-start gap-3 pt-3">
                            <Icon name={s.icon} size={18} color={Palette.iconMuted} />
                            <Text className="font-sansation flex-1 text-sm text-fg-muted tracking-[1px]">
                                <Text className="text-fg">{s.label}</Text> — full: {s.full}. empty: {s.empty}.
                            </Text>
                        </View>
                    ))}
                </View>
            </Modal>

            {verdict.visibilityIssues.length > 0 && (
                <Text className="font-sansation text-sm text-fg-muted tracking-[1px] pt-3">
                    issues: {verdict.visibilityIssues.join(" · ")}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cell: {
        borderRadius: 16,
        padding: 12,
        gap: 4,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: 8,
    },
});
