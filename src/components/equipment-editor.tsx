import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { Icon } from "@/components/icon";
import {
    CAMERA_PRESETS,
    FIELDS,
    TELESCOPE_PRESETS,
    customEquipment,
    fieldOfView,
    specLine,
    stripPreset,
    type Camera,
    type Equipment,
    type Kind,
    type Telescope,
} from "@/equipment";

type Props = {
    value: Equipment[];
    onChange: (next: Equipment[]) => void;
    emptyText?: string;
};

/**
 * The kit list + add sheet. Controlled, and deliberately without its own ScrollView:
 * signup and settings both mount it inside one of theirs.
 */
export function EquipmentEditor({ value, onChange, emptyText }: Props) {
    const [picking, setPicking] = useState<Kind | null>(null);
    const [form, setForm] = useState<Record<string, string>>({});

    const close = () => {
        setPicking(null);
        setForm({});
    };

    const add = (item: Equipment) => {
        onChange([...value, item]);
        close();
    };

    const scope = value.find(i => i.kind === "telescope") as Telescope | undefined;
    const camera = value.find(i => i.kind === "camera") as Camera | undefined;
    const presets = picking === "camera" ? CAMERA_PRESETS : TELESCOPE_PRESETS;
    const custom = picking && customEquipment(picking, form);

    return (
        <View className="w-full gap-3">
            {value.length === 0 && (
                <Text className="font-sansation py-6 text-center text-base text-neutral-500">
                    {emptyText ?? "Nothing added yet // you can always do this later."}
                </Text>
            )}

            {value.map((item, index) => (
                <View
                    key={`${item.label}-${index}`}
                    className="w-full flex-row items-center rounded-3xl border border-neutral-800 bg-neutral-950 px-5 py-4"
                >
                    <View className="flex-1 pr-3">
                        <Text numberOfLines={1} className="font-sansation text-lg text-white">
                            {item.label}
                        </Text>
                        <Text className="font-sansation text-sm text-neutral-400">{specLine(item)}</Text>
                    </View>
                    <Pressable hitSlop={12} onPress={() => onChange(value.filter((_, i) => i !== index))}>
                        <Icon name="x" size={20} color="#9ca3af" />
                    </Pressable>
                </View>
            ))}

            {scope && camera && (
                <Text className="font-sansation px-2 text-center text-sm text-neutral-500">
                    {fieldOfView(scope, camera)}
                </Text>
            )}

            <View className="flex-row justify-center gap-3">
                {(["telescope", "camera"] as Kind[]).map(kind => (
                    <Pressable
                        key={kind}
                        onPress={() => setPicking(kind)}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-neutral-700 py-4 active:bg-neutral-900"
                    >
                        <Icon name="plus" size={18} />
                        <Text className="font-sansation text-lg text-white">
                            {kind === "telescope" ? "Telescope" : "Camera"}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Modal visible={picking !== null} transparent animationType="slide" onRequestClose={close}>
                <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <Pressable style={styles.backdrop} onPress={close} />
                    <View className="rounded-t-3xl border-t border-neutral-800 bg-[#0a0a0a] pb-12 pt-5">
                        <Text className="font-sansation px-6 pb-3 text-2xl text-white tracking-[1px]">
                            {picking === "camera" ? "Cameras" : "Telescopes"}
                        </Text>
                        <ScrollView style={styles.sheet} keyboardShouldPersistTaps="handled">
                            {presets.map(preset => (
                                <Pressable
                                    key={preset.id}
                                    onPress={() => add(stripPreset(preset))}
                                    className="px-6 py-4 active:bg-neutral-900"
                                >
                                    <Text className="font-sansation text-lg text-white">{preset.label}</Text>
                                    <Text className="font-sansation text-sm text-neutral-400">{preset.blurb}</Text>
                                </Pressable>
                            ))}

                            {picking && (
                                <View className="mt-2 gap-3 border-t border-neutral-800 px-6 pt-5">
                                    <Text className="font-sansation text-base text-neutral-400">Or enter your own</Text>

                                    <TextInput
                                        value={form.label ?? ""}
                                        onChangeText={label => setForm(f => ({ ...f, label }))}
                                        placeholder="Name (optional)"
                                        placeholderTextColor="#666"
                                        className="font-sansation h-14 rounded-full border border-neutral-800 px-5 text-lg text-white"
                                    />

                                    <View className="flex-row gap-3">
                                        {FIELDS[picking].map(field => (
                                            <TextInput
                                                key={field.key}
                                                value={form[field.key] ?? ""}
                                                onChangeText={v => setForm(f => ({ ...f, [field.key]: v }))}
                                                placeholder={`${field.label} (${field.unit})`}
                                                placeholderTextColor="#666"
                                                keyboardType="decimal-pad"
                                                className="font-sansation h-14 flex-1 rounded-full border border-neutral-800 px-4 text-base text-white"
                                            />
                                        ))}
                                    </View>

                                    <Pressable
                                        disabled={!custom}
                                        style={{ opacity: custom ? 1 : 0.4 }}
                                        onPress={() => custom && add(custom)}
                                        className="mt-1 items-center rounded-full bg-white py-4 active:bg-neutral-200"
                                    >
                                        <Text className="font-sansation text-lg font-bold text-black">Add</Text>
                                    </Pressable>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    sheet: {
        maxHeight: 380,
    },
});
