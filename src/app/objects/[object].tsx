import { StyleSheet, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useLocalSearchParams } from 'expo-router';

import { TARGETS } from "@/targets"

export default function ObjectOverview() {
    const { object } = useLocalSearchParams<{ object: string }>();
    const objectData = object ? TARGETS[object] : undefined;
    if (!objectData) return <Redirect href="/" />;

    const formatSign = (num: number): string => num > 0 ? `+${num}` : `${num}`;
    const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
    const stats = [
        { label: "Type", value: cap(objectData.kind) },
        { label: "Interest", value: objectData.interest },
        { label: "Magnitude", value: objectData.magnitude.toFixed(1) },
        objectData.sizeArcmin != null && { label: "Apparent size", value: `${objectData.sizeArcmin}′` },
        { label: "Min altitude", value: `${objectData.minAltitudeDeg}°` },
        { label: "Max cloud", value: `${objectData.maxCloudPct}%` },
        objectData.dec && { label: "Declination", value: `${formatSign(objectData.dec)}°`},
        objectData.ra && { 
            label: "Right Ascension", 
            value: (() => {
                const d = objectData.ra;
                const h = Math.floor(d / 15);
                const m = Math.floor(((d / 15) - h) * 60);
                const s = (((((d / 15) - h) * 60) - m) * 60).toFixed(2);
                return `${h}h ${m}m ${s}s`;
            })()
        },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text style={styles.title} className="font-sansation text-4xl text-white tracking-[1px]">{objectData.name}</Text>
                    <Text className="font-sansation text-xl text-neutral-400 tracking-[1px]">{objectData.blurb}</Text>
                    <Image source={require('@/assets/images/starSplash.jpg')} style={styles.preview} />
                    <View style={styles.grid}>
                        {stats.map(({ label, value }) => (
                            <View key={label} style={styles.cell}>
                                <Text className="font-sansation text-sm text-neutral-500 tracking-[1px]">{label}</Text>
                                <Text className="font-sansation text-2xl text-white tracking-[1px]">{value}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    safeArea: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 24,
    },
    preview: {
        width: '100%',
        resizeMode: 'contain',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 12,
        width: '100%',
    },
    cell: {
        width: '48%', // two columns; space-between puts the gap between them
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 12,
        gap: 4,
    },
    title: {
        marginLeft: 60, // start the title to the right of the back arrow
    },
    content: {
        flex: 1,
        // must be definite: children size themselves with % widths, which resolve to 0 against a
        // shrink-to-fit parent (SafeAreaView centres its children, so this View won't stretch on its own)
        width: "100%",
        justifyContent: "flex-start",
        gap: 16,
        paddingTop: 8, // sit alongside the transparent back-arrow header, not below it
        paddingHorizontal: 20,
    },
});
