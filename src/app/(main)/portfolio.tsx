import { Image } from "expo-image";
import { Link } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { captureUri, useCaptures } from "@/lib/captures";
import { Icon } from "@/components/icon";
import { BottomTabInset } from "@/constants/theme";
import { useProfile } from "@/lib/profile";

export default function Portfolio() {
  const { captures, add } = useCaptures();
  const { profile } = useProfile();

  const objects = new Set(captures.map((c) => c.targetID).filter(Boolean)).size;

  const onAdd = () =>
    Alert.alert("Add a capture", undefined, [
      {
        text: "Take a photo",
        onPress: () => add("camera", profile?.activeSite ?? null),
      },
      {
        text: "Choose from library",
        onPress: () => add("library", profile?.activeSite ?? null),
      },
      { text: "Cancel", style: "cancel" },
    ]);

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: BottomTabInset + 24,
          gap: 16,
        }}
      >
        <Text className="font-sansation pt-2 text-4xl text-fg tracking-[1px]">Portfolio</Text>
        <Text className="font-sansation text-base text-fg-muted tracking-[1px]">
          {captures.length === 0
            ? "Nothing shot yet // whatever you add here stays pinned to the object and the site you shot it from."
            : `${captures.length} captures · ${objects} objects`}
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-2">
          {captures.map((capture) => (
            <Link key={capture.id} href={`/captures/${capture.id}`} asChild>
              <Pressable style={{ width: "32%", aspectRatio: 1 }} className="active:opacity-60">
                <Image source={captureUri(capture.file)} style={{ flex: 1, borderRadius: 12 }} contentFit="cover" />
              </Pressable>
            </Link>
          ))}
        </View>

        <Pressable
          onPress={onAdd}
          className="flex-row items-center justify-center gap-2 rounded-full border border-line-2 py-4 active:bg-surface"
        >
          <Icon name="plus" size={18} />
          <Text className="font-sansation text-lg text-fg tracking-[1px]">Add a capture</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
