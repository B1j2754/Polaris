import { blackPalette, blackVars, PaletteType, redPalette, redVars } from "@/constants/theme";
import { VariableContextProvider } from "nativewind";
import { createContext, PropsWithChildren, useContext, useState } from "react";

// --- Theme Context ---
const ThemeContext = createContext<{
  redTheme: boolean;
  toggle: () => void;
} | null>(null);

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [redTheme, setRedTheme] = useState(false);
  const toggle = () => setRedTheme((v) => !v);
  return <ThemeContext value={{ redTheme, toggle }}>{children}</ThemeContext>;
}

// -- Palette Context ---
const PaletteContext = createContext<PaletteType | null>(null);

export function usePalette() {
  const value = useContext(PaletteContext);
  if (!value) throw new Error("usePalette must be used inside <ThemeProvider>");
  return value;
}

export function PaletteProvider({ children }: PropsWithChildren) {
  const { redTheme } = useTheme();
  return <PaletteContext value={redTheme ? redPalette : blackPalette}>{children}</PaletteContext>;
}

// --- Var Provider ---
export function ColorVarProvider({ children }: PropsWithChildren) {
  const { redTheme } = useTheme();
  return <VariableContextProvider value={redTheme ? redVars : blackVars}>{children}</VariableContextProvider>;
}
