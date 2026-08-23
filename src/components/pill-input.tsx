import { TextInput, type TextInputProps } from "react-native";

import { tv } from "tailwind-variants";

import { usePalette } from "@/lib/theming";

/**
 * Tailwind's text-* utilities pair a larger line-height (text-lg is 18px/28px), and RN hangs all of that extra
 * leading above the glyphs instead of splitting it, dropping typed text low in the pill.
 *
 * 1.12 is Sansation's own line box -- (ascent 1854 + descent 438) / 2048 upem -- so no leading is left to hang,
 * while staying just above the box the font needs so Android can't clip descenders. Re-measure if the typeface
 * changes; NativeWind resolves a unitless line-height against font-size.
 *
 * Size is a variant rather than a className override on purpose: tailwind-merge counts font-size as conflicting
 * with leading, so a caller passing a bare `text-xl` would silently strip the pairing and drop the text again.
 */
const pill = tv({
    base: "font-sansation h-14 rounded-full border border-line px-5 text-fg",
    variants: {
        size: {
            base: "text-base leading-[1.12]",
            lg: "text-lg leading-[1.12]",
            xl: "text-xl leading-[1.12]",
        },
    },
    defaultVariants: { size: "lg" },
});

// textAlignVertical is Android-only, and can't win against Sansation's built-in font padding on its own
const centred = { includeFontPadding: false, paddingVertical: 0, textAlignVertical: "center" } as const;

type Props = TextInputProps & { size?: "base" | "lg" | "xl" };

export function PillInput({ className, size, ...rest }: Props) {
    const Palette = usePalette();
    return (
        <TextInput
            placeholderTextColor={Palette.placeholder}
            style={centred}
            className={pill({ size, class: className })}
            {...rest}
        />
    );
}
