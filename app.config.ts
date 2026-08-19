import type { ExpoConfig } from "expo/config";

const isDev = process.env.APP_VARIANT === "development";

export default (): ExpoConfig => ({
    name: isDev ? "DEV-Polaris" : "Polaris",
    slug: "polaris",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "polaris",
    userInterfaceStyle: "dark",
    backgroundColor: "#000000",
    platforms: ["ios", "android"],
    ios: {
        supportsTablet: false,
        bundleIdentifier: isDev ? "com.b1j.polaris.dev" : "com.b1j.polaris",
    },
    android: {
        adaptiveIcon: {
            backgroundColor: "#000000",
            foregroundImage: "./assets/images/android-icon-foreground.png",
        },
        predictiveBackGestureEnabled: false,
        permissions: [
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.ACCESS_FINE_LOCATION",
        ],
        package: isDev ? "com.b1j.polaris.dev" : "com.b1j.polaris",
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                backgroundColor: "#000000",
                image: "./assets/images/splash-icon.png",
                imageWidth: 76,
            },
        ],
        [
            "expo-font",
            {
                fonts: ["./assets/fonts/Sansation-Regular.ttf"],
            },
        ],
        "expo-web-browser",
        "expo-sqlite",
        [
            "expo-location",
            {
                locationWhenInUsePermission:
                    "Polaris uses your location to work out which stars, planets and galaxies are above you right now.",
            },
        ],
        [
            "expo-image-picker",
            {
                photosPermission:
                    "Polaris adds photos you pick to your portfolio, pinned to the object and site you shot them from.",
                cameraPermission:
                    "Polaris uses the camera so you can shoot straight into your portfolio.",
            },
        ],
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true,
    },
    extra: {
        router: {},
        eas: {
            projectId: "3768ceb3-8a45-4d8b-b5ae-4735b84106f4",
        },
    },
    runtimeVersion: {
        policy: "appVersion",
    },
    updates: {
        url: "https://u.expo.dev/3768ceb3-8a45-4d8b-b5ae-4735b84106f4",
    },
});
