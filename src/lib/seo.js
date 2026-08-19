// Central place for anything shared across metadata, sitemap.js, robots.js,
// and JSON-LD so the domain only needs to change in one spot.

// TODO: replace with your real production domain (no trailing slash).
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://dsa-simulator-three.vercel.app";

export const SITE_NAME = "DSA Simulator";

export function learningResourceSchema({ name, description, path }) {
    return {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name,
        description,
        url: `${SITE_URL}${path}`,
        isPartOf: {
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
        },
        learningResourceType: "Interactive Simulation",
        educationalLevel: "Beginner",
        about: {
            "@type": "Thing",
            name: "Data Structures and Algorithms",
        },
        inLanguage: "en",
    };
}

export function softwareApplicationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any (Web Browser)",
        description:
            "Interactive visual simulator for learning data structures and algorithms.",
        url: SITE_URL,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    };
}