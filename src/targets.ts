import type { IconName } from '@/components/icon';
import type { Body } from '@/sky';

export type Target = {
  id: string;
  name: string;
  kind: 'planet' | 'moon' | 'sun' | 'star' | 'galaxy' | 'nebula' | 'cluster';
  interest: 'Planets' | 'Moon' | 'Sun' | 'Stars' | 'Galaxies' | 'Nebulae';
  blurb: string;
  magnitude: number;
  sizeArcmin?: number;
  /** fixed objects: J2000 right ascension / declination, degrees */
  ra?: number;
  dec?: number;
  /** moving objects: run through the ephemeris instead of ra/dec */
  body?: Body;

  minAltitudeDeg: number;
  /** How dark it has to be: 0 sunset, -6 civil, -12 nautical, -18 astronomical dusk. */
  maxSunAltitudeDeg: number;
  /** Weather requirement: cloud cover percentage this can tolerate. */
  maxCloudPct: number;
  /** Moonlight this can tolerate, 0..1 lit fraction. 1 = doesn't care. */
  maxMoonIllum: number;
};

export const TARGETS: Target[] = [
  // --- solar system ---
  {
    id: 'moon', name: 'The Moon', kind: 'moon', interest: 'Moon', body: 'Moon',
    blurb: 'Craters along the terminator — best at half phase, not full',
    magnitude: -12.7, sizeArcmin: 31,
    minAltitudeDeg: 10, maxSunAltitudeDeg: 5, maxCloudPct: 70, maxMoonIllum: 1,
  },
  {
    id: 'sun', name: 'The Sun', kind: 'sun', interest: 'Sun', body: 'Sun',
    blurb: 'Sunspots and granulation — CERTIFIED SOLAR FILTER ONLY, never look without one',
    magnitude: -26.7, sizeArcmin: 32,
    minAltitudeDeg: 15, maxSunAltitudeDeg: 90, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'mercury', name: 'Mercury', kind: 'planet', interest: 'Planets', body: 'Mercury',
    blurb: 'Never far from the Sun — a low twilight phase, briefly',
    magnitude: 0,
    minAltitudeDeg: 5, maxSunAltitudeDeg: -3, maxCloudPct: 30, maxMoonIllum: 1,
  },
  {
    id: 'venus', name: 'Venus', kind: 'planet', interest: 'Planets', body: 'Venus',
    blurb: 'Blinding white crescent — the brightest thing after the Moon',
    magnitude: -4.2,
    minAltitudeDeg: 8, maxSunAltitudeDeg: 2, maxCloudPct: 60, maxMoonIllum: 1,
  },
  {
    id: 'mars', name: 'Mars', kind: 'planet', interest: 'Planets', body: 'Mars',
    blurb: 'Orange disc — polar cap and dark markings near opposition',
    magnitude: 0.7,
    minAltitudeDeg: 25, maxSunAltitudeDeg: -6, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'jupiter', name: 'Jupiter', kind: 'planet', interest: 'Planets', body: 'Jupiter',
    blurb: 'Cloud belts and four moons that move night to night',
    magnitude: -2.2, sizeArcmin: 0.7,
    minAltitudeDeg: 25, maxSunAltitudeDeg: -4, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'saturn', name: 'Saturn', kind: 'planet', interest: 'Planets', body: 'Saturn',
    blurb: 'The rings. Nothing else in the sky looks fake like this does',
    magnitude: 0.6, sizeArcmin: 0.3,
    minAltitudeDeg: 25, maxSunAltitudeDeg: -6, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'uranus', name: 'Uranus', kind: 'planet', interest: 'Planets', body: 'Uranus',
    blurb: 'A small blue-green disc — you need to know exactly where to look',
    magnitude: 5.7,
    minAltitudeDeg: 35, maxSunAltitudeDeg: -12, maxCloudPct: 20, maxMoonIllum: 0.8,
  },
  {
    id: 'neptune', name: 'Neptune', kind: 'planet', interest: 'Planets', body: 'Neptune',
    blurb: 'A faint blue dot — barely a disc even at high power',
    magnitude: 7.8,
    minAltitudeDeg: 35, maxSunAltitudeDeg: -15, maxCloudPct: 15, maxMoonIllum: 0.6,
  },

  // --- stars ---
  {
    id: 'polaris', name: 'Polaris', kind: 'star', interest: 'Stars', ra: 37.95, dec: 89.264,
    blurb: 'The north star, and a tidy double in any scope',
    magnitude: 2.0,
    minAltitudeDeg: 10, maxSunAltitudeDeg: -6, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'sirius', name: 'Sirius', kind: 'star', interest: 'Stars', ra: 101.29, dec: -16.716,
    blurb: 'Brightest star in the sky — flashes every colour when it is low',
    magnitude: -1.46,
    minAltitudeDeg: 15, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'vega', name: 'Vega', kind: 'star', interest: 'Stars', ra: 279.23, dec: 38.784,
    blurb: 'Steely blue overhead all summer',
    magnitude: 0.03,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'betelgeuse', name: 'Betelgeuse', kind: 'star', interest: 'Stars', ra: 88.79, dec: 7.407,
    blurb: 'Red supergiant on Orion’s shoulder — it visibly varies',
    magnitude: 0.5,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'rigel', name: 'Rigel', kind: 'star', interest: 'Stars', ra: 78.63, dec: -8.2,
    blurb: 'Blue-white, with a faint companion that tests your seeing',
    magnitude: 0.13,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'arcturus', name: 'Arcturus', kind: 'star', interest: 'Stars', ra: 213.92, dec: 19.18,
    blurb: 'Orange giant — follow the arc of the Big Dipper’s handle',
    magnitude: -0.05,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'capella', name: 'Capella', kind: 'star', interest: 'Stars', ra: 79.17, dec: 45.998,
    blurb: 'Yellow and high — circumpolar from most of the northern US',
    magnitude: 0.08,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'antares', name: 'Antares', kind: 'star', interest: 'Stars', ra: 247.35, dec: -26.43,
    blurb: 'The heart of Scorpius — deep red, and always low',
    magnitude: 1.06,
    minAltitudeDeg: 12, maxSunAltitudeDeg: -6, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'albireo', name: 'Albireo', kind: 'star', interest: 'Stars', ra: 292.68, dec: 27.96,
    blurb: 'Gold and blue pair — the prettiest double in the sky',
    magnitude: 3.1,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -8, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'mizar', name: 'Mizar & Alcor', kind: 'star', interest: 'Stars', ra: 200.98, dec: 54.925,
    blurb: 'Naked-eye pair in the Dipper’s handle; Mizar splits again in a scope',
    magnitude: 2.2,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -8, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'altair', name: 'Altair', kind: 'star', interest: 'Stars', ra: 297.7, dec: 8.87,
    blurb: 'Southern corner of the Summer Triangle',
    magnitude: 0.77,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },
  {
    id: 'deneb', name: 'Deneb', kind: 'star', interest: 'Stars', ra: 310.36, dec: 45.28,
    blurb: 'Tail of the swan — one of the most luminous stars you can see',
    magnitude: 1.25,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -6, maxCloudPct: 50, maxMoonIllum: 1,
  },

  // --- galaxies ---
  {
    id: 'm31', name: 'M31 — Andromeda Galaxy', kind: 'galaxy', interest: 'Galaxies',
    ra: 10.68, dec: 41.269,
    blurb: 'Six times the width of the Moon — use your lowest power',
    magnitude: 3.4, sizeArcmin: 190,
    minAltitudeDeg: 30, maxSunAltitudeDeg: -15, maxCloudPct: 25, maxMoonIllum: 0.7,
  },
  {
    id: 'm33', name: 'M33 — Triangulum Galaxy', kind: 'galaxy', interest: 'Galaxies',
    ra: 23.46, dec: 30.66,
    blurb: 'Big but ghostly — dark sky or you will not see it at all',
    magnitude: 5.7, sizeArcmin: 70,
    minAltitudeDeg: 40, maxSunAltitudeDeg: -18, maxCloudPct: 15, maxMoonIllum: 0.25,
  },
  {
    id: 'm51', name: 'M51 — Whirlpool Galaxy', kind: 'galaxy', interest: 'Galaxies',
    ra: 202.47, dec: 47.195,
    blurb: 'Two cores and a bridge between them — spiral arms need 8" and dark sky',
    magnitude: 8.4, sizeArcmin: 11,
    minAltitudeDeg: 40, maxSunAltitudeDeg: -18, maxCloudPct: 15, maxMoonIllum: 0.35,
  },
  {
    id: 'm81', name: 'M81 & M82 — Bode’s Pair', kind: 'galaxy', interest: 'Galaxies',
    ra: 148.89, dec: 69.065,
    blurb: 'Two galaxies in one low-power field: a bright oval and a thin cigar',
    magnitude: 6.9, sizeArcmin: 26,
    minAltitudeDeg: 35, maxSunAltitudeDeg: -15, maxCloudPct: 20, maxMoonIllum: 0.5,
  },
  {
    id: 'm104', name: 'M104 — Sombrero Galaxy', kind: 'galaxy', interest: 'Galaxies',
    ra: 189.998, dec: -11.62,
    blurb: 'Edge-on with a dust lane straight across the middle',
    magnitude: 8.0, sizeArcmin: 9,
    minAltitudeDeg: 30, maxSunAltitudeDeg: -18, maxCloudPct: 15, maxMoonIllum: 0.4,
  },

  // --- nebulae ---
  {
    id: 'm42', name: 'M42 — Orion Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 83.82, dec: -5.39,
    blurb: 'The one that converts people. Four stars of the Trapezium sit inside it',
    magnitude: 4.0, sizeArcmin: 85,
    minAltitudeDeg: 25, maxSunAltitudeDeg: -12, maxCloudPct: 30, maxMoonIllum: 0.9,
  },
  {
    id: 'm57', name: 'M57 — Ring Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 283.4, dec: 33.03,
    blurb: 'A tiny grey smoke ring — small, but takes magnification well',
    magnitude: 8.8, sizeArcmin: 1.4,
    minAltitudeDeg: 30, maxSunAltitudeDeg: -15, maxCloudPct: 25, maxMoonIllum: 0.8,
  },
  {
    id: 'm27', name: 'M27 — Dumbbell Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 299.9, dec: 22.72,
    blurb: 'Brightest planetary nebula — an apple core in any scope',
    magnitude: 7.4, sizeArcmin: 8,
    minAltitudeDeg: 30, maxSunAltitudeDeg: -15, maxCloudPct: 25, maxMoonIllum: 0.7,
  },
  {
    id: 'm8', name: 'M8 — Lagoon Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 270.9, dec: -24.38,
    blurb: 'Bright glow split by a dark lane, with a cluster embedded',
    magnitude: 6.0, sizeArcmin: 90,
    minAltitudeDeg: 15, maxSunAltitudeDeg: -18, maxCloudPct: 20, maxMoonIllum: 0.5,
  },
  {
    id: 'm16', name: 'M16 — Eagle Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 274.7, dec: -13.79,
    blurb: 'The Pillars of Creation live here. Visually: a cluster in haze',
    magnitude: 6.4, sizeArcmin: 7,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -18, maxCloudPct: 15, maxMoonIllum: 0.4,
  },
  {
    id: 'm17', name: 'M17 — Omega Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 275.11, dec: -16.18,
    blurb: 'A bright checkmark of gas — holds up better than most under a bit of moon',
    magnitude: 6.0, sizeArcmin: 11,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -15, maxCloudPct: 20, maxMoonIllum: 0.6,
  },
  {
    id: 'ngc7000', name: 'NGC 7000 — North America Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 314.82, dec: 44.52,
    blurb: 'Four Moons wide — binoculars beat a telescope here',
    magnitude: 4.0, sizeArcmin: 120,
    minAltitudeDeg: 35, maxSunAltitudeDeg: -18, maxCloudPct: 15, maxMoonIllum: 0.3,
  },
  {
    id: 'veil', name: 'Veil Nebula', kind: 'nebula', interest: 'Nebulae',
    ra: 311.41, dec: 30.72,
    blurb: 'Supernova wreckage in filaments. Needs an OIII filter to really show',
    magnitude: 7.0, sizeArcmin: 180,
    minAltitudeDeg: 40, maxSunAltitudeDeg: -18, maxCloudPct: 10, maxMoonIllum: 0.2,
  },

  // --- clusters ---
  {
    id: 'm45', name: 'M45 — Pleiades', kind: 'cluster', interest: 'Stars', ra: 56.85, dec: 24.12,
    blurb: 'Seven Sisters — too big for most scopes, perfect in binoculars',
    magnitude: 1.6, sizeArcmin: 110,
    minAltitudeDeg: 20, maxSunAltitudeDeg: -10, maxCloudPct: 40, maxMoonIllum: 1,
  },
  {
    id: 'm13', name: 'M13 — Hercules Cluster', kind: 'cluster', interest: 'Stars',
    ra: 250.42, dec: 36.46,
    blurb: 'Half a million stars in a ball — resolves to grains at 150x',
    magnitude: 5.8, sizeArcmin: 20,
    minAltitudeDeg: 30, maxSunAltitudeDeg: -12, maxCloudPct: 25, maxMoonIllum: 0.8,
  },
  {
    id: 'm22', name: 'M22', kind: 'cluster', interest: 'Stars', ra: 279.1, dec: -23.9,
    blurb: 'Bigger and brighter than M13, but it never gets high from up north',
    magnitude: 5.1, sizeArcmin: 32,
    minAltitudeDeg: 15, maxSunAltitudeDeg: -12, maxCloudPct: 25, maxMoonIllum: 0.8,
  },
  {
    id: 'm44', name: 'M44 — Beehive Cluster', kind: 'cluster', interest: 'Stars',
    ra: 130.1, dec: 19.67,
    blurb: 'A naked-eye smudge that explodes into stars in binoculars',
    magnitude: 3.7, sizeArcmin: 95,
    minAltitudeDeg: 25, maxSunAltitudeDeg: -12, maxCloudPct: 35, maxMoonIllum: 0.9,
  },
  {
    id: 'm7', name: 'M7 — Ptolemy Cluster', kind: 'cluster', interest: 'Stars',
    ra: 268.46, dec: -34.79,
    blurb: 'Bright and sprawling, but you need a clear southern horizon',
    magnitude: 3.3, sizeArcmin: 80,
    minAltitudeDeg: 10, maxSunAltitudeDeg: -12, maxCloudPct: 30, maxMoonIllum: 0.9,
  },
  {
    id: 'double-cluster', name: 'Double Cluster', kind: 'cluster', interest: 'Stars',
    ra: 34.75, dec: 57.13,
    blurb: 'Two open clusters side by side in the same field, high up all autumn',
    magnitude: 4.3, sizeArcmin: 60,
    minAltitudeDeg: 25, maxSunAltitudeDeg: -12, maxCloudPct: 30, maxMoonIllum: 0.9,
  },
];

export const ICONS: Record<Target['kind'], IconName> = {
  planet: 'planet',
  moon: 'moon',
  sun: 'sun',
  star: 'astroid',
  galaxy: 'orbit',
  nebula: 'nebula',
  cluster: 'astroid',
};
