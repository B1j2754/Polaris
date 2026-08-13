import { StyleSheet, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useLocalSearchParams } from "expo-router";

import { LookaheadGraph } from "@/components/lookahead-graph";
import { BottomTabInset } from "@/constants/theme";
import { useSite } from "@/hooks/use-site";
import { TARGETS } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

export default function ObjectOverview() {
    const Palette = usePalette();
    const { object } = useLocalSearchParams<{ object: string }>();
    const { site } = useSite();
    const objectData = object ? TARGETS[object] : undefined;
    if (!objectData) return <Redirect href="/" />;

    const formatSign = (num: number): string => (num > 0 ? `+${num}` : `${num}`);
    const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
    const stats = [
        { label: "Type", value: cap(objectData.kind) },
        { label: "Interest", value: objectData.interest },
        { label: "Magnitude", value: objectData.magnitude.toFixed(1) },
        objectData.sizeArcmin != null && {
            label: "Apparent size",
            value: `${objectData.sizeArcmin}′`,
        },
        { label: "Min altitude", value: `${objectData.minAltitudeDeg}°` },
        { label: "Max cloud", value: `${objectData.maxCloudPct}%` },
        objectData.dec && {
            label: "Declination",
            value: `${formatSign(objectData.dec)}°`,
        },
        objectData.ra && {
            label: "Right Ascension",
            value: (() => {
                const d = objectData.ra;
                const h = Math.floor(d / 15);
                const m = Math.floor((d / 15 - h) * 60);
                const s = (((d / 15 - h) * 60 - m) * 60).toFixed(2);
                return `${h}h ${m}m ${s}s`;
            })(),
        },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <View style={[styles.container, { backgroundColor: Palette.black }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                    <Text className="font-sansation text-4xl text-fg tracking-[1px] text-center">
                        {objectData.name}
                    </Text>
                    <Text className="font-sansation text-xl text-fg-muted tracking-[1px] text-center">
                        {objectData.blurb}
                    </Text>
                    <Image source={require("@/assets/images/starSplash.jpg")} style={styles.preview} />
                    <View style={styles.grid}>
                        {stats.map(({ label, value }, i) => (
                            <View
                                key={label}
                                style={[
                                    styles.cell,
                                    { backgroundColor: Palette.card },
                                    stats.length % 2 === 1 && i === stats.length - 1 && styles.cellWide,
                                ]}
                            >
                                <Text className="font-sansation text-sm text-fg-dim tracking-[1px]">{label}</Text>
                                <Text className="font-sansation text-2xl text-fg tracking-[1px]">{value}</Text>
                            </View>
                        ))}
                    </View>
                    {site && <LookaheadGraph target={objectData} site={site} />}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 24,
    },
    preview: {
        width: "100%",
        resizeMode: "contain",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        rowGap: 12,
        width: "100%",
    },
    cell: {
        width: "48%", // two columns; space-between puts the gap between them
        borderRadius: 16,
        padding: 12,
        gap: 4,
    },
    cellWide: {
        width: "100%", // odd count: last cell spans both columns
    },
    scroll: {
        width: "100%",
    },
    content: {
        justifyContent: "flex-start",
        gap: 16,
        paddingTop: 52, // clear the transparent back-arrow header sitting above
        paddingHorizontal: 20,
        paddingBottom: BottomTabInset,
    },
});
