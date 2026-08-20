import { useProfile } from "@/lib/profile";
import { Coords, evaluate } from "@/lib/sky";
import { Target } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { Icon, IconName } from "./icon";

const sectionIcons = new Map<string, IconName>([
    ["altitudeScore", "altitude"],
    ["moonlightScore", "moon"],
    ["sunlightScore", "sun"],
    ["cloudScore", "cloud"],
    ["equipmentScore", "telescope"],
]);

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
    const [showInfo, setShowInfo] = useState(false);
    const verdict = evaluate(objectData, site, new Date(), null, profile?.equipment);
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
                {Object.entries(reasons).map(([sectionName, score]) => (
                    <DoughnutWithIcon
                        key={sectionName}
                        iconName={sectionIcons.get(sectionName)!}
                        label={sectionName.replace("Score", "")}
                        percent={score}
                    />
                ))}
            </View>
            <Modal visible={showInfo} transparent animationType="slide" onRequestClose={() => setShowInfo(false)}>
                <Pressable style={styles.backdrop} onPress={() => setShowInfo(false)} />
                <View className="rounded-t-3xl border-t border-line bg-sheet px-6 pb-12 pt-5">
                    <Text className="font-sansation text-2xl text-fg tracking-[1px]">Why these rings?</Text>
                    <Text className="font-sansation pt-3 text-sm text-fg-muted tracking-[1px]">
                        Each ring scores one condition affecting this target tonight, from empty (poor) to full (ideal).
                        Each ring's value (or percentage filled) represents an arbitrary score (0 to 1) which is
                        weighted and part of the scoring algorithm for ranking objects. Altitude is how high it climbs,
                        moon is glare from moonlight, sun is twilight, cloud is forecast cover, and telescope is how
                        well your gear suits it.
                    </Text>
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
