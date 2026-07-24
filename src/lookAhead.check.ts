/**
 * Self-check for the look-ahead sampler. Same deal as sky.check.ts — no framework:
 *
 *   node src/lookAhead.check.ts
 *
 * sky.ts is trusted here (it has its own check). What this pins down is the *sampling*:
 * the date arithmetic, chronological order, and the never-dark path that would otherwise
 * throw inside reduce().
 */
import assert from 'node:assert/strict';

import { nightlyPeaks, tonightCurve } from './lookAhead.ts';
import { TARGETS } from './targets.ts';

const NEW_YORK = { lat: 40.7, lon: -74 };
const TROMSO = { lat: 69.6, lon: 18.9 }; // above the arctic circle: no astronomical darkness in June
const m31 = TARGETS['m31'];

// --- tonight's curve is ordered and covers the dark hours ---
{
  const curve = tonightCurve(m31, NEW_YORK, null, new Date('2026-11-15T20:00:00'));
  assert.ok(curve.length > 0, 'M31 should have dark samples on a November night in New York');
  for (let i = 1; i < curve.length; i++) {
    assert.ok(curve[i].time > curve[i - 1].time, 'samples must stay in chronological order');
  }
  assert.ok(
    curve.some((s) => s.visible),
    'M31 should clear its minimum altitude at some point on a clear November night'
  );
}

// --- after midnight, "tonight" is the night already in progress, not the one coming ---
{
  const lateNight = new Date('2026-11-16T01:00:00');
  const curve = tonightCurve(m31, NEW_YORK, null, lateNight);
  assert.ok(
    curve.some((s) => s.time <= lateNight),
    'at 1am the curve must include the hours already elapsed, not start tomorrow evening'
  );
}

// --- the night loop walks forward one day at a time, across a month boundary ---
{
  const peaks = nightlyPeaks(m31, NEW_YORK, new Date('2026-10-28T20:00:00'), 21);
  assert.equal(peaks.length, 21, 'one peak per requested night');
  for (let i = 1; i < peaks.length; i++) {
    assert.ok(peaks[i].date > peaks[i - 1].date, `night ${i} did not advance past night ${i - 1}`);
  }
  assert.ok(
    peaks.every((p) => p.moonIllum >= 0 && p.moonIllum <= 1),
    'moon illumination must stay a fraction'
  );
  // the moon cycles in ~29.5 days, so three weeks has to show a meaningful swing
  const illum = peaks.map((p) => p.moonIllum);
  assert.ok(Math.max(...illum) - Math.min(...illum) > 0.5, 'three weeks should span most of a moon cycle');
}

// --- the caller's `from` is never mutated by the loop ---
{
  const from = new Date('2026-10-28T20:00:00');
  const before = from.getTime();
  nightlyPeaks(m31, NEW_YORK, from, 5);
  assert.equal(from.getTime(), before, 'nightlyPeaks must not mutate the date it was handed');
}

// --- never-dark nights report themselves instead of throwing in reduce() ---
{
  const peaks = nightlyPeaks(m31, TROMSO, new Date('2026-06-15T20:00:00'), 7);
  assert.equal(peaks.length, 7, 'a sunlit night still owns a slot');
  assert.ok(
    peaks.some((p) => !p.dark),
    'Tromsø in June has nights with no astronomical darkness'
  );
  assert.ok(
    peaks.filter((p) => !p.dark).every((p) => p.score === 0),
    'a night with no darkness cannot score'
  );
}

console.log('ok — look-ahead sampling checks out');
