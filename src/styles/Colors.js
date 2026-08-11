import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Mirrors src/components/styles/theme.css exactly. Tailwind utility classes
 * (bg-comparing, bg-sorted, etc.) cover static markup, but visualizer
 * components that compute an element's state at runtime — e.g.
 * `array[i].state === "comparing"` inside a .map() — often need an actual
 * hex value for inline style, an SVG fill, or a canvas draw call. Use
 * `useThemeColors()` for that instead of hardcoding hex in each page.
 */
export const lightColors = {
    bg: "#FAFBFD",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    border: "#E1E5EE",
    borderStrong: "#C7CEDC",
    textPrimary: "#171B24",
    textSecondary: "#565E75",
    textMuted: "#8991A8",
    accent: "#3854D6",
    element: "#E7EAF2",
    elementBorder: "#C7CEDC",
    comparing: "#E8A324",
    swapping: "#E14A3D",
    sorted: "#1CA672",
    pivot: "#7C4FE0",
    frontier: "#E5761F",
    visited: "#3854D6",
};

export const darkColors = {
    bg: "#0B0E14",
    surface: "#151A23",
    surfaceElevated: "#1C2230",
    border: "#232838",
    borderStrong: "#2E3548",
    textPrimary: "#E8EAF0",
    textSecondary: "#9AA2B8",
    textMuted: "#626B85",
    accent: "#5B7CFF",
    element: "#2B3244",
    elementBorder: "#3A4358",
    comparing: "#FFC857",
    swapping: "#FF6B5D",
    sorted: "#3FDDA0",
    pivot: "#B892FF",
    frontier: "#FF9F5A",
    visited: "#5B7CFF",
};

/** Returns the active palette object based on the current ThemeContext. */
export function useThemeColors() {
    const { theme } = useContext(ThemeContext);
    return theme === "dark" ? darkColors : lightColors;
}