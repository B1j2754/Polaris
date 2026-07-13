import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { useSession } from '@/ctx';

export default function SignIn() {
  const { signIn } = useSession();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text className="font-sansation text-4xl text-white tracking-[2px]">Sign In</Text>
        <Button title="Sign In" color="white" cornerType="pill" onPress={() => signIn()} />
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
