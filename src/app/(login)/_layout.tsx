import { BackHeader } from "@/constants/theme";

import { Stack } from "expo-router";

export default function LoginLayout() {
    return (
        <Stack screenOptions={BackHeader}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
