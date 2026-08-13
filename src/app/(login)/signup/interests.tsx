import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { ConstellationSky } from "@/components/constellation-sky";
import { Icon } from "@/components/icon";
import { Box } from "@/components/interestBox";
import { ScreenBackground } from "@/constants/theme";
import { INTERESTS, toggleInterest } from "@/interests";
import { useProfile } from "@/profile";

export default function SignUpInterests() {
    const { profile, save } = useProfile();
    const [selected, setSelected] = useState<string[]>(profile?.interests ?? []);

    const toggle = (label: string) => setSelected(current => toggleInterest(current, label));

    const next = async () => {
        await save({ interests: selected });
        router.push("/signup/equipment");
    };

    return (
        <View style={styles.container}>
            <ConstellationSky />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text className="font-sansation text-4xl text-fg tracking-[1px]">What interests you?</Text>
                    <Text className="font-sansation text-center text-xl text-fg-muted tracking-[1px]">
                        Select all that apply.{"\n"}(You can always change these later.)
                    </Text>

                    <View className="w-full flex-row flex-wrap justify-center gap-2">
                        {INTERESTS.map(({ label, icon }) => (
                            <Box
                                key={label}
                                title={label}
                                selected={selected.includes(label)}
                                onPress={() => toggle(label)}
                            >
                                <Icon name={icon} size={32} />
                            </Box>
                        ))}
                    </View>
                </View>

                <Button title="Next" color="white" cornerType="pill" onPress={next} />
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
});
