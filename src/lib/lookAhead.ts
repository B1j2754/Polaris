import { evaluate, moonIllumination, type Coords, type Weather } from "./sky.ts";
import { TARGETS, type Target } from "./targets.ts";

export type Sample = {
  time: Date;
  altitude: number;
  score: number;
  visible: boolean;
};

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
export function tonightCurve(target: Target, site: Coords, weather: Weather | null, now: Date = new Date()): Sample[] {
  const night = new Date(now);
  if (now.getHours() < 6) night.setDate(night.getDate() - 1);
  return scanNight(target, site, night, weather);
}

export type NightPeak = {
  date: Date;
  altitude: number;
  moonIllum: number;
  score: number;
  dark: boolean;
  visible: boolean;
};

export function nightlyPeaks(target: Target, site: Coords, from: Date, nights: number): NightPeak[] {
  const peaks: NightPeak[] = [];

  for (let i = 0; i < nights; i++) {
    const night = new Date(from);
    night.setDate(night.getDate() + i);

    const samples = scanNight(target, site, night, null);
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

  return peaks;
}

export type Upcoming = { target: Target; when: Date | null };

const byWhen = (a: Upcoming, b: Upcoming) => (a.when?.getTime() ?? 0) - (b.when?.getTime() ?? 0);

export function upTonight(site: Coords, weather: Weather | null, now: Date = new Date()): Upcoming[] {
  return Object.values(TARGETS)
    .map((target) => {
      if (evaluate(target, site, now, weather).visible) return { target, when: null };
      const rise = tonightCurve(target, site, weather, now).find((s) => s.time > now && s.visible);
      return rise ? { target, when: rise.time } : null;
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
      .map((target) => {
        const night = nightlyPeaks(target, site, from, nights).find((p) => p.visible);
        return night ? { target, when: night.date } : null;
      })
      .filter((entry) => entry !== null)
      .sort(byWhen);

    aheadCache = { key, rows };
  }
  return aheadCache.rows;
}
