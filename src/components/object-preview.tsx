import type { Body } from "@/lib/sky";
import { type Target, previewUrl } from "@/lib/targets";
import { usePalette } from "@/lib/theming";

import { useState } from "react";
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from "react-native";

import { Image, type ImageStyle } from "expo-image";

/**
 * Fixed targets get a live DSS2 cutout from CDS, framed on their own coordinates (see previewUrl).
 * Solar-system bodies cannot, so the field where Jupiter sits tonight holds nothing but background stars. 
 * TODO: Those need a portrait of their own.
 * 
 * NASA/JPL imagery is public domain: https://science.nasa.gov/solar-system/.
 * Bodies with no entry fall through to the splash, so a half-filled map still renders.
 */
const BODY_IMAGES: Partial<Record<Body, number>> = {};

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
