import type { IconName } from "@/components/icon";

export const INTERESTS: { label: string; icon: IconName }[] = [
    { label: "Comets", icon: "comet" },
    { label: "Planets", icon: "planet" },
    { label: "Galaxies", icon: "orbit" },
    { label: "Moon", icon: "moon" },
    { label: "Sun", icon: "sun" },
    { label: "Stars", icon: "astroid" },
    { label: "Satellites", icon: "satellite" },
    { label: "Nebulae", icon: "nebula" },
];

export const toggleInterest = (interests: string[], label: string) =>
    interests.includes(label) ? interests.filter((l) => l !== label) : [...interests, label];
