import { Coords, evaluate } from "@/lib/sky";
import { Target } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

import { StyleSheet, Text, View } from "react-native";
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
    const verdict = evaluate(objectData, site, new Date(), null);
    const reasons = verdict.reasons;
    return (
        <View style={[styles.cell, { backgroundColor: Palette.card, width: "100%" }]}>
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
            {verdict.visibilityIssues.length > 0 && (
                <Text className="font-sansation text-sm text-fg-muted text-center tracking-[1px] pt-2">
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
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: 8,
    },
});
