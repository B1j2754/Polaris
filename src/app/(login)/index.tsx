import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { ConstellationSky } from '@/components/constellation-sky';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <ConstellationSky />
      <SafeAreaView style={styles.safeArea}>
        <Text className="font-sansation text-8xl text-white tracking-[4px]">POLARIS</Text>
        <Text className="font-sansation text-xl text-gray-300 tracking-[4px]">
          Find your next target
        </Text>
        <Button
          title="Get Started"
          color="white"
          cornerType="pill"
          onPress={() => router.push('/signup/info')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070f',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
