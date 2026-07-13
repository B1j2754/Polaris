import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { useSession } from '@/ctx';

export default function Settings() {
  const { signOut } = useSession();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-[#05070f]">
      <Text className="font-sansation text-2xl text-white">Settings</Text>
      <Button title="Sign Out" color="black" cornerType="pill" onPress={signOut} />
    </View>
  );
}
