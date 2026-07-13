import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/button';

export default function SignUpInfo() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-[#05070f]">
      <Text className="font-sansation text-2xl text-white">SignUpInfo</Text>
      <Button
        title="Next"
        color="white"
        cornerType="pill"
        onPress={() => router.push('/signup/interests')}
      />
    </View>
  );
}
