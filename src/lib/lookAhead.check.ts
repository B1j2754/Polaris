/**
 * Self-check for the look-ahead sampler. Same deal as sky.check.ts — no framework:
 *
 *   node src/lookAhead.check.ts
 *
 * sky.ts is trusted here (it has its own check). What this pins down is the *sampling*:
 * the date arithmetic, chronological order, and the never-dark path that would otherwise
 * throw inside reduce().
 */
import assert from "node:assert/strict";

import { nightlyPeaks, tonightCurve, upAhead, upTonight } from "./lookAhead.ts";
import { evaluate } from "./sky.ts";
import { TARGETS } from "./targets.ts";

const NEW_YORK = { lat: 40.7, lon: -74 };
const TROMSO = { lat: 69.6, lon: 18.9 }; // above the arctic circle: no astronomical darkness in June
const m31 = TARGETS["m31"];

// --- tonight's curve is ordered and covers the dark hours ---
{
    const curve = tonightCurve(m31, NEW_YORK, null, new Date("2026-11-15T20:00:00"));
    assert.ok(curve.length > 0, "M31 should have dark samples on a November night in New York");
    for (let i = 1; i < curve.length; i++) {
        assert.ok(curve[i].time > curve[i - 1].time, "samples must stay in chronological order");
    }
    assert.ok(
        curve.some((s) => s.visible),
        "M31 should clear its minimum altitude at some point on a clear November night",
    );
}

// --- after midnight, "tonight" is the night already in progress, not the one coming ---
{
    const lateNight = new Date("2026-11-16T01:00:00");
    const curve = tonightCurve(m31, NEW_YORK, null, lateNight);
    assert.ok(
        curve.some((s) => s.time <= lateNight),
        "at 1am the curve must include the hours already elapsed, not start tomorrow evening",
    );
}

// --- the night loop walks forward one day at a time, across a month boundary ---
{
    const peaks = nightlyPeaks(m31, NEW_YORK, new Date("2026-10-28T20:00:00"), 21);
    assert.equal(peaks.length, 21, "one peak per requested night");
    for (let i = 1; i < peaks.length; i++) {
        assert.ok(peaks[i].date > peaks[i - 1].date, `night ${i} did not advance past night ${i - 1}`);
    }
    assert.ok(
        peaks.every((p) => p.moonIllum >= 0 && p.moonIllum <= 1),
        "moon illumination must stay a fraction",
    );
    // the moon cycles in ~29.5 days, so three weeks has to show a meaningful swing
    const illum = peaks.map((p) => p.moonIllum);
    assert.ok(Math.max(...illum) - Math.min(...illum) > 0.5, "three weeks should span most of a moon cycle");
}

// --- the caller's `from` is never mutated by the loop ---
{
    const from = new Date("2026-10-28T20:00:00");
    const before = from.getTime();
    nightlyPeaks(m31, NEW_YORK, from, 5);
    assert.equal(from.getTime(), before, "nightlyPeaks must not mutate the date it was handed");
}

// --- never-dark nights report themselves instead of throwing in reduce() ---
{
    const peaks = nightlyPeaks(m31, TROMSO, new Date("2026-06-15T20:00:00"), 7);
    assert.equal(peaks.length, 7, "a sunlit night still owns a slot");
    assert.ok(
        peaks.some((p) => !p.dark),
        "Tromsø in June has nights with no astronomical darkness",
    );
    assert.ok(
        peaks.filter((p) => !p.dark).every((p) => p.score === 0),
        "a night with no darkness cannot score",
    );
}

// --- upTonight: every row is really up, null means up right now, order is chronological ---
{
    const now = new Date("2026-11-15T22:00:00");
    const rows = upTonight(NEW_YORK, null, now);
    assert.ok(rows.length > 0, "a clear November night in New York should have something up");

    for (const { target, when } of rows) {
        if (when === null) {
            assert.ok(evaluate(target, NEW_YORK, now, null).visible, `${target.id} claims to be up now but is not`);
        } else {
            assert.ok(when > now, `${target.id} was listed for a moment that has already passed`);
            assert.ok(evaluate(target, NEW_YORK, when, null).visible, `${target.id} is not actually up at ${when}`);
        }
    }

    const times = rows.map((r) => r.when?.getTime() ?? 0);
    assert.deepEqual(
        times,
        [...times].sort((a, b) => a - b),
        "rows must run already-up first, then in time order",
    );

    // anything up right now has to be in the list — that is the whole point of the tonight tab
    const upNow = Object.values(TARGETS).filter((t) => evaluate(t, NEW_YORK, now, null).visible);
    assert.equal(
        rows.filter((r) => r.when === null).length,
        upNow.length,
        "every currently-visible target must appear",
    );
}

// --- upAhead: only reports nights it can actually justify ---
{
    const rows = upAhead(NEW_YORK, new Date("2026-11-16T00:00:00"), 14);
    assert.ok(rows.length > 0, "two weeks of November nights should turn something up");
    for (const { target, when } of rows) {
        assert.ok(when !== null, "a future night is always a real date");
        assert.ok(evaluate(target, NEW_YORK, when!, null).visible, `${target.id} is not up at its reported night`);
    }
}

// --- upAhead caches per site per day, and lets go when either moves ---
{
    const morning = new Date("2026-11-16T09:00:00");
    const evening = new Date("2026-11-16T21:00:00");

    const first = upAhead(NEW_YORK, morning, 14);
    assert.equal(upAhead(NEW_YORK, evening, 14), first, "the same day must reuse the cached sweep");
    assert.notEqual(upAhead(NEW_YORK, new Date("2026-11-17T09:00:00"), 14), first, "a new day must re-scan");
    assert.notEqual(upAhead(TROMSO, morning, 14), first, "a new site must re-scan");
}

// --- a sunlit fortnight offers only what does not need the dark ---
{
    const rows = upAhead(TROMSO, new Date("2026-06-15T00:00:00"), 14);
    assert.ok(
        rows.every(({ target }) => target.maxSunAltitudeDeg >= 0),
        "Tromsø in June cannot recommend anything that needs a dark sky",
    );
    assert.ok(
        rows.some(({ target }) => target.id === "sun"),
        "the midnight sun is still a target, and it is up",
    );
}

console.log("ok — look-ahead sampling checks out");
