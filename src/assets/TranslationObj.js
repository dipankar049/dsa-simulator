import { useMemo } from "react";

const translation = {
    en: {
        greeting: "Hello, how are you?",
        welcome: "Welcome to our platform!",
    },
    bn: {
        greeting: "হ্যালো, আপনি কেমন আছেন?",
        welcome: "আমাদের প্ল্যাটফর্মে আপনাকে স্বাগতম!",
    },
};

export function useTranslate(language) {
    return useMemo(() => translation[language], [language]);
}