import { BackHeader } from "@/constants/theme";

import { Stack } from "expo-router";

// keeps sites/info (add + edit) inside the Sites tab instead of becoming its own tab
export default function SitesLayout() {
    return (
        <Stack screenOptions={BackHeader}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}
