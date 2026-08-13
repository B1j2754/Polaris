import { createElement } from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

import { usePalette } from '@/lib/theming';

/**
 * Icon artwork copied from lucide and @lucide/lab (both ISC).
 *
 * Not imported from `lucide-react-native` on purpose: its root barrel bundles all ~1600 icons
 * (+2MB — Metro doesn't tree-shake), and its per-icon `exports` subpaths don't resolve under
 * pnpm in Metro. Icons are static artwork, so the data is just pasted here.
 * To add one: copy its node from lucide's source.
 */

const ELEMENTS: Record<string, React.ComponentType<any>> = {
  circle: Circle,
  line: Line,
  path: Path,
  polygon: Polygon,
  polyline: Polyline,
  rect: Rect,
};

type SvgElement = 'circle' | 'line' | 'path' | 'polygon' | 'polyline' | 'rect';
type IconNode = [element: SvgElement, attrs: Record<string, string>][];

export const icons = {
  comet: [
    [
      'path',
      {
        d: 'M12 5.647L9.353 3m.53 6.882L4.058 4.06M5.647 12L3 9.353m5.294 5.294l4.235-2.118l2.118-4.235l2.118 4.235L21 14.647l-4.235 2.118L14.647 21l-2.118-4.235z',
      },
    ],
  ],
  planet: [
    ['circle', { cx: '12', cy: '12', r: '8' }],
    [
      'path',
      {
        d: 'M4.05 13c-1.7 1.8-2.5 3.5-1.8 4.5 1.1 1.9 6.4 1 11.8-2s8.9-7.1 7.7-9c-.6-1-2.4-1.2-4.7-.7',
      },
    ],
  ],
  orbit: [
    ['path', { d: 'M20.341 6.484A10 10 0 0 1 10.266 21.85' }],
    ['path', { d: 'M3.659 17.516A10 10 0 0 1 13.74 2.152' }],
    ['circle', { cx: '12', cy: '12', r: '3' }],
    ['circle', { cx: '19', cy: '5', r: '2' }],
    ['circle', { cx: '5', cy: '19', r: '2' }],
  ],
  moon: [
    [
      'path',
      {
        d: 'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401',
      },
    ],
  ],
  sunrise: [
    ['path', { d: 'M12 2v8' }],
    ['path', { d: 'm4.93 10.93 1.41 1.41' }],
    ['path', { d: 'M2 18h2' }],
    ['path', { d: 'M20 18h2' }],
    ['path', { d: 'm19.07 10.93-1.41 1.41' }],
    ['path', { d: 'M22 22H2' }],
    ['path', { d: 'm8 6 4-4 4 4' }],
    ['path', { d: 'M16 18a4 4 0 0 0-8 0' }],
  ],
  sun: [
    ['circle', { cx: '12', cy: '12', r: '4' }],
    ['path', { d: 'M12 2v2' }],
    ['path', { d: 'M12 20v2' }],
    ['path', { d: 'm4.93 4.93 1.41 1.41' }],
    ['path', { d: 'm17.66 17.66 1.41 1.41' }],
    ['path', { d: 'M2 12h2' }],
    ['path', { d: 'M20 12h2' }],
    ['path', { d: 'm6.34 17.66-1.41 1.41' }],
    ['path', { d: 'm19.07 4.93-1.41 1.41' }],
  ],
  astroid: [
    [
      'path',
      {
        d: 'M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203',
      },
    ],
  ],
  satellite: [
    [
      'path',
      {
        d: 'm13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5'
      }
    ],
    [
      'path',
      {
        d: 'M16.5 7.5 19 5'
      }
    ],
    [
      'path',
      {
        d: 'm17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5'
      }
    ],
    [
      'path',
      {
        d: 'M9 21a6 6 0 0 0-6-6'
      }
    ],
    [
      'path',
      {
        d: 'M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z'
      }
    ]
  ],
  cloud: [['path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }]],
  droplet: [
    [
      'path',
      {
        d: 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z',
      },
    ],
  ],
  // lucide smile / meh / frown — the seeing-quality face
  smile: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }],
    ['line', { x1: '9', x2: '9.01', y1: '9', y2: '9' }],
    ['line', { x1: '15', x2: '15.01', y1: '9', y2: '9' }],
  ],
  meh: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['line', { x1: '8', x2: '16', y1: '15', y2: '15' }],
    ['line', { x1: '9', x2: '9.01', y1: '9', y2: '9' }],
    ['line', { x1: '15', x2: '15.01', y1: '9', y2: '9' }],
  ],
  frown: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M16 16s-1.5-2-4-2-4 2-4 2' }],
    ['line', { x1: '9', x2: '9.01', y1: '9', y2: '9' }],
    ['line', { x1: '15', x2: '15.01', y1: '9', y2: '9' }],
  ],
  plus: [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'M12 5v14' }],
  ],
  x: [
    ['path', { d: 'M18 6 6 18' }],
    ['path', { d: 'm6 6 12 12' }],
  ],
  check: [['path', { d: 'M20 6 9 17l-5-5' }]],
  trash: [
    ['path', { d: 'M3 6h18' }],
    ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }],
    ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }],
  ],
  chevronRight: [['path', { d: 'm9 18 6-6-6-6' }]],
  arrowUpDown: [
    ['path', { d: 'm21 16-4 4-4-4' }],
    ['path', { d: 'M17 20V4' }],
    ['path', { d: 'm3 8 4-4 4 4' }],
    ['path', { d: 'M7 4v16' }],
  ],
  info: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M12 16v-4' }],
    ['path', { d: 'M12 8h.01' }],
  ],
  mapPin: [
    [
      'path',
      {
        d: 'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0',
      },
    ],
    ['circle', { cx: '12', cy: '10', r: '3' }],
  ],
  // hand-drawn on lucide's grid: gas cloud (adapted from lucide's `cloud`) + a sparkle
  nebula: [
    ['path', { d: 'M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z' }],
    ['path', { d: 'M20 3v3' }],
    ['path', { d: 'M21.5 4.5h-3' }],
  ],
} satisfies Record<string, IconNode>;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 24,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const Palette = usePalette();
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color ?? Palette.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      // an icon is decoration — without this it swallows taps meant for the Pressable under it
      pointerEvents="none">
      {(icons[name] as IconNode).map(([element, attrs], i) =>
        createElement(ELEMENTS[element], { ...attrs, key: i })
      )}
    </Svg>
  );
}
