import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
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

export default function CaptureDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const { captures, remove, update } = useCaptures();
    const { profile } = useProfile();

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
            <View className="flex-row flex-wrap gap-2">
                {OPTIONS.map(option => {
                    const picked = capture.targetID === option.id;
                    return (
                        <Pressable
                            key={option.id ?? "none"}
                            onPress={() => update(capture.id, "target_id", option.id)}
                            className={`rounded-full border px-3 py-1.5 ${
                                picked ? "border-white bg-neutral-800" : "border-neutral-800"
                            }`}
                        >
                            <Text
                                className={`font-sansation text-base tracking-[1px] ${
                                    picked ? "text-white" : "text-neutral-400"
                                }`}
                            >
                                {option.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

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
