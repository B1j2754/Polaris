import { Verdict, compassPoint } from "@/lib/sky";
import { ICONS, Target } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

import { Text, View } from "react-native";

import { Icon } from "./icon";

export function ObjectCard({ target, verdict }: { target: Target; verdict: Verdict }) {
    const { visible, altitude, azimuth, visibilityIssues } = verdict;
    const formatSign = (num: string): string => (+num > 0 ? `+${num}` : `${num}`);
    const Palette = usePalette();
    return (
        <View
            className={`flex-row items-center gap-4 rounded-2xl border bg-surface p-4 ${
                visible ? "border-fg/20" : "border-transparent opacity-50"
            }`}
        >
            <Icon name={ICONS[target.kind]} size={32} color={visible ? Palette.white : Palette.iconSubtle} />
            <View className="flex-1 gap-1">
                <Text className="font-sansation text-xl text-fg tracking-[1px]">{target.name}</Text>
                <Text numberOfLines={2} className="font-sansation text-base text-fg-muted tracking-[1px]">
                    {target.blurb}
                </Text>
                <Text className="font-sansation text-base text-fg-subtle tracking-[1px]">
                    {visible
                        ? `Az/Alt ${azimuth.toFixed(0)}° (facing) ${compassPoint(azimuth)}, ${formatSign(altitude.toFixed(0))}° (above horizon)`
                        : visibilityIssues.join(" · ")}
                </Text>
            </View>
        </View>
    );
}
