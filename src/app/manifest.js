import { SITE_NAME } from "@/lib/seo";

export default function manifest() {
    return {
        name: SITE_NAME,
        short_name: "DSA Sim",
        description:
            "Interactive visual simulator for learning data structures and algorithms.",
        start_url: "/",
        display: "standalone",
        background_color: "#0b0e14",
        theme_color: "#3854d6",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any maskable",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
        ],
    };
}
