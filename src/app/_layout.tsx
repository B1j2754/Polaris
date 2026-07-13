import '@/global.css'; // registers NativeWind styles for the whole app — must load at the root

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';

import { SessionProvider, useSession } from '@/ctx';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sansation: require('../../assets/fonts/Sansation-Regular.ttf'),
  });

  if (!loaded && !error) return null;

  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>

      <Stack.Protected guard={!session}>
        <Stack.Screen name="(login)" />
      </Stack.Protected>
    </Stack>
  );
}
