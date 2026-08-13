import { Text, View } from "react-native";

import { Icon, type IconName } from "@/components/icon";
import type { Site } from "@/lib/sites";
import { sunAltitude, type Weather } from "@/lib/sky";
import { usePalette } from "@/lib/theming";

function sunPhase(altitude: number): { icon: IconName; label: string } {
    if (altitude > 0) return { icon: "sun", label: "Daytime" };
    if (altitude > -6) return { icon: "sunrise", label: "Twilight" };
    return { icon: "moon", label: "Night" };
}

const cloudLabel = (pct: number) =>
    pct < 12 ? "Clear skies" : pct < 40 ? "Partly cloudy" : pct < 75 ? "Mostly cloudy" : "Overcast";

function seeingQuality(w: Weather): { icon: IconName; label: string } {
    const score = 1 - (w.cloudCover / 100) * 0.8 - (w.humidity / 100) * 0.2;
    if (score > 0.66) return { icon: "smile", label: "Great seeing" };
    if (score > 0.4) return { icon: "meh", label: "Fair seeing" };
    return { icon: "frown", label: "Poor seeing" };
}

function Stat({ icon, label }: { icon: IconName; label: string }) {
    const Palette = usePalette();
    return (
        <View className="flex-row items-center gap-1.5">
            <Icon name={icon} size={18} color={Palette.iconMuted} />
            <Text className="font-sansation text-base text-fg-muted tracking-[1px]">{label}</Text>
        </View>
    );
}

export function WeatherOverviewBox({ site, now, weather }: { site: Site; now: Date; weather: Weather | null }) {
    const phase = sunPhase(sunAltitude(site, now));
    const tempF = weather ? Math.round((weather.temperatureC * 9) / 5 + 32) : null;
    const seeing = weather ? seeingQuality(weather) : null;

    return (
        <View className="gap-3 rounded-2xl bg-surface p-4">
            <View className="flex-row items-start justify-between">
                {weather ? (
                    <View className="flex-1">
                        <View className="flex-row items-center">
                            <Text className="font-sansation text-3xl text-fg tracking-[1px]">{tempF}°F</Text>
                            <Text className="shrink font-sansation text-lg text-fg-muted tracking-[1px]" numberOfLines={1}>
                                {` · ${site.name}`}
                            </Text>
                        </View>

                        <Text className="font-sansation text-base text-fg-muted tracking-[1px]">
                            {Math.round(weather.temperatureC)}°C
                        </Text>
                    </View>
                ) : (
                    <Text className="font-sansation text-base text-fg-muted tracking-[1px]">No weather data</Text>
                )}
                <Icon name={phase.icon} size={40} />
            </View>

            <Text className="font-sansation text-xl text-fg tracking-[1px]">
                {phase.label}
                {weather ? ` · ${cloudLabel(weather.cloudCover)}` : ""}
            </Text>

            {weather && seeing && (
                <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1">
                    <Stat icon="cloud" label={`${weather.cloudCover.toFixed(0)}% cloud`} />
                    <Stat icon="droplet" label={`${weather.humidity.toFixed(0)}% humidity`} />
                    <Stat icon={seeing.icon} label={seeing.label} />
                </View>
            )}
        </View>
    );
}
