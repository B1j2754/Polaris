import assert from "node:assert/strict";

import { aimAt, guidance, LOCK_DEGREES, normalizeDelta, separation, smoothAngle } from "./pointing.ts";

const near = (actual: number, expected: number, tolerance: number, what: string) =>
    assert.ok(
        Math.abs(actual - expected) <= tolerance,
        `${what}: got ${actual.toFixed(3)}, expected ${expected} ±${tolerance}`,
    );

near(normalizeDelta(1 - 359), 2, 1e-9, "wrap forwards over north");
near(normalizeDelta(359 - 1), -2, 1e-9, "wrap backwards over north");
near(normalizeDelta(90), 90, 1e-9, "no wrap needed");
near(Math.abs(normalizeDelta(180)), 180, 1e-9, "antipodal stays 180");
near(Math.abs(normalizeDelta(-540)), 180, 1e-9, "multiple turns collapse");

near(separation({ altitude: 30, azimuth: 120 }, { altitude: 30, azimuth: 120 }), 0, 1e-9, "same point");
near(separation({ altitude: 0, azimuth: 0 }, { altitude: 0, azimuth: 90 }), 90, 1e-9, "quarter turn on horizon");
near(separation({ altitude: 90, azimuth: 0 }, { altitude: 80, azimuth: 217 }), 10, 1e-9, "zenith ignores azimuth");
near(separation({ altitude: 0, azimuth: 359 }, { altitude: 0, azimuth: 1 }), 2, 1e-9, "across north");
assert.ok(
    separation({ altitude: 85, azimuth: 0 }, { altitude: 85, azimuth: 30 }) < 3,
    "30° of azimuth near the zenith is a small gap",
);

const up = aimAt({ altitude: 50, azimuth: 180 }, { altitude: 20, azimuth: 180 });
near(up.rotation, 0, 1e-9, "target above points the arrow up");
near(up.altitudeError, 30, 1e-9, "altitude error signed up");

const right = aimAt({ altitude: 20, azimuth: 210 }, { altitude: 20, azimuth: 180 });
near(right.rotation, 90, 1e-9, "target clockwise points the arrow right");

const left = aimAt({ altitude: 20, azimuth: 150 }, { altitude: 20, azimuth: 180 });
near(left.rotation, -90, 1e-9, "target anticlockwise points the arrow left");

const behindNorth = aimAt({ altitude: 20, azimuth: 1 }, { altitude: 20, azimuth: 359 });
near(behindNorth.azimuthError, 2, 1e-9, "aim wraps over north too");
near(behindNorth.rotation, 90, 1e-9, "wrapped target still reads as right");

const below = aimAt({ altitude: 10, azimuth: 180 }, { altitude: 40, azimuth: 180 });
near(Math.abs(below.rotation), 180, 1e-9, "target below points the arrow down");

assert.ok(aimAt({ altitude: 40, azimuth: 90 }, { altitude: 40 + LOCK_DEGREES - 1, azimuth: 90 }).locked, "inside lock");
assert.ok(
    !aimAt({ altitude: 40, azimuth: 90 }, { altitude: 40 + LOCK_DEGREES + 1, azimuth: 90 }).locked,
    "outside lock",
);

assert.equal(guidance(aimAt({ altitude: 20, azimuth: 227 }, { altitude: 20, azimuth: 180 })), "Pan right 47°");
assert.equal(guidance(aimAt({ altitude: 20, azimuth: 133 }, { altitude: 20, azimuth: 180 })), "Pan left 47°");
assert.equal(guidance(aimAt({ altitude: 32, azimuth: 180 }, { altitude: 20, azimuth: 180 })), "Tilt up 12°");
assert.equal(guidance(aimAt({ altitude: 8, azimuth: 180 }, { altitude: 20, azimuth: 180 })), "Tilt down 12°");
assert.equal(guidance(aimAt({ altitude: 20, azimuth: 180 }, { altitude: 21, azimuth: 181 })), "Look here");

near(smoothAngle(359, 1, 0.5), 360, 1e-9, "smoothing takes the short way over north");
near(smoothAngle(10, 50, 0.25), 20, 1e-9, "smoothing eases a quarter of the way");
near(smoothAngle(42, 42, 0.25), 42, 1e-9, "settled smoothing holds still");

console.log("pointing.check.ts: all assertions passed");
