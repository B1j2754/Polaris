import { Text, View } from 'react-native';

import { Button } from '@/components/button';
import { useSession } from '@/ctx';

export default function SignUpEquipment() {
  const { signIn } = useSession();

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-[#05070f]">
      <Text className="font-sansation text-2xl text-white">SignUpEquipment</Text>
      <Button title="Finish" color="white" cornerType="pill" onPress={() => signIn()} />
    </View>
  );
}
