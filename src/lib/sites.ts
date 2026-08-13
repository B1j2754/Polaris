/** A saved observing spot. Superset of `Coords`, so it drops straight into everything in sky.ts. */
export type Site = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  /** Meters above sea level. */
  elevation: number;
  /** Degrees of sky eaten by trees/buildings/hills. Raises the bar a target must clear. */
  horizonDeg: number; // TODO: Potentially hook up a screen to this?
};

/**
 * Open-Meteo's geocoder rather than expo-location's. Much more reliable.
 */
const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";

type GeocodeResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  admin1?: string;
  country_code?: string;
};

/** Empty on failure. */
export async function searchPlaces(query: string): Promise<Site[]> {
  const name = query.trim();
  if (name.length < 2) return [];

  try {
    const response = await fetch(`${GEOCODE_URL}?name=${encodeURIComponent(name)}&count=6`);
    if (!response.ok) {
      console.warn("[geocode] HTTP", response.status);
      return [];
    }
    const { results } = await response.json();
    if (!Array.isArray(results)) return []; // the API omits `results` entirely when nothing matches
    return results.map(toSite);
  } catch (e) {
    console.warn("[geocode] fetch threw", e);
    return [];
  }
}

const toSite = (r: GeocodeResult): Site => ({
  // the geocoder's own id is stable and unique per place, so re-adding a place overwrites it
  id: String(r.id),
  name: [r.name, r.admin1, r.country_code].filter(Boolean).join(", "),
  lat: r.latitude,
  lon: r.longitude,
  elevation: Number.isFinite(r.elevation) ? r.elevation! : 0, // Must check input
  horizonDeg: 0,
});

/** What a site's numbers read as under its name in the list. */
export const siteLine = (s: Site) =>
  `${s.lat.toFixed(2)}°, ${s.lon.toFixed(2)}° · ${s.elevation.toFixed(0)}m · ${s.horizonDeg}° blocked`;

/** Horizon is estimated by eye, never measured, so course steps are offered. */
export const HORIZON_PRESETS = [
  { label: "Open", deg: 0 },
  { label: "Some", deg: 10 },
  { label: "Trees", deg: 20 },
  { label: "Hemmed in", deg: 30 },
] as const;
