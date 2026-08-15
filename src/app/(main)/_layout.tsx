import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenBackground, TabPillHeight } from "@/constants/theme";
import { usePalette } from "@/lib/theming";

const glass = isLiquidGlassAvailable();

const icon = function (
    outline: SFSymbol, 
    filled = `${outline}.fill` as SFSymbol
) {
    return ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
        <SymbolView 
            name={focused ? filled : outline} 
            size={size} 
            tintColor={color} 
            resizeMode="scaleAspectFit" 
        />
    );
}

const styles = StyleSheet.create({
    pillClip: { borderRadius: TabPillHeight / 2, overflow: "hidden" },
});

export default function MainLayout() {
    const insets = useSafeAreaInsets();
    const Palette = usePalette();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                freezeOnBlur: true,
                sceneStyle: { backgroundColor: ScreenBackground },
                tabBarActiveTintColor: Palette.white,
                tabBarInactiveTintColor: Palette.tabInactive,
                tabBarLabelStyle: { fontSize: 11 },
                tabBarItemStyle: { paddingVertical: 8 },
                tabBarBackground: glass
                    ? () => (
                          <GlassView
                              glassEffectStyle="regular"
                              colorScheme="dark"
                              style={[StyleSheet.absoluteFill, styles.pillClip]}
                          />
                      )
                    : undefined,
                tabBarStyle: {
                    position: "absolute",
                    marginHorizontal: 20,
                    bottom: Math.max(insets.bottom, 16),
                    height: TabPillHeight,
                    borderRadius: TabPillHeight / 2,
                    borderTopWidth: 0,
                    paddingBottom: 0,
                    ...(glass
                        ? { backgroundColor: "transparent" }
                        : {
                              backgroundColor: Palette.sheet,
                              elevation: 8,
                              shadowColor: Palette.black,
                              shadowOpacity: 0.4,
                              shadowRadius: 12,
                              shadowOffset: { width: 0, height: 4 },
                          }),
                },
            }}
        >
            <Tabs.Screen name="home" options={{ title: "Home", tabBarIcon: icon("house") }} />
            <Tabs.Screen name="portfolio" options={{ title: "Portfolio", tabBarIcon: icon("photo.stack") }} />
            <Tabs.Screen
                name="sites"
                options={{
                    title: "Sites",
                    tabBarIcon: icon("mappin.and.ellipse", "mappin.circle.fill"),
                }}
            />
            <Tabs.Screen name="settings" options={{ title: "Settings", tabBarIcon: icon("gearshape") }} />
        </Tabs>
    );
}
