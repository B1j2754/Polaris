import { useState } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { Image, type ImageStyle } from "expo-image";

import type { Body } from "@/lib/sky";
import { previewUrl, type Target } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

/**
 * Fixed targets get a live DSS2 cutout from CDS, framed on their own coordinates (see previewUrl).
 * Solar-system bodies cannot, so the field where Jupiter sits tonight holds nothing but background stars.
 * They get a bundled portrait instead, letterboxed to the same 600px square the survey cutouts come in at.
 *
 * NASA/JPL/ESA imagery is public domain: https://science.nasa.gov/solar-system/.
 * Bodies with no entry fall through to the splash, so a half-filled map still renders.
 */
const BODY_IMAGES: Partial<Record<Body, number>> = {
    Sun: require("@/assets/images/bodies/sun.jpg"),
    Moon: require("@/assets/images/bodies/moon.jpg"),
    Mercury: require("@/assets/images/bodies/mercury.jpg"),
    Venus: require("@/assets/images/bodies/venus.jpg"),
    Mars: require("@/assets/images/bodies/mars.jpg"),
    Jupiter: require("@/assets/images/bodies/jupiter.jpg"),
    Saturn: require("@/assets/images/bodies/saturn.jpg"),
    Uranus: require("@/assets/images/bodies/uranus.jpg"),
    Neptune: require("@/assets/images/bodies/neptune.jpg"),
};

const SPLASH = require("@/assets/images/star-splash.png");

/** The image for a target: a bundled portrait for bodies, a survey cutout for everything else. */
const previewSource = (target: Target) =>
    target.body ? (BODY_IMAGES[target.body] ?? SPLASH) : { uri: previewUrl(target) };

export function ObjectPreview({ target, style }: { target: Target; style?: StyleProp<ViewStyle> }) {
    const Palette = usePalette();
    const [loading, setLoading] = useState(true);

    return (
        <View style={[styles.frame, { backgroundColor: Palette.card }, style]}>
            <Image
                source={previewSource(target)}
                style={StyleSheet.absoluteFill as ImageStyle}
                contentFit="cover"
                transition={300}
                cachePolicy="memory-disk"
                onLoadEnd={() => setLoading(false)}
            />
            {loading && (
                <View style={styles.loading}>
                    <Text className="font-sansation text-base text-fg-dim tracking-[1px]">Loading...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    frame: {
        borderRadius: 8,
        overflow: "hidden", // without this the image squares off the corners it is clipped to
    },
    loading: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
});
