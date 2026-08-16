import { ThemeColor } from "@/constants/theme";
import { useColorPalette } from "@/hooks/use-color-palette";

import { View, type ViewProps } from "react-native";

export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
    const theme = useColorPalette();

    return <View style={[{ backgroundColor: theme[type ?? "background"] }, style]} {...otherProps} />;
}
