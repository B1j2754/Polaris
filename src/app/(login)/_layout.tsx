import { Stack } from "expo-router";

import { BackHeader } from "@/constants/theme";

export default function LoginLayout() {
  return (
    <Stack screenOptions={BackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
