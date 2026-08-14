import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/button";
import { ConstellationSky } from "@/components/constellation-sky";
import { ScreenBackground } from "@/constants/theme";
import { useEntryFocus } from "@/hooks/use-entry-focus";
import { useProfile } from "@/lib/profile";
import { usePalette } from "@/lib/theming";

export default function SignUpInfo() {
    const { profile, save } = useProfile();
    const entryFocus = useEntryFocus();
    const [name, setName] = useState(profile?.name ?? "");
    const trimmed = name.trim();
    const Palette = usePalette();

    const next = async () => {
        await save({ name: trimmed });
        router.push("/signup/interests");
    };

    return (
        <View style={styles.container}>
            <ConstellationSky />
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.content}>
                        <Text className="font-sansation text-4xl text-fg tracking-[1px]">Welcome</Text>
                        <Text className="font-sansation text-center text-xl text-fg-muted tracking-[1px]">
                            What should we call you?
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            placeholderTextColor={Palette.placeholder}
                            {...entryFocus}
                            autoCapitalize="words"
                            autoCorrect={false}
                            returnKeyType="next"
                            onSubmitEditing={() => trimmed && next()}
                            textAlign="center"
                            textAlignVertical="center"
                            className="font-sansation h-16 w-[90%] rounded-full border-2 border-line px-6 text-xl text-fg"
                        />
                    </View>
                    <Button
                        title="Next"
                        color="white"
                        cornerType="pill"
                        disabled={!trimmed}
                        style={{ opacity: trimmed ? 1 : 0.4 }}
                        onPress={next}
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ScreenBackground,
    },
    flex: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: "center",
        paddingBottom: 24,
    },
    content: {
        flex: 1,
        /** 
         * Must be definite: children size themselves with % widths, which resolve to 0 against a shrink-to-fit parent.
         * (SafeAreaView centres its children, so this View won't stretch on its own)
         */ 
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
});
