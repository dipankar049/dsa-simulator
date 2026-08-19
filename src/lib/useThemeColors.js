"use client";

import { useContext, useMemo } from "react";
import { ThemeContext } from "../context/ThemeContext";

const CSS_VAR_MAP = {
    bg: "--color-bg",
    surface: "--color-surface",
    surfaceElevated: "--color-surface-elevated",
    border: "--color-border",
    borderStrong: "--color-border-strong",
    textPrimary: "--color-text-primary",
    textSecondary: "--color-text-secondary",
    textMuted: "--color-text-muted",
    accent: "--color-accent",
    element: "--color-element",
    elementBorder: "--color-element-border",
    comparing: "--color-comparing",
    swapping: "--color-swapping",
    sorted: "--color-sorted",
    pivot: "--color-pivot",
    frontier: "--color-frontier",
    visited: "--color-visited",
    comparingText: "--color-comparing-text",
    swappingText: "--color-swapping-text",
    sortedText: "--color-sorted-text",
    pivotText: "--color-pivot-text",
    frontierText: "--color-frontier-text",
    visitedText: "--color-visited-text",
};

function readCssColors() {
    if (typeof window === "undefined") return null;
    const styles = getComputedStyle(document.documentElement);
    const out = {};
    for (const key in CSS_VAR_MAP) {
        const raw = styles.getPropertyValue(CSS_VAR_MAP[key]).trim();
        if (raw) out[key] = `rgb(${raw.split(/\s+/).join(", ")})`;
    }
    return out;
}

export function useThemeColors() {
    const { theme } = useContext(ThemeContext);
    return useMemo(() => readCssColors(), [theme]);
}