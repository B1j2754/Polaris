import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { useProfile } from '@/profile';

export default function Settings() {
  const { reset } = useProfile();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-[#000000]">
      <Text className="font-sansation text-2xl text-white">Settings</Text>
      <Button title="Reset Profile" color="black" cornerType="pill" onPress={reset} />
    </View>
  );
}
