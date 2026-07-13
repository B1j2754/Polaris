import { Stack } from 'expo-router';

import { BackHeader } from '@/constants/theme';

export default function LoginLayout() {
  // every login screen gets the back chevron except the splash — it's the root, nothing to go back to
  return (
    <Stack screenOptions={BackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
