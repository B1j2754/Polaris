import { Icon } from "@/components/icon";
import { BottomTabInset } from "@/constants/theme";
import { captureUri, useCaptures } from "@/lib/captures";
import { useProfile } from "@/lib/profile";
import { TARGETS } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";

const OPTIONS: { id: string | null; name: string }[] = [
    { id: null, name: "Unlinked" },
    ...Object.values(TARGETS).map(({ id, name }) => ({ id, name })),
];

// TODO: substring is slow with a larger object count. Fuzzy/alias is better here.
const matches = (query: string) => OPTIONS.filter((o) => o.name.toLowerCase().includes(query.trim().toLowerCase()));

export default function CaptureDetail() {
    const Palette = usePalette();
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const { captures, remove, update } = useCaptures();
    const { profile } = useProfile();
    const [picking, setPicking] = useState(false);
    const [query, setQuery] = useState("");

    const capture = captures.find((c) => c.id === id);
    if (!capture) return <View className="flex-1 bg-black" />;

    const site = profile?.sites.find((s) => s.id === capture.siteId);

    const onDelete = () =>
        Alert.alert("Delete this capture?", "It leaves Polaris. Your camera roll is untouched.", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await remove(capture);
                    router.back();
                },
            },
        ]);

    return (
        <ScrollView
            className="flex-1 bg-black"
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: insets.top + 56,
                paddingBottom: BottomTabInset + 24,
                gap: 16,
            }}
        >
            <Image
                source={captureUri(capture.file)}
                style={{ width: "100%", aspectRatio: 1, borderRadius: 16 }}
                contentFit="contain"
            />
            <Text className="font-sansation text-base text-fg-muted tracking-[1px]">
                {new Date(capture.takenAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                })}
                {" · "}
                {site?.name ?? "Current location"}
            </Text>

            <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">What is it?</Text>
            <Pressable
                onPress={() => {
                    setQuery("");
                    setPicking(true);
                }}
                className="h-14 flex-row items-center justify-between rounded-full border border-line px-5 active:bg-surface"
            >
                <Text className="font-sansation text-lg text-fg tracking-[1px]">
                    {OPTIONS.find((o) => o.id === capture.targetID)?.name ?? "Unlinked"}
                </Text>
                <Icon name="chevronRight" size={20} color={Palette.iconMuted} />
            </Pressable>

            <Modal visible={picking} transparent animationType="slide" onRequestClose={() => setPicking(false)}>
                <Pressable style={styles.backdrop} onPress={() => setPicking(false)} />
                <View className="rounded-t-3xl border-t border-line bg-sheet pb-12 pt-5">
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                        placeholder="Search objects"
                        placeholderTextColor={Palette.placeholder}
                        className="font-sansation mx-6 mb-3 h-14 rounded-full border border-line px-5 text-lg text-fg"
                    />
                    <ScrollView style={styles.sheet} keyboardShouldPersistTaps="handled">
                        {matches(query).map((option) => (
                            <Pressable
                                key={option.id ?? "none"}
                                onPress={() => {
                                    update(capture.id, "target_id", option.id);
                                    setPicking(false);
                                }}
                                className="flex-row items-center justify-between px-6 py-4 active:bg-surface"
                            >
                                <Text className="font-sansation text-lg text-fg tracking-[1px]">{option.name}</Text>
                                {capture.targetID === option.id && <Icon name="check" size={18} />}
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            <Text className="font-sansation text-lg text-fg-muted tracking-[1px]">Notes</Text>
            <TextInput
                defaultValue={capture.note ?? ""}
                onEndEditing={(e) => update(capture.id, "note", e.nativeEvent.text.trim() || null)}
                placeholder="Seeing, exposure, what you'd do differently"
                placeholderTextColor={Palette.placeholder}
                multiline
                className="font-sansation min-h-24 rounded-3xl border border-line p-4 text-lg text-fg"
            />

            <Pressable
                onPress={onDelete}
                className="h-14 flex-row items-center justify-center gap-2 rounded-full border-2 border-danger-border active:bg-danger-bg"
            >
                <Icon name="trash" size={18} color={Palette.destructive} />
                <Text className="font-sansation text-lg leading-tight text-danger tracking-[1px]">Delete capture</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    sheet: {
        maxHeight: 560,
    },
});
