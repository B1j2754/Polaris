import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import * as Location from "expo-location";
import { DeviceMotion } from "expo-sensors";

import { smoothAngle } from "@/lib/pointing";

const UPDATE_INTERVAL_MS = 100;
const SMOOTHING = 0.25;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const WORST_USABLE_DEGREES = 25;

export type PhoneOrientation = {
    heading: number | null;
    altitude: number | null;
    trueNorth: boolean;
    calibrated: boolean;
    available: boolean;
};

const isCalibrated = (accuracy: number | undefined) => {
    if (accuracy == null) return true;
    return Platform.OS === "android" ? accuracy >= 2 : accuracy >= 0 && accuracy <= WORST_USABLE_DEGREES;
};

export function usePhoneOrientation(): PhoneOrientation {
    const [heading, setHeading] = useState<number | null>(null);
    const [altitude, setAltitude] = useState<number | null>(null);
    const [trueNorth, setTrueNorth] = useState(true);
    const [calibrated, setCalibrated] = useState(true);
    const [available, setAvailable] = useState(true);

    const smoothedHeading = useRef<number | null>(null);
    const smoothedAltitude = useRef<number | null>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription | undefined;
        let cancelled = false;

        (async () => {
            const { granted } = await Location.requestForegroundPermissionsAsync();
            if (!granted || cancelled) return;

            subscription = await Location.watchHeadingAsync(({ trueHeading, magHeading, accuracy }) => {
                const hasTrueNorth = trueHeading >= 0;
                const next = hasTrueNorth ? trueHeading : magHeading;

                smoothedHeading.current =
                    smoothedHeading.current == null ? next : smoothAngle(smoothedHeading.current, next, SMOOTHING);

                setHeading(((smoothedHeading.current % 360) + 360) % 360);
                setTrueNorth(hasTrueNorth);
                setCalibrated(isCalibrated(accuracy));
            });

            if (cancelled) subscription.remove();
        })();

        return () => {
            cancelled = true;
            subscription?.remove();
        };
    }, []);

    useEffect(() => {
        let subscription: ReturnType<typeof DeviceMotion.addListener> | undefined;
        let cancelled = false;

        (async () => {
            const sensorPresent = await DeviceMotion.isAvailableAsync();
            if (cancelled) return;
            setAvailable(sensorPresent);
            if (!sensorPresent) return;

            DeviceMotion.setUpdateInterval(UPDATE_INTERVAL_MS);
            subscription = DeviceMotion.addListener(({ rotation }) => {
                if (!rotation) return;

                const pitch = Math.max(-90, Math.min(90, rotation.beta * DEGREES_PER_RADIAN));
                smoothedAltitude.current =
                    smoothedAltitude.current == null ? pitch : smoothAngle(smoothedAltitude.current, pitch, SMOOTHING);

                setAltitude(smoothedAltitude.current);
            });

            if (cancelled) subscription.remove();
        })();

        return () => {
            cancelled = true;
            subscription?.remove();
        };
    }, []);

    return { heading, altitude, trueNorth, calibrated, available };
}
