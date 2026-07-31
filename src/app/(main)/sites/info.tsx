import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { SegmentedPill } from "@/components/segmented-pill";
import { BottomTabInset } from "@/constants/theme";
import { useEntryFocus } from "@/hooks/use-entry-focus";
import { useProfile } from "@/profile";
import { HORIZON_PRESETS, searchPlaces, type Site } from "@/sites";

const DEBOUNCE_MS = 400;

const PILL_INPUT =
    "font-sansation h-14 rounded-full border border-neutral-800 px-5 text-lg leading-tight text-white";

/**
 * TODO: Add images, similar to the example below. (Denote degree estimating technique)
 * { image: require('@/assets/images/horizon-guide/fist.png'), caption: 'A fist at arm's length ≈ 10°.' },
 */
const GUIDE: { image: number; caption: string }[] = [];

export default function SiteInfo() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const insets = useSafeAreaInsets();
    const entryFocus = useEntryFocus();
    const { profile, save } = useProfile();
    const sites = profile?.sites ?? [];

    const [draft, setDraft] = useState<Site | null>(() => sites.find(s => s.id === id) ?? null);
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
            searchPlaces(term).then(found => {
                setResults(found);
                setSearching(false);
            });
        }, DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [query]);

    const patch = (fields: Partial<Site>) => setDraft(current => current && { ...current, ...fields });

    const onSave = async () => {
        if (!draft) return;
        await save({ sites: [...sites.filter(s => s.id !== draft.id), draft], activeSite: draft.id });
        router.back();
    };

    const onRemove = async () => {
        await save({
            sites: sites.filter(s => s.id !== id),
            activeSite: profile?.activeSite === id ? null : (profile?.activeSite ?? null),
        });
        router.back();
    };

    return (
        <View className="flex-1 bg-[#000000]">
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingTop: insets.top + 56,
                    paddingBottom: BottomTabInset + 24,
                    gap: 16,
                }}
            >
                <Text className="font-sansation text-4xl text-white tracking-[1px]">
                    {id ? "Edit Site" : "New Site"}
                </Text>

                {!draft ? (
                    <>
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search a town, park or landmark"
                            placeholderTextColor="#666"
                            {...entryFocus}
                            autoCorrect={false}
                            returnKeyType="search"
                            textAlignVertical="center"
                            className={PILL_INPUT}
                        />
                        <Text className="font-sansation text-base text-neutral-500 tracking-[1px]">
                            {searching
                                ? "Looking…"
                                : results.length === 0 && query.trim().length >= 2
                                  ? "Nothing found // try a nearby town."
                                  : "We'll get the coordinates and elavation for you."}
                        </Text>
                        {results.map(place => (
                            <Pressable
                                key={place.id}
                                onPress={() => setDraft(place)}
                                className="flex-row items-center gap-3 rounded-3xl border border-neutral-800 bg-neutral-950 px-5 py-4 active:bg-neutral-900"
                            >
                                <Icon name="mapPin" size={20} color="#9ca3af" />
                                <View className="flex-1">
                                    <Text numberOfLines={1} className="font-sansation text-lg text-white">
                                        {place.name}
                                    </Text>
                                    <Text className="font-sansation text-sm text-neutral-400">
                                        {place.lat.toFixed(2)}°, {place.lon.toFixed(2)}° ·{" "}
                                        {place.elevation.toFixed(0)}m
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
                                onChangeText={name => patch({ name })}
                                placeholder="Name this place"
                                placeholderTextColor="#666"
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
                                className="h-14 flex-row items-center justify-center rounded-full border border-neutral-800 active:bg-neutral-900"
                            >
                                <Text className="font-sansation text-base leading-tight text-neutral-400 tracking-[1px]">
                                    Search for an alternative place
                                </Text>
                            </Pressable>
                        </Field>

                        <Field label="Elevation (meters)">
                            <TextInput
                                value={String(draft.elevation)}
                                onChangeText={text => patch({ elevation: Number(text) || 0 })}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#666"
                                textAlignVertical="center"
                                className={PILL_INPUT}
                            />
                        </Field>

                        <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Text className="font-sansation text-lg text-neutral-400 tracking-[1px]">
                                    How much sky is blocked?
                                </Text>
                                <Pressable onPress={() => setGuideOpen(true)} hitSlop={12}>
                                    <Icon name="info" size={18} color="#9ca3af" />
                                </Pressable>
                            </View>
                            {/* TODO: Move this to a number input, alongside a stronger lead to the visual estimation. */}
                            <SegmentedPill
                                segments={HORIZON_PRESETS.map(p => p.label)}
                                value={Math.max(
                                    0,
                                    HORIZON_PRESETS.findIndex(p => p.deg === draft.horizonDeg)
                                )}
                                onChange={i => patch({ horizonDeg: HORIZON_PRESETS[i].deg })}
                            />
                            <Text className="font-sansation text-sm text-neutral-500 tracking-[1px]">
                                Trees, buildings and hills eat the bottom {draft.horizonDeg}° of your sky.
                                Nothing below that counts as up.
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
                                    className="h-14 w-[90%] flex-row items-center justify-center gap-2 rounded-full border-2 border-red-900 active:bg-red-950"
                                >
                                    <Icon name="trash" size={18} color="#f87171" />
                                    <Text className="font-sansation text-lg leading-tight text-red-400 tracking-[1px]">
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
            <Text className="font-sansation text-lg text-neutral-400 tracking-[1px]">{label}</Text>
            {children}
        </View>
    );
}

function HorizonGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { width } = useWindowDimensions();

    // TODO: Stop using modal. Convert to @gorhom/bottom-sheet
    return (
        <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)" }} onPress={onClose} />
            <View className="rounded-t-3xl border-t border-neutral-800 bg-[#0a0a0a] pb-12 pt-5">
                <Text className="font-sansation px-6 pb-3 text-2xl text-white tracking-[1px]">
                    Estimating your horizon
                </Text>
                {/* TODO: Fix the placeholder text, fill in with images and guide showing estimations for horizon altitude. */}
                {GUIDE.length === 0 ? (
                    <Text className="font-sansation px-6 pb-4 text-base text-neutral-400 tracking-[1px]">
                        === PLACEHOLDER ===
                    </Text>
                ) : (
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                        {GUIDE.map(({ image, caption }, i) => (
                            <View key={i} style={{ width }} className="gap-3 px-6">
                                <Image
                                    source={image}
                                    style={{ width: width - 48, height: (width - 48) * 0.75 }}
                                    contentFit="contain"
                                />
                                <Text className="font-sansation text-base text-neutral-400 tracking-[1px]">
                                    {caption}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
                <Pressable onPress={onClose} className="px-6 pt-2">
                    <Text className="font-sansation text-lg text-white tracking-[1px]">Got it</Text>
                </Pressable>
            </View>
        </Modal>
    );
}
