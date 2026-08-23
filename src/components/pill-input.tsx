import { TextInput, type TextInputProps } from "react-native";

import { tv } from "tailwind-variants";

import { usePalette } from "@/lib/theming";

const pill = tv({ base: "font-sansation h-14 rounded-full border border-line px-5 text-lg text-fg" });

// Sansation font center fix; textAlignVertical doesn't work because it's an Android-only fix
const centred = { includeFontPadding: false, paddingVertical: 0, textAlignVertical: "center" } as const;

export function PillInput({ className, ...rest }: TextInputProps) {
    const Palette = usePalette();
    return (
        <TextInput
            placeholderTextColor={Palette.placeholder}
            style={centred}
            className={pill({ class: className })}
            {...rest}
        />
    );
}
