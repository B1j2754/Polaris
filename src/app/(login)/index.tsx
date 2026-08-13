import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { ConstellationSky } from "@/components/constellation-sky";
import { ScreenBackground } from "@/constants/theme";

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <ConstellationSky />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <Text className="font-sansation text-8xl text-fg tracking-[4px]">POLARIS</Text>
                    <Text className="font-sansation text-xl text-fg-subtle tracking-[4px]">
                        Find your next target
                    </Text>
                </View>
                <Button
                    title="Get Started"
                    color="white"
                    cornerType="pill"
                    onPress={() => router.push("/signup/info")}
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
    // takes the leftover height so the content centres and the button sits on the bottom edge
    content: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
});
