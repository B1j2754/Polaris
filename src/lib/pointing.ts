import type { Horizontal } from "@/lib/sky";

const DEG = Math.PI / 180;

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

export const normalizeDelta = (degrees: number) => ((((degrees + 180) % 360) + 360) % 360) - 180;

export const separation = (a: Horizontal, b: Horizontal) =>
    Math.acos(
        clamp(
            Math.sin(a.altitude * DEG) * Math.sin(b.altitude * DEG) +
                Math.cos(a.altitude * DEG) * Math.cos(b.altitude * DEG) * Math.cos((a.azimuth - b.azimuth) * DEG),
            -1,
            1,
        ),
    ) / DEG;

export type Aim = {
    azimuthError: number;
    altitudeError: number;
    separation: number;
    rotation: number;
    locked: boolean;
};

export const LOCK_DEGREES = 5;

export function aimAt(target: Horizontal, phone: Horizontal): Aim {
    const azimuthError = normalizeDelta(target.azimuth - phone.azimuth);
    const altitudeError = target.altitude - phone.altitude;
    const gap = separation(target, phone);

    return {
        azimuthError,
        altitudeError,
        separation: gap,
        rotation: Math.atan2(azimuthError, altitudeError) / DEG,
        locked: gap <= LOCK_DEGREES,
    };
}

export function guidance({ azimuthError, altitudeError, locked }: Aim): string {
    if (locked) return "Look here";

    const [amount, verbs] =
        Math.abs(azimuthError) >= Math.abs(altitudeError)
            ? [azimuthError, ["Pan left", "Pan right"]]
            : [altitudeError, ["Tilt down", "Tilt up"]];

    return `${amount > 0 ? verbs[1] : verbs[0]} ${Math.round(Math.abs(amount))}°`;
}

export const smoothAngle = (previous: number, next: number, factor: number) =>
    previous + normalizeDelta(next - previous) * factor;
