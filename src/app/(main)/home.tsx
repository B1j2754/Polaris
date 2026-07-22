import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { BottomTabInset } from '@/constants/theme';
import { useProfile } from '@/profile';
import { compassPoint, evaluate, fetchWeather, type Coords, type Verdict, type Weather } from '@/sky';
import { ICONS, TARGETS, type Target } from '@/targets';

/** TODO: used until the Sites tab can store a real site. Roughly New York. */
const DEFAULT_SITE: Coords = { lat: 40.71, lon: -74.01 };

const WEATHER_MAX_AGE_MS = 30 * 60 * 1000;

export default function Home() {
  const { profile } = useProfile();
  const [site, setSite] = useState<Coords | null>(null);
  const [denied, setDenied] = useState(false);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [now, setNow] = useState(() => new Date());

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

  // lazy load weather
  useEffect(() => {
    if (!site) return;
    let cancelled = false;
    const load = () => fetchWeather(site).then((w) => !cancelled && setWeather(w));
    load();
    const timer = setInterval(load, WEATHER_MAX_AGE_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [site]);

  // lazy load sky, at minute intervals to keep it seamless
  useFocusEffect(
    useCallback(() => {
      setNow(new Date());
      const timer = setInterval(() => setNow(new Date()), 60_000);
      return () => clearInterval(timer);
    }, [])
  );

  if (!site) {
    return (
      <View className="flex-1 items-center justify-center bg-[#05070f]">
        <Text className="font-sansation text-lg text-gray-400 tracking-[1px]">Finding you…</Text>
      </View>
    );
  }

  const interests = profile?.interests ?? [];
  const ranked = TARGETS.map((target) => ({ target, verdict: evaluate(target, site, now, weather) }))
    // a matched interest breaks ties; it doesn't outrank something that is actually up
    .sort((a, b) => rank(b, interests) - rank(a, interests));

  const upNow = ranked.filter((r) => r.verdict.visible).length;

  return (
    <SafeAreaView className="flex-1 bg-[#05070f]" edges={['top']}>
      <FlatList
        data={ranked}
        keyExtractor={({ target }) => target.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: BottomTabInset + 24, gap: 8 }}
        ListHeaderComponent={
          <View className="gap-1 pb-4">
            <Text className="font-sansation text-4xl text-white tracking-[1px]">Tonight</Text>
            <Text className="font-sansation text-lg text-gray-400 tracking-[1px]">
              {upNow} worth looking at
              {weather ? ` · ${weather.cloudCover.toFixed(0)}% cloud` : ' · no weather data'}
            </Text>
            {denied && (
              <Text className="font-sansation text-base text-gray-500 tracking-[1px]">
                Location off. Showing the sky from a default site.
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => <Card target={item.target} verdict={item.verdict} />}
      />
    </SafeAreaView>
  );
}

const rank = ({ target, verdict }: { target: Target; verdict: Verdict }, interests: string[]) =>
  verdict.score + (interests.includes(target.interest) ? 0.05 : 0);

function Card({ target, verdict }: { target: Target; verdict: Verdict }) {
  const { visible, altitude, azimuth, reasons } = verdict;
  return (
    <View
      className={`flex-row items-center gap-4 rounded-3xl border bg-gray-950 p-4 ${
        visible ? 'border-white/20' : 'border-transparent opacity-50'
      }`}>
      <Icon name={ICONS[target.kind]} size={32} color={visible ? '#ffffff' : '#6b7280'} />
      <View className="flex-1 gap-1">
        <Text className="font-sansation text-xl text-white tracking-[1px]">{target.name}</Text>
        <Text numberOfLines={2} className="font-sansation text-base text-gray-400 tracking-[1px]">
          {target.blurb}
        </Text>
        <Text className="font-sansation text-base text-gray-300 tracking-[1px]">
          {visible
            ? `${altitude.toFixed(0)}° up, looking ${compassPoint(azimuth)}`
            : reasons.join(' · ')}
        </Text>
      </View>
    </View>
  );
}
