import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "@/components/icon";
import { BottomTabInset } from "@/constants/theme";
import { useProfile } from "@/lib/profile";
import { siteLine, type Site } from "@/lib/sites";
import { usePalette } from "@/lib/theming";

export default function Sites() {
    const { profile, save } = useProfile();
    const sites = profile?.sites ?? [];
    const activeSite = profile?.activeSite ?? null;

    return (
        <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: BottomTabInset + 24,
                    gap: 16,
                }}
            >
                <Text className="font-sansation pt-2 text-4xl text-fg tracking-[1px]">Sites</Text>
                <Text className="font-sansation text-base text-fg-muted tracking-[1px]">
                    Everything the app calculates, from sunrise to relative planetary orbit, is computed from the site
                    you pick here.
                </Text>

                <View className="gap-3 rounded-2xl border border-fg/10 bg-surface p-4">
                    <Row
                        name="Current location"
                        detail="Wherever your phone is"
                        active={activeSite === null}
                        onPress={() => save({ activeSite: null })}
                    />
                    {sites.map((site) => (
                        <Row
                            key={site.id}
                            name={site.name}
                            detail={siteLine(site)}
                            active={site.id === activeSite}
                            onPress={() => save({ activeSite: site.id })}
                            edit={site}
                        />
                    ))}
                </View>

                {sites.length === 0 && (
                    <Text className="font-sansation text-center text-base text-fg-dim tracking-[1px]">
                        No saved sites yet // add the field you drive out to.
                    </Text>
                )}

                <Link href="/sites/info" asChild>
                    <Pressable className="flex-row items-center justify-center gap-2 rounded-full border border-line-2 py-4 active:bg-surface">
                        <Icon name="plus" size={18} />
                        <Text className="font-sansation text-lg text-fg tracking-[1px]">Add a site</Text>
                    </Pressable>
                </Link>
            </ScrollView>
        </SafeAreaView>
    );
}

type RowProps = {
    name: string;
    detail: string;
    active: boolean;
    onPress: () => void;
    edit?: Site;
};

function Row({ name, detail, active, onPress, edit }: RowProps) {
    const Palette = usePalette();
    return (
        <View className="flex-row items-center gap-3">
            <Pressable onPress={onPress} className="flex-1 flex-row items-center gap-3 py-1">
                <Icon
                    name={active ? "check" : "mapPin"}
                    size={20}
                    color={active ? Palette.white : Palette.iconSubtle}
                />
                <View className="flex-1">
                    <Text
                        numberOfLines={1}
                        className={`font-sansation text-base tracking-[1px] ${active ? "text-fg" : "text-fg-muted"}`}
                    >
                        {name}
                    </Text>
                    <Text numberOfLines={1} className="font-sansation text-sm text-fg-dim tracking-[1px]">
                        {detail}
                    </Text>
                </View>
            </Pressable>
            {edit && (
                <Link href={{ pathname: "/sites/info", params: { id: edit.id } }} asChild>
                    <Pressable hitSlop={12}>
                        <Icon name="chevronRight" size={20} color={Palette.iconSubtle} />
                    </Pressable>
                </Link>
            )}
        </View>
    );
}
