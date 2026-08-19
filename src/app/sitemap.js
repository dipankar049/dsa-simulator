import { SITE_URL } from "@/lib/seo";

const routes = [
    "",
    "/array-operations",
    "/linked-list-operations",
    "/linear-search",
    "/binary-search",
    "/bubble-sort",
    "/merge-sort",
    "/quick-sort",
    "/selection-sort",
];

export default function sitemap() {
    const lastModified = new Date();
    return routes.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.8,
    }));
}