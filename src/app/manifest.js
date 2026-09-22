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
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
