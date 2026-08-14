import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

/**
 * Central color system for the DSA Simulator.
 *
 * The palette is intentionally calm and educational:
 * - Indigo = primary interaction / focus
 * - Amber = comparison / attention
 * - Red = destructive / swapping
 * - Green = success / completed
 * - Purple = pivot / special element
 * - Orange = active frontier
 *
 * Runtime visualizer components should use useThemeColors()
 * instead of hardcoding colors.
 */

export const lightColors = {
    // Page
    bg: "#F3F4FA",
    surface: "#F9F9FD",
    surfaceElevated: "#FFFFFF",

    // Borders
    border: "#DFE1EC",
    borderStrong: "#C9CCDA",

    // Text
    textPrimary: "#202334",
    textSecondary: "#555B72",
    textMuted: "#858BA0",

    // Brand
    accent: "#4F46C7",

    // Visualizer
    element: "#ECEEF7",
    elementBorder: "#C9CCDA",

    // Algorithm states
    comparing: "#D89A1B",
    swapping: "#D94B45",
    sorted: "#159A70",
    pivot: "#7652C9",
    frontier: "#D97724",
    visited: "#5267C9",
};

export const darkColors = {
    // Page
    bg: "#0D1020",
    surface: "#15192A",
    surfaceElevated: "#1C2134",

    // Borders
    border: "#292E43",
    borderStrong: "#3A4059",

    // Text
    textPrimary: "#ECEEF7",
    textSecondary: "#A5ABC0",
    textMuted: "#70778E",

    // Brand
    accent: "#7C7AF2",

    // Visualizer
    element: "#252A40",
    elementBorder: "#3A4059",

    // Algorithm states
    comparing: "#F2C14E",
    swapping: "#FF746B",
    sorted: "#45D9A5",
    pivot: "#B394F5",
    frontier: "#FFAA67",
    visited: "#788AF0",
};

/**
 * Returns the active palette based on the current theme.
 */
export function useThemeColors() {
    const { theme } = useContext(ThemeContext);

    return theme === "dark" ? darkColors : lightColors;
}