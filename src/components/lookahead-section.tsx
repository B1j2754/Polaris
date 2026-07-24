import { useState } from "react";
import { Text, View } from "react-native";

import { SegmentedPill } from "@/components/segmented-pill";

const SEGMENTS = ["Tonight, until sunrise", "Coming weeks"] as const;

/** Toggles between the two look-ahead views. Panels are placeholders atm. */
export function LookaheadSection() {
    const [tab, setTab] = useState(0);
    return (
        <View className="gap-3">
            <SegmentedPill segments={SEGMENTS} value={tab} onChange={setTab} />
            {tab === 0 ? (
                <Panel text="Objects rising into view later tonight." />
            ) : (
                <Panel text="Objects becoming worth viewing over the coming weeks." />
            )}
        </View>
    );
}

function Panel({ text }: { text: string }) {
    return (
        <View className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
            <Text className="font-sansation text-base text-neutral-400 tracking-[1px]">{text}</Text>
        </View>
    );
}
