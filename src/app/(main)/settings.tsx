import Constants from "expo-constants";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EquipmentEditor } from "@/components/equipment-editor";
import { Icon } from "@/components/icon";
import { Box } from "@/components/interestBox";
import { BottomTabInset } from "@/constants/theme";
import { INTERESTS, toggleInterest } from "@/lib/interests";
import { useProfile } from "@/lib/profile";
import { usePalette, useTheme } from "@/lib/theming";

export default function Settings() {
  const { profile, save, reset } = useProfile();
  const [name, setName] = useState(profile?.name ?? "");
  const Palette = usePalette();
  const { redTheme, toggle } = useTheme();

  const interests = profile?.interests ?? [];
  const activeSite = profile?.sites.find((s) => s.id === profile.activeSite);

  const commitName = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === profile?.name) {
      setName(profile?.name ?? "");
      return;
    }
    save({ name: trimmed });
  };

  const confirmReset = () =>
    Alert.alert(
      "Reset everything?",
      "Your name, interests, kit and saved sites are deleted, and you start signup again. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: reset },
      ],
    );

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: BottomTabInset + 24,
          gap: 28,
        }}
      >
        <Text className="font-sansation pt-2 text-4xl text-fg tracking-[1px]">Settings</Text>

        <Section title="Name" hint="What the app calls you.">
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={commitName}
            onSubmitEditing={commitName}
            placeholder="Your name"
            placeholderTextColor={Palette.placeholder}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            textAlignVertical="center"
            className="font-sansation h-14 rounded-full border border-line px-5 text-lg leading-tight text-fg"
          />
        </Section>

        <Section title="Interests" hint="Tonight's suggestions lean towards what you pick here.">
          <View className="flex-row flex-wrap justify-center gap-2">
            {INTERESTS.map(({ label, icon }) => (
              <Box
                key={label}
                title={label}
                selected={interests.includes(label)}
                onPress={() => save({ interests: toggleInterest(interests, label) })}
              >
                <Icon name={icon} size={32} />
              </Box>
            ))}
          </View>
        </Section>

        <Section title="Your kit" hint="What you observe with, and what it frames.">
          <EquipmentEditor
            value={profile?.equipment ?? []}
            onChange={(equipment) => save({ equipment })}
            emptyText="Nothing added yet // add a scope or camera."
          />
        </Section>

        <Section title="Observing site" hint="Everything is calculated from here.">
          <Link href="/sites" asChild>
            <Pressable className="h-14 flex-row items-center gap-3 rounded-full border border-line px-5 active:bg-surface">
              <Icon name="mapPin" size={20} color={Palette.iconMuted} />
              <Text numberOfLines={1} className="font-sansation flex-1 text-lg text-fg">
                {activeSite?.name ?? "Current location"}
              </Text>
              <Icon name="chevronRight" size={20} color={Palette.iconSubtle} />
            </Pressable>
          </Link>
        </Section>

        <Section title="Red screen" hint="Preserves night vision outdoors.">
          <View className="h-14 flex-row items-center justify-between rounded-full border border-line px-5">
            <Text className="font-sansation text-lg text-fg">Red screen mode</Text>
            <View className="justify-center">
              <Switch value={redTheme} onValueChange={toggle} />
            </View>
          </View>
        </Section>

        <View className="items-center gap-3 pt-2">
          <Pressable
            onPress={confirmReset}
            className="h-14 w-[90%] flex-row items-center justify-center gap-2 rounded-full border-2 border-danger-border active:bg-danger-bg"
          >
            <Icon name="trash" size={18} color={Palette.destructive} />
            <Text className="font-sansation text-lg leading-tight text-danger tracking-[1px]">Reset profile</Text>
          </Pressable>
          <Text className="font-sansation text-sm text-fg-faint tracking-[1px]">
            Polaris {Constants.expoConfig?.version ?? "-.-.-"}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <View className="gap-3">
      <View>
        <Text className="font-sansation text-2xl text-fg tracking-[1px]">{title}</Text>
        <Text className="font-sansation text-base text-fg-dim tracking-[1px]">{hint}</Text>
      </View>
      {children}
    </View>
  );
}
