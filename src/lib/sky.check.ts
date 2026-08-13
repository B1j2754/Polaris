/**
 * Authored by Cluade
 * 
 * Self-check for the sky wiring. No test framework on purpose — Node strips the types itself:
 *
 *   node src/sky.check.ts
 *
 * astronomy-engine is trusted to be correct (it has its own test suite against JPL).
 * What is checked here is *our* use of it — units, epochs, body names — and the scoring
 * rules that are ours. Relative imports so bare Node can resolve them; every `@/` import
 * inside sky.ts and targets.ts is type-only and disappears when the types are stripped.
 */
import assert from 'node:assert/strict';

import { bodyPosition, compassPoint, equatorialToHorizontal, evaluate, moonIllumination, sunAltitude } from './sky.ts';
import { TARGETS } from './targets.ts';

const utc = (iso: string) => new Date(iso);
const target = (id: string) => TARGETS[id];
const near = (actual: number, expected: number, tolerance: number, what: string) =>
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${what}: got ${actual.toFixed(3)}, expected ${expected} ±${tolerance}`
  );

// --- units: the catalog stores RA in degrees, astronomy-engine wants sidereal hours.
//     Polaris sitting at your latitude is the check that catches getting that backwards. ---
for (const lat of [40.7, 19.4, 61.2]) {
  for (const iso of ['2026-01-15T03:00:00Z', '2026-07-22T21:30:00Z']) {
    const { altitude } = equatorialToHorizontal(
      { ra: target('polaris').ra!, dec: target('polaris').dec! },
      { lat, lon: -74 },
      utc(iso)
    );
    near(altitude, lat, 1.5, `Polaris altitude at lat ${lat}, ${iso}`);
  }
}

// --- a southern star peaks due south from the northern hemisphere ---
{
  const where = { lat: 40, lon: -74 };
  const sirius = { ra: target('sirius').ra!, dec: target('sirius').dec! };
  let best = { altitude: -90, azimuth: 0 };
  for (let minute = 0; minute < 1440; minute++) {
    const at = equatorialToHorizontal(sirius, where, new Date(Date.UTC(2026, 0, 15) + minute * 60000));
    if (at.altitude > best.altitude) best = at;
  }
  near(best.azimuth, 180, 1, 'Sirius azimuth at transit');
  // altitude at transit = 90 - |lat - dec|, plus a little atmospheric refraction
  near(best.altitude, 90 - Math.abs(40 - sirius.dec), 0.5, 'Sirius altitude at transit');
  assert.equal(compassPoint(best.azimuth), 'S', 'transit should read as south');
}

// --- body names map onto astronomy-engine's enum: solstices pin the Sun ---
near(bodyPosition('Sun', utc('2026-06-21T09:00:00Z')).dec, 23.44, 0.15, 'Sun declination at June solstice');
near(bodyPosition('Sun', utc('2025-12-21T15:00:00Z')).dec, -23.44, 0.15, 'Sun declination at December solstice');
near(sunAltitude({ lat: 0, lon: 0 }, utc('2026-03-20T12:05:00Z')), 90, 1.5, 'Sun altitude, equinox noon, equator');

// --- the Moon: known new and full moons ---
assert.ok(moonIllumination(utc('2000-01-06T18:14:00Z')) < 0.01, 'new moon should read dark');
assert.ok(moonIllumination(utc('2000-01-21T04:40:00Z')) > 0.99, 'full moon should read lit');

// --- every planet in the catalog resolves to a real position ---
for (const t of Object.values(TARGETS).filter((t) => t.body)) {
  const { ra, dec } = bodyPosition(t.body!, utc('2026-07-22T00:00:00Z'));
  assert.ok(Number.isFinite(ra) && ra >= 0 && ra < 360, `${t.id} produced a bad ra: ${ra}`);
  assert.ok(Number.isFinite(dec) && Math.abs(dec) <= 90, `${t.id} produced a bad dec: ${dec}`);
}

// --- the scoring rules, which are ours ---
{
  const where = { lat: 40.7, lon: -74 };
  const noon = utc('2026-11-15T17:00:00Z'); // ~midday in New York

  const daylight = evaluate(target('m31'), where, noon);
  assert.equal(daylight.visible, false, 'M31 must not be visible at noon');
  assert.ok(daylight.reasons.includes('Daylight'), `expected a daylight reason, got ${daylight.reasons}`);

  const night = evaluate(target('m31'), where, utc('2026-11-16T02:00:00Z'), { cloudCover: 5, humidity: 40, temperatureC: 8 });
  assert.equal(night.visible, true, `M31 should be up on a clear November night: ${night.reasons}`);
  assert.ok(night.score > daylight.score, 'a visible target must outrank a blocked one');

  const clouded = evaluate(target('m31'), where, utc('2026-11-16T02:00:00Z'), { cloudCover: 90, humidity: 90, temperatureC: 8 });
  assert.equal(clouded.visible, false, 'M31 must fail under 90% cloud');
  assert.ok(clouded.reasons.some((r) => r.includes('cloud')), 'cloud should be the stated reason');

  // a target below the horizon reports so rather than scoring on altitude alone
  const under = evaluate(target('m7'), { lat: 75, lon: 0 }, utc('2026-07-22T00:00:00Z'));
  assert.equal(under.visible, false, 'M7 is not visible from 75°N');
}

// --- a site's blocked horizon raises the bar, and says so ---
{
  const when = utc('2026-11-16T02:00:00Z');
  const m31 = target('m31');
  const open = { lat: 40.7, lon: -74 };
  const clear = evaluate(m31, open, when, { cloudCover: 5, humidity: 40, temperatureC: 8 });
  assert.equal(clear.visible, true, `M31 should clear an open horizon: ${clear.reasons}`);

  // same spot, same moment, but trees up to just above where it sits
  const blocked = { ...open, horizonDeg: Math.ceil(clear.altitude) + 5 };
  const hemmed = evaluate(m31, blocked, when, { cloudCover: 5, humidity: 40, temperatureC: 8 });
  assert.equal(hemmed.visible, false, 'trees taller than the target must block it');
  assert.ok(
    hemmed.reasons.some((r) => r.includes(`${blocked.horizonDeg}°`)),
    `the reason should quote the site's horizon, got ${hemmed.reasons}`
  );
  assert.ok(hemmed.score < clear.score, 'a blocked view must score below an open one');

  // a horizon below the target's own minimum changes nothing
  const trivial = evaluate(m31, { ...open, horizonDeg: 1 }, when, { cloudCover: 5, humidity: 40, temperatureC: 8 });
  assert.equal(trivial.score, clear.score, 'a horizon under the target minimum must not move the score');
}

// --- every catalog entry is well formed ---
for (const [key, t] of Object.entries(TARGETS)) {
  assert.equal(t.id, key, `${key} keyed under a mismatched id (${t.id})`);
  assert.ok(t.body || (t.ra !== undefined && t.dec !== undefined), `${t.id} has neither body nor ra/dec`);
  assert.ok(t.ra === undefined || (t.ra >= 0 && t.ra < 360), `${t.id} has an out-of-range ra`);
  assert.ok(t.dec === undefined || Math.abs(t.dec) <= 90, `${t.id} has an out-of-range dec`);
}

console.log(`ok — sky wiring and ${Object.keys(TARGETS).length} targets check out`);
