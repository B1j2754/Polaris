import '@/global.css'; // registers NativeWind styles for the whole app — must load at the root

import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';


export default function RootLayout() {
  const [loaded, error] = useFonts({
    Sansation: require('../../assets/fonts/Sansation-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
