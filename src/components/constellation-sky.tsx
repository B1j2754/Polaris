import { useMemo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const PAN = 40; // max px the sky drifts as you tilt phone
const W = SCREEN_W + PAN * 2;
const H = SCREEN_H + PAN * 2;

function mulberry32(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

type Star = { x: number; y: number; r: number; o: number };

function generateSky(seed: number, count: number) {
    const rand = mulberry32(seed);
    const stars: Star[] = Array.from({ length: count }, () => ({
        x: rand() * W,
        y: rand() * H,
        r: rand() * 1.3 + 0.3,
        o: rand() * 0.6 + 0.25,
    }));

    const anchors = stars.slice(0, 14).map((s) => ({ ...s, r: rand() * 1.2 + 1.4, o: 1 }));
    const lines: [Star, Star][] = [];
    anchors.forEach((a, i) => {
        let best = -1;
        let bestD = Infinity;
        anchors.forEach((b, j) => {
            if (i === j) return;
            const d = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
            if (d < bestD) {
                bestD = d;
                best = j;
            }
        });
        if (best > i) lines.push([a, anchors[best]]); // dedipes most pairs
    });

    return { stars: [...stars.slice(14), ...anchors], lines };
}

export function ConstellationSky({ seed = 1337, count = 140 }: { seed?: number; count?: number }) {
    const { stars, lines } = useMemo(() => generateSky(seed, count), [seed, count]);

    const gravity = useAnimatedSensor(SensorType.GRAVITY, { interval: 16 });
    const baseX = useSharedValue<number | null>(null);
    const baseY = useSharedValue<number | null>(null);
    const offX = useSharedValue(0);
    const offY = useSharedValue(0);

    const skyStyle = useAnimatedStyle(() => {
        const { x, y } = gravity.sensor.value;
        if (baseX.value === null) {
            baseX.value = x;
            baseY.value = y;
        }
        
        const targetX = interpolate(x - (baseX.value ?? x), [-5, 5], [PAN, -PAN], Extrapolation.CLAMP);
        const targetY = interpolate(y - (baseY.value ?? y), [-9, 0], [-PAN, PAN], Extrapolation.CLAMP);
        const EASE = 0.08;
        offX.value += (targetX - offX.value) * EASE;
        offY.value += (targetY - offY.value) * EASE;
        return {
            transform: [{ translateX: offX.value }, { translateY: offY.value }],
        };
    });

    return (
        <Animated.View style={[styles.sky, skyStyle]} pointerEvents="none">
            <Svg width={W} height={H}>
                {lines.map(([a, b], i) => (
                    <Line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#9db4ff" strokeWidth={0.5} strokeOpacity={0.25} />
                ))}
                {stars.map((s, i) => (
                    <Circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffffff" fillOpacity={s.o} />
                ))}
            </Svg>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    sky: {
        position: 'absolute',
        left: -PAN,
        top: -PAN,
        width: W,
        height: H,
    },
});
