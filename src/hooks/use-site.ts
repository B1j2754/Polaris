import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { Coords } from '@/sky';

/** TODO: used until the Sites tab can store a real site. Roughly New York. */
const DEFAULT_SITE: Coords = { lat: 40.71, lon: -74.01 };

/** Where the user is standing. `denied` means they refused location and are looking at the default site. */
export function useSite() {
  const [site, setSite] = useState<Coords | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setDenied(true);
        setSite(DEFAULT_SITE);
        return;
      }
      const position =
        (await Location.getLastKnownPositionAsync()) ??
        (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }));
      setSite({ lat: position.coords.latitude, lon: position.coords.longitude });
    })();
  }, []);

  return { site, denied };
}
