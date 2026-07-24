import { evaluate, moonIllumination, type Coords, type Weather } from "./sky.ts";
import type { Target } from "./targets";

export type Sample = { time: Date; altitude: number; score: number; visible: boolean };

function scanNight(target: Target, site: Coords, night: Date, weather: Weather | null): Sample[] {
    const start = new Date(night);
    start.setHours(18, 0, 0, 0);

    const stepMin = 15;
    const spanHrs = 12;

    const matches: Sample[] = [];
    for (let step = 0; step <= spanHrs * (60 / stepMin); step++) {
        const time = new Date(start.getTime() + step * stepMin * 60_000);
        const evaluation = evaluate(target, site, time, weather);

        if (evaluation.sun < target.maxSunAltitudeDeg)
            matches.push({
                time,
                altitude: evaluation.altitude,
                score: evaluation.score,
                visible: evaluation.visible,
            });
    }

    return matches;
}

/** Tonight's arc, for the graph's day view. */
export function tonightCurve(
    target: Target,
    site: Coords,
    weather: Weather | null,
    now: Date = new Date(),
): Sample[] {
    const night = new Date(now);
    if (now.getHours() < 6) night.setDate(night.getDate() - 1);
    return scanNight(target, site, night, weather);
}

export type NightPeak = { date: Date; altitude: number; moonIllum: number; score: number; dark: boolean };

export function nightlyPeaks(target: Target, site: Coords, from: Date, nights: number): NightPeak[] {
    const peaks: NightPeak[] = [];

    for (let i = 0; i < nights; i++) {
        const night = new Date(from);
        night.setDate(night.getDate() + i);

        const samples = scanNight(target, site, night, null);
        if (samples.length === 0) {
            peaks.push({ date: night, altitude: 0, moonIllum: moonIllumination(night), score: 0, dark: false });
            continue;
        }

        const best = samples.reduce((a, b) => (b.score > a.score ? b : a));
        peaks.push({
            date: best.time,
            altitude: best.altitude,
            moonIllum: moonIllumination(best.time),
            score: best.score,
            dark: true,
        });
    }

    return peaks;
}