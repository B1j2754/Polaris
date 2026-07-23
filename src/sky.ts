import * as Astronomy from 'astronomy-engine';

import type { Target } from '@/targets';

/**
 * All positional astronomy (planet/Moon ephemerides, precession, the horizontal transform, phase) comes from 
 * astronomy-engine by Don Cross (MIT licence): https://github.com/cosinekitty/astronomy
 * See node_modules/astronomy-engine/LICENSE.
 */

export type Coords = { lat: number; lon: number };
/** Right ascension / declination in the units this app stores them: both degrees, J2000. */
export type Equatorial = { ra: number; dec: number };
export type Horizontal = { altitude: number; azimuth: number };

/** The bodies we track. Names line up with astronomy-engine's `Body` enum keys. */
export type Body =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune';

const observer = ({ lat, lon }: Coords) => new Astronomy.Observer(lat, lon, 0);

const HOURS_PER_DEGREE = 1 / 15; // astronomy-engine -> sidereal hours; catalog -> deg

export function equatorialToHorizontal(
  { ra, dec }: Equatorial,
  where: Coords,
  date: Date
): Horizontal {
  const { altitude, azimuth } = Astronomy.Horizon(
    date,
    observer(where),
    ra * HOURS_PER_DEGREE,
    dec,
    'normal'
  );
  return { altitude, azimuth };
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const compassPoint = (azimuth: number) =>
  COMPASS[Math.round((((azimuth % 360) + 360) % 360) / 45) % 8];

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

/** 0 -> new, 1 -> full */
export const moonIllumination = (date: Date) =>
  Astronomy.Illumination(Astronomy.Body.Moon, date).phase_fraction;

export const sunAltitude = (where: Coords, date: Date) =>
  equatorialToHorizontal(bodyPosition('Sun', date), where, date).altitude;

// --- Weather ---

export type Weather = { cloudCover: number; humidity: number; temperatureC: number };

/** Free Open-Mateo query for weather rating. */
export async function fetchWeather({ lat, lon }: Coords): Promise<Weather | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
        `&current=cloud_cover,relative_humidity_2m,temperature_2m`
    );
    if (!response.ok) { console.warn("[weather] HTTP", response.status); return null; }
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
  reasons: string[];
};

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
  weather?: Weather | null
): Verdict {
  const { altitude, azimuth } = equatorialToHorizontal(targetPosition(target, date), where, date);
  const sun = sunAltitude(where, date);
  const moon = moonIllumination(date);
  const reasons: string[] = [];

  if (altitude < target.minAltitudeDeg) {
    reasons.push(
      altitude < 0
        ? 'Below the horizon'
        : `Only ${altitude.toFixed(0)}° up // too low, needs ${target.minAltitudeDeg}°`
    );
  }
  if (sun > target.maxSunAltitudeDeg) {
    reasons.push(sun > 0 ? 'Daylight' : 'Sky is still too bright');
  }
  if (weather && weather.cloudCover > target.maxCloudPct) {
    reasons.push(`${weather.cloudCover.toFixed(0)}% cloud cover`);
  }
  if (moon > target.maxMoonIllum) {
    reasons.push(`Moon is ${(moon * 100).toFixed(0)}% lit // washes it out`);
  }

  const headroom = Math.min(1, (altitude - target.minAltitudeDeg) / (90 - target.minAltitudeDeg));
  const moonRoom = target.maxMoonIllum >= 1 ? 1 : 1 - moon * (1 - target.maxMoonIllum);
  const air = weather ? 1 - (weather.cloudCover / 100) * 0.8 - (weather.humidity / 100) * 0.2 : 0.8;
  const quality = Math.max(0, Math.min(1, headroom)) * moonRoom * Math.max(0, air);

  return {
    altitude,
    azimuth,
    visible: reasons.length === 0,
    // failing targets keep their relative order but never outrank a visible one
    score: reasons.length === 0 ? 0.5 + quality / 2 : (quality / 2) * 0.5,
    reasons,
  };
}
