const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Note: react-native-css's `inlineVariables: false` compiler option (which would be the
// "correct" way to stop runtime-only CSS vars from being flattened to literals) doesn't
// actually reach the compiler in this SDK 54 / nativewind preview combo — Expo's transform
// worker wrapper drops it. The real workaround lives in global.css: each theme color token
// is declared twice, which defeats the "declared once -> inline" heuristic directly.
module.exports = withNativewind(config);
