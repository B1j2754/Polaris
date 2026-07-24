import { Pressable, Text, View } from "react-native";

type Props = {
    segments: readonly string[];
    value: number;
    onChange: (index: number) => void;
};

/** Giant full-width pill split into segments; the selected one is a filled inner pill. */
export function SegmentedPill({ segments, value, onChange }: Props) {
    return (
        <View className="flex-row rounded-full bg-neutral-900 p-1">
            {segments.map((label, i) => {
                const selected = i === value;
                return (
                    <Pressable
                        key={label}
                        onPress={() => onChange(i)}
                        className={`flex-1 items-center justify-center rounded-full py-3 ${selected ? "bg-white" : ""}`}
                    >
                        <Text
                            className={`font-sansation text-base tracking-[1px] ${
                                selected ? "text-black" : "text-neutral-400"
                            }`}
                        >
                            {label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}
