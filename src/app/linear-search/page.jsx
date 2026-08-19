import LinearSearch from '@/features/search/LinearSearch';
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: 'Linear Search Algorithm Visualizer & Explanation',
    description: 'Learn linear search algorithm with interactive step-by-step visualizations and code examples.',
};

export default function Page() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Linear Search",
                    description: metadata.description,
                    path: "/linear-search",
                })}
            />
            <LinearSearch />
        </>
    );
}