import '@/global.css';

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { DarkScreen, ScreenBackground } from '@/constants/theme';
import { DATABASE_NAME, migrate } from '@/db';
import { ProfileProvider, useProfile } from '@/profile';

SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync(ScreenBackground);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sansation: require('../../assets/fonts/Sansation-Regular.ttf'),
  });

  if (!loaded && !error) return null;

  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
      <ProfileProvider>
        <RootNavigator />
      </ProfileProvider>
    </SQLiteProvider>
  );
}

function RootNavigator() {
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false, ...DarkScreen }}>
      <Stack.Protected guard={!!profile?.onboarded}>
        <Stack.Screen name="(main)" />
      </Stack.Protected>

      <Stack.Protected guard={!profile?.onboarded}>
        <Stack.Screen name="(login)" />
      </Stack.Protected>
    </Stack>
  );
}
