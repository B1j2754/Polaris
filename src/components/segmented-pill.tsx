import { Pressable, Text, View } from "react-native";

type Props = {
    segments: readonly string[];
    value: number;
    onChange: (index: number) => void;
};

/** Giant full-width pill split into segments; the selected one is a filled inner pill. */
export function SegmentedPill({ segments, value, onChange }: Props) {
    return (
        <View className="flex-row rounded-full bg-surface p-1">
            {segments.map((label, i) => {
                const selected = i === value;
                return (
                    <Pressable
                        key={label}
                        onPress={() => onChange(i)}
                        className={`flex-1 items-center justify-center rounded-full py-3 ${selected ? "bg-fg" : ""}`}
                    >
                        <Text
                            className={`font-sansation text-base leading-tight tracking-[1px] ${
                                selected ? "text-black" : "text-fg-muted"
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
