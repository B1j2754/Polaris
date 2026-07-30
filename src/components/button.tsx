import { Pressable, Text, type PressableProps } from "react-native";
import { tv } from "tailwind-variants";

export const button = tv({
    base: "px-4 py-2 items-center justify-center w-[90%] h-16",
    variants: {
        color: {
            white: "bg-white active:bg-neutral-200",
            black: "bg-black active:bg-neutral-900 border-neutral-900 border-2",
        },
        cornerType: {
            pill: "rounded-full",
            rounded: "rounded-lg",
        },
    },
});

const label = tv({
    // leading-tight: RN hangs tailwind's paired line-height above the glyphs, dropping them low
    base: "font-bold text-base text-xl leading-tight",
    variants: {
        color: {
            white: "text-black",
            black: "text-white",
        },
    },
});

type ButtonProps = PressableProps & {
    color?: "white" | "black";
    title: string;
    cornerType?: "pill" | "rounded";
};

export function Button({ color = "white", title, cornerType = "rounded", ...rest }: ButtonProps) {
    return (
        <Pressable className={button({ color, cornerType })} {...rest}>
            <Text className={label({ color })}>{title}</Text>
        </Pressable>
    );
}
