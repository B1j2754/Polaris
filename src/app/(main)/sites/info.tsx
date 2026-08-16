import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { openBrowserAsync } from "expo-web-browser";
import { Modal, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { SegmentedPill } from "@/components/segmented-pill";
import { BottomTabInset } from "@/constants/theme";
import { useEntryFocus } from "@/hooks/use-entry-focus";
import { useProfile } from "@/lib/profile";
import { HORIZON_PRESETS, searchPlaces, type Site } from "@/lib/sites";
import { usePalette } from "@/lib/theming";

const DEBOUNCE_MS = 400;

const PILL_INPUT = "font-sansation h-14 rounded-full border border-line px-5 text-lg leading-tight text-fg";

const GUIDE: { image: number; caption: string }[] = [
    {
        image: require("@/assets/images/hand-demo-spread.jpg"),
        caption: "A hand, spread out at arm's length ≈ 25°.",
    },
    {
        image: require("@/assets/images/hand-demo-fist.jpg"),
        caption: "A fist at arm's length ≈ 10°.",
    },
    {
        image: require("@/assets/images/hand-demo-three.jpg"),
        caption: "Three fingers, spread out at arm's length ≈ 5°.",
    },
    {
        image: require("@/assets/images/hand-demo-finger.jpg"),
        caption: "A finger at arm's length ≈ 1°.",
    },
];

export default function SiteInfo() {
    const Palette = usePalette();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const insets = useSafeAreaInsets();
    const entryFocus = useEntryFocus();
    const { profile, save } = useProfile();
    const sites = profile?.sites ?? [];

    const [draft, setDraft] = useState<Site | null>(() => sites.find((s) => s.id === id) ?? null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Site[]>([]);
    const [searching, setSearching] = useState(false);
    const [guideOpen, setGuideOpen] = useState(false);

    useEffect(() => {
        const term = query.trim();
        if (term.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        const timer = setTimeout(() => {
            searchPlaces(term).then((found) => {
                setResults(found);
                setSearching(false);
            });
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    const patch = (fields: Partial<Site>) => setDraft((current) => current && { ...current, ...fields });

    const onSave = async () => {
        if (!draft) return;
        await save({
            sites: [...sites.filter((s) => s.id !== draft.id), draft],
            activeSite: draft.id,
        });
        router.back();
    };

    const onRemove = async () => {
        await save({
            sites: sites.filter((s) => s.id !== id),
            activeSite: profile?.activeSite === id ? null : (profile?.activeSite ?? null),
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-black">
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: insets.top + 56,
                    paddingBottom: BottomTabInset + 24,
                    gap: 16,
                }}
            >
                <Text className="font-sansation text-4xl text-fg tracking-[1px]">{id ? "Edit Site" : "New Site"}</Text>

                {!draft ? (
                    <>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search a town, park or landmark"
                            placeholderTextColor={Palette.placeholder}
                            {...entryFocus}
                            autoCorrect={false}
                            returnKeyType="search"
                            textAlignVertical="center"
                            className={PILL_INPUT}
                        />
                        <Text className="font-sansation text-base text-fg-dim tracking-[1px]">
                            {searching
                                ? "Looking..."
                                : results.length === 0 && query.trim().length >= 2
                                  ? "Nothing found // try a nearby town."
                                  : "We'll get the coordinates and elavation for you."}
                        </Text>
                        <Pressable onPress={() => openBrowserAsync("https://open-meteo.com/")}>
                            <Text className="text-center font-sansation text-xs text-fg-faint tracking-[1px] underline">
                                Weather data by Open-Meteo.com
                            </Text>
                        </Pressable>
                        {results.map((place) => (
                            <Pressable
                                key={place.id}
                                onPress={() => setDraft(place)}
                                className="flex-row items-center gap-3 rounded-3xl border border-line bg-sheet px-5 py-4 active:bg-surface"
                            >
                                <Icon name="mapPin" size={20} color={Palette.iconMuted} />
                                <View className="flex-1">
                                    <Text numberOfLines={1} className="font-sansation text-lg text-fg">
                                        {place.name}
                                    </Text>
                                    <Text className="font-sansation text-sm text-fg-muted">
                                        {place.lat.toFixed(2)}°, {place.lon.toFixed(2)}° · {place.elevation.toFixed(0)}m
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </>
                ) : (
                    <>
                        <Field label="Name">
                            <TextInput
                                value={draft.name}
                                onChangeText={(name) => patch({ name })}
                                placeholder="Name this place"
                                placeholderTextColor={Palette.placeholder}
                                textAlignVertical="center"
                                className={PILL_INPUT}
                            />
                        </Field>

                        <Field label={`Coordinates: ${draft.lat.toFixed(4)}°, ${draft.lon.toFixed(4)}°`}>
                            <Pressable
                                onPress={() => {
                                    setDraft(null);
                                    setQuery("");
                                }}
                                className="h-14 flex-row items-center justify-center rounded-full border border-line active:bg-surface"
                            >
                                <Text className="font-sansation text-base leading-tight text-fg-muted tracking-[1px]">
                                    Search for an alternative place
                                </Text>
                            </Pressable>
                        </Field>

                        <Field label="Elevation (meters)">
                            <TextInput
                                value={String(draft.elevation)}
                                onChangeText={(text) => patch({ elevation: Number(text) || 0 })}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={Palette.placeholder}
                                textAlignVertical="center"
                                className={PILL_INPUT}
                            />
                        </Field>

                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">
                                    How much sky is blocked?
                                </Text>
                                <Pressable onPress={() => setGuideOpen(true)} hitSlop={12}>
                                    <Icon name="info" size={18} color={Palette.iconMuted} />
                                </Pressable>
                            </View>
                            {/* TODO: Move this to a number input, alongside a stronger lead to the visual estimation. */}
                            <SegmentedPill
                                segments={HORIZON_PRESETS.map((p) => p.label)}
                                value={Math.max(
                                    0,
                                    HORIZON_PRESETS.findIndex((p) => p.deg === draft.horizonDeg),
                                )}
                                onChange={(i) => patch({ horizonDeg: HORIZON_PRESETS[i].deg })}
                            />
                            <Text className="font-sansation text-sm text-fg-dim tracking-[1px]">
                                Trees, buildings and hills eat the bottom {draft.horizonDeg}° of your sky. Nothing below
                                that counts as up.
                            </Text>
                        </View>

                        <View className="items-center gap-3 pt-2">
                            <Button
                                title="Save site"
                                cornerType="pill"
                                onPress={onSave}
                                disabled={!draft.name.trim()}
                                style={{ opacity: draft.name.trim() ? 1 : 0.4 }}
                            />
                            {id && (
                                <Pressable
                                    onPress={onRemove}
                                    className="h-14 w-[90%] flex-row items-center justify-center gap-2 rounded-full border-2 border-danger-border active:bg-danger-bg"
                                >
                                    <Icon name="trash" size={18} color={Palette.destructive} />
                                    <Text className="font-sansation text-lg leading-tight text-danger tracking-[1px]">
                                        Delete site
                                    </Text>
                                </Pressable>
                            )}
                        </View>
                    </>
                )}
            </ScrollView>

            <HorizonGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
        </View>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View className="gap-2">
            <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">{label}</Text>
            {children}
        </View>
    );
}

function HorizonGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { width } = useWindowDimensions();
    const [page, setPage] = useState(0);
    const imageSize = Math.min(width - 48, 340);

    // TODO: Stop using modal. Convert to @gorhom/bottom-sheet
    return (
        <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }} onPress={onClose} />
            <View className="rounded-t-3xl border-t border-line bg-sheet pb-12 pt-5">
                <Text className="self-center font-sansation px-6 pb-3 text-2xl text-fg tracking-[1px]">
                    Estimating your horizon
                </Text>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}
                >
                    {GUIDE.map(({ image, caption }, i) => (
                        <View key={i} style={{ width }} className="items-center gap-3 px-6">
                            <View
                                style={{ width: imageSize, height: imageSize }}
                                className="overflow-hidden rounded-3xl border border-line bg-sheet"
                            >
                                <Image source={image} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                            </View>
                            <Text className="font-sansation text-center text-base text-fg-muted tracking-[1px]">
                                {caption}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
                <View className="flex-row justify-center gap-2 pt-3">
                    {GUIDE.map((_, i) => (
                        <View key={i} className={`h-2 w-2 rounded-full ${i === page ? "bg-fg" : "bg-line-2"}`} />
                    ))}
                </View>
                <Pressable
                    onPress={onClose}
                    className="self-end flex-row items-center gap-2 rounded-full border border-fg/20 bg-surface px-3 py-1.5 active:opacity-60 mr-5 mt-5"
                >
                    <Text className="font-sansation text-lg text-fg tracking-[1px]">Got it</Text>
                </Pressable>
            </View>
        </Modal>
    );
}
