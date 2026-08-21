import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Constants from "expo-constants";
import { openBrowserAsync } from "expo-web-browser";

function Credit({
    name,
    detail,
    href,
    license,
    licenseHref,
}: {
    name: string;
    detail: string;
    href: string;
    license?: string;
    licenseHref?: string;
}) {
    return (
        <View className="gap-1 rounded-3xl border border-line px-5 py-4">
            <Pressable onPress={() => openBrowserAsync(href)} hitSlop={6}>
                <Text className="font-sansation text-lg text-fg underline tracking-[1px]">{name}</Text>
            </Pressable>
            <Text className="font-sansation text-sm leading-snug text-fg-dim tracking-[1px]">{detail}</Text>
            {license && licenseHref && (
                <Pressable onPress={() => openBrowserAsync(licenseHref)} hitSlop={6} className="pt-1">
                    <Text className="font-sansation text-sm text-fg-faint underline tracking-[1px]">{license}</Text>
                </Pressable>
            )}
        </View>
    );
}

export default function About() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: insets.top + 56,
                paddingBottom: 40,
                gap: 28,
            }}
        >
            <View className="gap-1">
                <Text className="font-sansation text-2xl text-fg tracking-[1px]">
                    Polaris {Constants.expoConfig?.version ?? "x.x.x"}
                </Text>
                <Text className="font-sansation text-base text-fg-dim tracking-[1px]">
                    Scores tonight against your kit and your horizon // free, no ads, open source.
                </Text>
                <Pressable onPress={() => openBrowserAsync("https://github.com/B1j2754/Polaris")} className="pt-2">
                    <Text className="font-sansation text-base text-fg underline tracking-[1px]">Source on GitHub</Text>
                </Pressable>
            </View>

            <View className="gap-2">
                <Text className="font-sansation text-2xl text-fg tracking-[1px]">Built on</Text>
                <Text className="font-sansation pb-1 text-base text-fg-dim tracking-[1px]">
                    Polaris would not work without these.
                </Text>

                <Credit
                    name="astronomy-engine"
                    detail="Positional astronomy // MIT, Don Cross."
                    href="https://github.com/cosinekitty/astronomy"
                />
                <Credit
                    name="Open-Meteo"
                    detail="Weather and place data // CC BY 4.0. Polaris processes this data into its own condition scores."
                    href="https://open-meteo.com/"
                    license="View the CC BY 4.0 licence"
                    licenseHref="https://creativecommons.org/licenses/by/4.0/"
                />
                <Credit
                    name="CDS hips2fits"
                    detail="Deep-sky preview images // Operated at CDS, Strasbourg. Rendered from the Digitized Sky Survey."
                    href="https://alasky.cds.unistra.fr/hips-image-services/hips2fits"
                />
                <Credit
                    name="Digitized Sky Survey"
                    detail="Survey plates // Produced at STScI under U.S. Government grant NAG W-2166, from the Oschin Schmidt and UK Schmidt telescopes. Non-commercial use."
                    href="https://archive.stsci.edu/dss/acknowledging.html"
                />
                <Credit name="Lucide" detail="Icon artwork // ISC." href="https://lucide.dev" />
                <Credit
                    name="Sansation"
                    detail="Typeface // SIL Open Font License 1.1, Bernd Montag."
                    href="https://openfontlicense.org"
                />
            </View>

            <Text className="text-center font-sansation pt-2 text-sm text-fg-faint tracking-[1px]">
                Apache-2.0 © 2026 Benjamin Clark, Jacob Schneider
            </Text>
        </ScrollView>
    );
}
