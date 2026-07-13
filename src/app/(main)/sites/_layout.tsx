import { Stack } from 'expo-router';

import { BackHeader } from '@/constants/theme';

// keeps sites/{info,altitude,coordinate-preference} inside the Sites tab instead of each becoming its own tab
export default function SitesLayout() {
  return (
    <Stack screenOptions={BackHeader}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
