/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
  red: {
    text: '#ff3b3b',
    background: '#000000',
    backgroundElement: '#1a0000',
    backgroundSelected: '#330a0a',
    textSecondary: '#a33636',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// --- Black Palette ---
export const blackPalette = {
  black: '#000000',
  white: '#ffffff',
  sheet: '#0a0a0a',
  card: '#0f0f0f',
  placeholder: '#666666',
  iconMuted: '#9ca3af',
  iconSubtle: '#6b7280',
  iconTertiary: '#a3a3a3',
  destructive: '#f87171',
  link: '#3c87f7',
  tabInactive: '#7c8496',
} as const;

export const blackVars = {
  '--color-fg': '#ffffff',
  '--color-fg-subtle': '#d4d4d4',
  '--color-fg-muted': '#a3a3a3',
  '--color-fg-dim': '#737373',
  '--color-fg-faint': '#525252',
  '--color-surface': '#171717',
  '--color-sheet': '#0a0a0a',
  '--color-line': '#262626',
  '--color-line-2': '#404040',
  '--color-danger': '#f87171',
  '--color-danger-border': '#7f1d1d',
  '--color-danger-bg': '#450a0a',
} as const;

// --- Red Palette (pure red channel only) ---
export const redPalette = {
  black: '#000000',
  white: '#ff0000',
  sheet: '#1a0000',
  card: '#260000',
  placeholder: '#8c0000',
  iconMuted: '#cc0000',
  iconSubtle: '#9e0000',
  iconTertiary: '#ad0000',
  destructive: '#ff0000',
  link: '#ff0000',
  tabInactive: '#730000',
} as const;

export const redVars = {
  '--color-fg': '#ff0000',
  '--color-fg-subtle': '#db0000',
  '--color-fg-muted': '#bd0000',
  '--color-fg-dim': '#960000',
  '--color-fg-faint': '#6b0000',
  '--color-surface': '#2e0000',
  '--color-sheet': '#1a0000',
  '--color-line': '#470000',
  '--color-line-2': '#5c0000',
  '--color-danger': '#ff0000',
  '--color-danger-border': '#8f0000',
  '--color-danger-bg': '#330000',
} as const;

export type PaletteType = typeof blackPalette | typeof redPalette;
export type ColorVarType = typeof blackVars | typeof redVars;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const ScreenBackground = blackPalette.black;

export const DarkScreen = {
  contentStyle: { backgroundColor: ScreenBackground },
} as const;

/** Floating white back chevron, top-left, no header bar or title. */
export const BackHeader = {
  ...DarkScreen,
  headerShown: true,
  headerTransparent: true,
  headerTitle: '',
  headerTintColor: blackPalette.white,
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
} as const;

/** Height of the floating pill tab bar. */
export const TabPillHeight = 64;

/** Bottom padding scrollable screens need so content clears the floating pill. */
export const BottomTabInset = TabPillHeight + 32;
export const MaxContentWidth = 800;
