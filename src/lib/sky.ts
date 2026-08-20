import type { Equipment } from "@/lib/equipment";
import type { Target } from "@/lib/targets";

import * as Astronomy from "astronomy-engine";

import { equipmentValue } from "./equipment.ts";

/**
 * All positional astronomy (planet/Moon ephemerides, precession, the horizontal transform, phase) comes from
 * astronomy-engine by Don Cross (MIT licence): https://github.com/cosinekitty/astronomy
 * See node_modules/astronomy-engine/LICENSE.
 */

export type Coords = {
    lat: number;
    lon: number;
    /** Meters above sea level. */
    elevation?: number;
    /** Degrees of sky blocked by trees/buildings/hills at this spot. */
    horizonDeg?: number;
};
/** Right ascension / declination in the units this app stores them: both degrees, J2000. */
export type Equatorial = { ra: number; dec: number };
export type Horizontal = { altitude: number; azimuth: number };

/** The bodies we track. Names line up with astronomy-engine's `Body` enum keys. */
export type Body = "Sun" | "Moon" | "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn" | "Uranus" | "Neptune";

const observer = ({ lat, lon, elevation }: Coords) => new Astronomy.Observer(lat, lon, elevation ?? 0);

const HOURS_PER_DEGREE = 1 / 15; // astronomy-engine -> sidereal hours; catalog -> deg

export function equatorialToHorizontal({ ra, dec }: Equatorial, where: Coords, date: Date): Horizontal {
    const { altitude, azimuth } = Astronomy.Horizon(date, observer(where), ra * HOURS_PER_DEGREE, dec, "normal");
    return { altitude, azimuth };
}

const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
export const compassPoint = (azimuth: number) => COMPASS[Math.round((((azimuth % 360) + 360) % 360) / 45) % 8];

/** Geocentric apparent position of a moving body, degrees. */
export function bodyPosition(body: Body, date: Date): Equatorial {
    const { ra, dec } = Astronomy.Equator(Astronomy.Body[body], date, observer({ lat: 0, lon: 0 }), true, true);
    return { ra: ra / HOURS_PER_DEGREE, dec };
}

/** Catalog coordinates are J2000; the horizontal transform wants them precessed to today. */
function precess({ ra, dec }: Equatorial, date: Date): Equatorial {
    const vector = Astronomy.VectorFromSphere(new Astronomy.Spherical(dec, ra, 1), date);
    const ofDate = Astronomy.RotateVector(Astronomy.Rotation_EQJ_EQD(date), vector);
    const equatorial = Astronomy.EquatorFromVector(ofDate);
    return { ra: equatorial.ra / HOURS_PER_DEGREE, dec: equatorial.dec };
}

export const targetPosition = (target: Target, date: Date): Equatorial =>
    target.body ? bodyPosition(target.body, date) : precess({ ra: target.ra!, dec: target.dec! }, date);

const cache = new Map<string, number>();
function cached(key: string, compute: () => number) {
    let hit = cache.get(key);
    if (hit === undefined) {
        if (cache.size > 20_000) cache.clear();
        cache.set(key, (hit = compute()));
    }
    return hit;
}

/** 0 -> new, 1 -> full */
export const moonIllumination = (date: Date) =>
    cached(`m${date.getTime()}`, () => Astronomy.Illumination(Astronomy.Body.Moon, date).phase_fraction);

export const sunAltitude = (where: Coords, date: Date) =>
    cached(
        `s${where.lat},${where.lon},${date.getTime()}`,
        () => equatorialToHorizontal(bodyPosition("Sun", date), where, date).altitude,
    );

// --- Weather ---

export type Weather = {
    cloudCover: number;
    humidity: number;
    temperatureC: number;
};

/** Free Open-Meteo query for weather rating. */
export async function fetchWeather({ lat, lon }: Coords): Promise<Weather | null> {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
                `&current=cloud_cover,relative_humidity_2m,temperature_2m`,
        );
        if (!response.ok) {
            console.warn("[weather] HTTP", response.status);
            return null;
        }
        const { current } = await response.json();
        const cloudCover = Number(current?.cloud_cover);
        const humidity = Number(current?.relative_humidity_2m);
        const temperatureC = Number(current?.temperature_2m);
        if (![cloudCover, humidity, temperatureC].every(Number.isFinite)) {
            console.warn("[weather] bad payload", current);
            return null;
        }
        return { cloudCover, humidity, temperatureC };
    } catch (e) {
        console.warn("[weather] fetch threw", e);
        return null;
    }
}

// --- Verdict ---

export type Verdict = Horizontal & {
    score: number;
    visible: boolean;
    sun: number;
    visibilityIssues: string[];
    reasons: QualityBreakdown;
};

export type QualityBreakdown = {
    altitudeScore: number;
    moonlightScore: number;
    sunlightScore: number;
    cloudScore: number;
    equipmentScore: number;
};

/** How high a target has to get before it counts as up: its own minimum, or whatever the site's horizon is blocked to, whichever is higher. */
export const altitudeFloor = (target: Target, where: Coords) => Math.max(target.minAltitudeDeg, where.horizonDeg ?? 0);

/**
 * Can this be seen from here, right now, and how good would it be?
 *
 * TODO: no light pollution, seeing, or transparency term, because nothing in the app records a site's Bortle class yet.
 * Add a `bortle` factor here once the Sites tab stores one; the shape of the function does not need to change.
 */
export function evaluate(
    target: Target,
    where: Coords,
    date: Date,
    weather?: Weather | null,
    equipment: Equipment[] = [],
): Verdict {
    const { altitude, azimuth } = equatorialToHorizontal(targetPosition(target, date), where, date);
    const sun = sunAltitude(where, date);
    const moon = moonIllumination(date);
    const visibilityIssues: string[] = [];
    const floor = altitudeFloor(target, where);
    let reasons: QualityBreakdown;

    /**
     * Altitude
     * Sunlight polution
     * Cloud covering
     * Moonlight polution
     * # Equipment visibility
     *
     * Altitude score
     * Moonlight polution score
     * Sunlight polution score
     * Cloud cover score
     * # Equipment visibility score
     */

    // Calculate visibility issues
    if (altitude < floor) {
        visibilityIssues.push(
            altitude < 0 ? "Below the horizon" : `Only ${altitude.toFixed(0)}° up // too low, needs ${floor}°`,
        );
    }
    if (sun > target.maxSunAltitudeDeg) {
        visibilityIssues.push(sun > 0 ? "Daylight" : "Sky is still too bright");
    }
    if (weather && weather.cloudCover > target.maxCloudPct) {
        visibilityIssues.push(`${weather.cloudCover.toFixed(0)}% cloud cover`);
    }
    if (moon > target.maxMoonIllum) {
        visibilityIssues.push(`Moon is ${(moon * 100).toFixed(0)}% lit // washes it out`);
    }

    const SUN_FALLOFF = 3; // TODO: Tune this

    const headroom = Math.min(1, (altitude - floor) / (90 - floor));
    const moonRoom = target.maxMoonIllum >= 1 ? 1 : 1 - moon * (1 - target.maxMoonIllum);
    const air = weather ? 1 - (weather.cloudCover / 100) * 0.8 - (weather.humidity / 100) * 0.2 : 0.8;

    const sunTolerance = Math.max(0, Math.min(1, (target.maxSunAltitudeDeg + 18) / 18));
    const skyBrightness = Math.max(0, Math.min(1, ((sun + 18) / 18) ** SUN_FALLOFF));
    const sunRoom = 1 - skyBrightness * (1 - sunTolerance);

    const gear = equipmentValue(target.magnitude, equipment);

    const quality = Math.max(0, headroom) * moonRoom * Math.max(0, air) * sunRoom * gear;

    reasons = {
        altitudeScore: Math.max(0, headroom),
        moonlightScore: moonRoom,
        sunlightScore: sunRoom,
        cloudScore: Math.max(0, air),
        equipmentScore: gear,
    };

    return {
        altitude,
        azimuth,
        visible: visibilityIssues.length === 0,
        sun,
        // failing targets keep their relative order but never outrank a visible one
        score: visibilityIssues.length === 0 ? 0.5 + quality / 2 : (quality / 2) * 0.5,
        visibilityIssues,
        reasons,
    };
}
