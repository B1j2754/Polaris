import { ReactNode } from "react";
import { Pressable, type PressableProps, Text } from "react-native";

import { tv } from "tailwind-variants";

export const box = tv({
    base: "size-32 items-center justify-center gap-2 rounded-3xl border bg-sheet px-1",
    variants: {
        selected: {
            true: "border-fg",
            false: "border-transparent",
        },
    },
    defaultVariants: {
        selected: false,
    },
});

type BoxProps = PressableProps & {
    children?: ReactNode;
    selected?: boolean;
    title: string;
};

export function Box({ selected = false, title, children, ...rest }: BoxProps) {
    return (
        <Pressable
            className={box({ selected })}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            {...rest}
        >
            {children}
            <Text numberOfLines={1} className="font-sansation text-center text-lg text-fg tracking-[1px]">
                {title}
            </Text>
        </Pressable>
    );
}
