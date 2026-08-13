import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { ConstellationSky } from "@/components/constellation-sky";
import { EquipmentEditor } from "@/components/equipment-editor";
import { ScreenBackground } from "@/constants/theme";
import type { Equipment } from "@/lib/equipment";
import { useProfile } from "@/lib/profile";

export default function SignUpEquipment() {
    const { profile, save } = useProfile();
    const [items, setItems] = useState<Equipment[]>(profile?.equipment ?? []);

    return (
        <View style={styles.container}>
            <ConstellationSky />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text className="font-sansation text-4xl text-fg tracking-[1px]">Your kit</Text>
                    <Text className="font-sansation text-center text-xl text-fg-muted tracking-[1px]">
                        What are you observing with?
                    </Text>

                    <ScrollView
                        style={styles.list}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <EquipmentEditor value={items} onChange={setItems} />
                    </ScrollView>
                </View>

                <Button
                    title="Finish"
                    color="white"
                    cornerType="pill"
                    onPress={() => save({ equipment: items, onboarded: true })}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ScreenBackground,
    },
    safeArea: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 24,
    },
    content: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    list: {
        width: "90%",
        flexGrow: 0,
        maxHeight: "55%",
    },
    listContent: {
        gap: 12,
    },
});
