import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { captureUri, useCaptures } from "@/captures";
import { Icon } from "@/components/icon";
import { BottomTabInset } from "@/constants/theme";
import { useProfile } from "@/profile";
import { TARGETS } from "@/targets";

const OPTIONS: { id: string | null; name: string }[] = [
    { id: null, name: "Unlinked" },
    ...Object.values(TARGETS).map(({ id, name }) => ({ id, name })),
];

// TODO: substring is slow with a larger object count. Fuzzy/alias is better here. 
const matches = (query: string) =>
    OPTIONS.filter(o => o.name.toLowerCase().includes(query.trim().toLowerCase()));

export default function CaptureDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const { captures, remove, update } = useCaptures();
    const { profile } = useProfile();
    const [picking, setPicking] = useState(false);
    const [query, setQuery] = useState("");

    const capture = captures.find(c => c.id === id);
    if (!capture) return <View className="flex-1 bg-[#000000]" />;

    const site = profile?.sites.find(s => s.id === capture.siteId);

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
            className="flex-1 bg-[#000000]"
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
            <Text className="font-sansation text-base text-neutral-400 tracking-[1px]">
                {new Date(capture.takenAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                })}
                {" · "}
                {site?.name ?? "Current location"}
            </Text>

            <Text className="font-sansation text-lg text-neutral-400 tracking-[1px]">What is it?</Text>
            <Pressable
                onPress={() => {
                    setQuery("");
                    setPicking(true);
                }}
                className="h-14 flex-row items-center justify-between rounded-full border border-neutral-800 px-5 active:bg-neutral-900"
            >
                <Text className="font-sansation text-lg text-white tracking-[1px]">
                    {OPTIONS.find(o => o.id === capture.targetID)?.name ?? "Unlinked"}
                </Text>
                <Icon name="chevronRight" size={20} color="#9ca3af" />
            </Pressable>

            <Modal visible={picking} transparent animationType="slide" onRequestClose={() => setPicking(false)}>
                <Pressable style={styles.backdrop} onPress={() => setPicking(false)} />
                <View className="rounded-t-3xl border-t border-neutral-800 bg-[#0a0a0a] pb-12 pt-5">
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                        placeholder="Search objects"
                        placeholderTextColor="#666"
                        className="font-sansation mx-6 mb-3 h-14 rounded-full border border-neutral-800 px-5 text-lg text-white"
                    />
                    <ScrollView style={styles.sheet} keyboardShouldPersistTaps="handled">
                        {matches(query).map(option => (
                            <Pressable
                                key={option.id ?? "none"}
                                onPress={() => {
                                    update(capture.id, "target_id", option.id);
                                    setPicking(false);
                                }}
                                className="flex-row items-center justify-between px-6 py-4 active:bg-neutral-900"
                            >
                                <Text className="font-sansation text-lg text-white tracking-[1px]">
                                    {option.name}
                                </Text>
                                {capture.targetID === option.id && <Icon name="check" size={18} />}
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            <Text className="font-sansation text-lg text-neutral-400 tracking-[1px]">Notes</Text>
            <TextInput
                defaultValue={capture.note ?? ""}
                onEndEditing={e => update(capture.id, "note", e.nativeEvent.text.trim() || null)}
                placeholder="Seeing, exposure, what you'd do differently"
                placeholderTextColor="#666"
                multiline
                className="font-sansation min-h-24 rounded-3xl border border-neutral-800 p-4 text-lg text-white"
            />

            <Pressable
                onPress={onDelete}
                className="h-14 flex-row items-center justify-center gap-2 rounded-full border-2 border-red-900 active:bg-red-950"
            >
                <Icon name="trash" size={18} color="#f87171" />
                <Text className="font-sansation text-lg leading-tight text-red-400 tracking-[1px]">
                    Delete capture
                </Text>
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