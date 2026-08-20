import { type Coords, type Weather, altitudeFloor, evaluate, moonIllumination } from "./sky.ts";
import { TARGETS, type Target } from "./targets.ts";

export type Sample = {
    time: Date;
    altitude: number;
    score: number;
    visible: boolean;
};

/** Lazy on purpose: callers that only want the first visible sample stop paying at that sample. */
function* scanNight(
    target: Target,
    site: Coords,
    night: Date,
    weather: Weather | null,
    stepMin = 15,
): Generator<Sample> {
    const start = new Date(night);
    start.setHours(18, 0, 0, 0);

    const spanHrs = 12;

    for (let step = 0; step <= spanHrs * (60 / stepMin); step++) {
        const time = new Date(start.getTime() + step * stepMin * 60_000);
        const evaluation = evaluate(target, site, time, weather);

        if (evaluation.sun < target.maxSunAltitudeDeg)
            yield {
                time,
                altitude: evaluation.altitude,
                score: evaluation.score,
                visible: evaluation.visible,
            };
    }
}

/**
 * A fixed target peaks at `90 - |lat - dec|`, so one subtraction rules out everything this site can never see.
 * Moving bodies change declination, so they always get scanned.
 */
const canEverClear = (target: Target, site: Coords) =>
    target.body !== undefined || 90 - Math.abs(site.lat - target.dec!) >= altitudeFloor(target, site);

/** Before 6am, "tonight" is the night already in progress. */
function nightOf(now: Date): Date {
    const night = new Date(now);
    if (now.getHours() < 6) night.setDate(night.getDate() - 1);
    return night;
}

/** Tonight's arc, for the graph's day view. */
export function tonightCurve(target: Target, site: Coords, weather: Weather | null, now: Date = new Date()): Sample[] {
    return [...scanNight(target, site, nightOf(now), weather)];
}

export type NightPeak = {
    date: Date;
    altitude: number;
    moonIllum: number;
    score: number;
    dark: boolean;
    visible: boolean;
};

const peakCache = new Map<string, NightPeak[]>();

export function nightlyPeaks(target: Target, site: Coords, from: Date, nights: number): NightPeak[] {
    const key = `${target.id},${site.lat},${site.lon},${site.elevation},${site.horizonDeg},${from.toDateString()},${nights}`;
    const hit = peakCache.get(key);
    if (hit) return hit;

    const peaks: NightPeak[] = [];

    for (let i = 0; i < nights; i++) {
        const night = new Date(from);
        night.setDate(night.getDate() + i);

        const samples = [...scanNight(target, site, night, null)];
        if (samples.length === 0) {
            peaks.push({
                date: night,
                altitude: 0,
                moonIllum: moonIllumination(night),
                score: 0,
                dark: false,
                visible: false,
            });
            continue;
        }

        const best = samples.reduce((a, b) => (b.score > a.score ? b : a));
        peaks.push({
            date: best.time,
            altitude: best.altitude,
            moonIllum: moonIllumination(best.time),
            score: best.score,
            dark: true,
            visible: best.visible,
        });
    }

    peakCache.set(key, peaks);
    return peaks;
}

/**
 * The soonest moment in the window the target is actually up, or null.
 * Half-hourly is plenty to name a singular night + the graph keeps the 15-minute grid.
 */
function firstVisibleNight(target: Target, site: Coords, from: Date, nights: number): Date | null {
    for (let i = 0; i < nights; i++) {
        const night = new Date(from);
        night.setDate(night.getDate() + i);
        for (const sample of scanNight(target, site, night, null, 30)) {
            if (sample.visible) return sample.time;
        }
    }
    return null;
}

export type Upcoming = { target: Target; when: Date | null };

const byWhen = (a: Upcoming, b: Upcoming) => (a.when?.getTime() ?? 0) - (b.when?.getTime() ?? 0);

export function upTonight(site: Coords, weather: Weather | null, now: Date = new Date()): Upcoming[] {
    return Object.values(TARGETS)
        .filter((target) => canEverClear(target, site))
        .map((target) => {
            if (evaluate(target, site, now, weather).visible) return { target, when: null };
            for (const sample of scanNight(target, site, nightOf(now), weather)) {
                if (sample.time > now && sample.visible) return { target, when: sample.time };
            }
            return null;
        })
        .filter((entry) => entry !== null)
        .sort(byWhen);
}

let aheadCache: { key: string; rows: Upcoming[] } | null = null; // Fortnite fr

export function upAhead(site: Coords, from: Date, nights: number): Upcoming[] {
    // Keep out of cache
    const key = `${site.lat},${site.lon},${site.elevation},${site.horizonDeg},${from.toDateString()},${nights}`;

    if (aheadCache?.key !== key) {
        const rows = Object.values(TARGETS)
            .filter((target) => canEverClear(target, site))
            .map((target) => {
                const when = firstVisibleNight(target, site, from, nights);
                return when ? { target, when } : null;
            })
            .filter((entry) => entry !== null)
            .sort(byWhen);

        aheadCache = { key, rows };
    }
    return aheadCache.rows;
}
