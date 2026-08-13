import '@/global.css';

import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { BackHeader, DarkScreen, ScreenBackground } from '@/constants/theme';
import { DATABASE_NAME, migrate } from '@/lib/db';
import { ProfileProvider, useProfile } from '@/lib/profile';
import { ColorVarProvider, PaletteProvider, ThemeProvider } from '@/lib/theming';

// Expo go doesn't register a view controller
const IN_EXPO_GO = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

if (!IN_EXPO_GO) SplashScreen.preventAutoHideAsync();

SystemUI.setBackgroundColorAsync(ScreenBackground);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sansation: require('../../assets/fonts/Sansation-Regular.ttf'),
  });

  if (!loaded && !error) return null;

  return (
    <ThemeProvider>
      <PaletteProvider>
        <ColorVarProvider>
          <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
            <ProfileProvider>
              <RootNavigator />
            </ProfileProvider>
          </SQLiteProvider>
        </ColorVarProvider>
      </PaletteProvider>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && !IN_EXPO_GO) SplashScreen.hideAsync().catch(() => {});
  }, [isLoading]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false, ...DarkScreen }}>
      <Stack.Protected guard={!!profile?.onboarded}>
        <Stack.Screen name="(main)" />
        <Stack.Screen name="objects/[object]" options={BackHeader} />
        <Stack.Screen name="captures/[id]" options={BackHeader} />
      </Stack.Protected>

      <Stack.Protected guard={!profile?.onboarded}>
        <Stack.Screen name="(login)" />
      </Stack.Protected>
    </Stack>
  );
}
