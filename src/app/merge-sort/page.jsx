import MergeSort from "@/features/sort/MergeSort";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Merge Sort Visualizer | Divide & Conquer Simulator",
    description:
        "Watch Merge Sort split an array into halves and merge them back together in sorted order. Perfect visual tool for learning recursive O(n log n) sorting.",
    keywords: [
        "merge sort simulator",
        "divide and conquer visualizer",
        "recursive sorting tool",
    ],
};

export default function Page() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Merge Sort",
                    description: metadata.description,
                    path: "/merge-sort",
                })}
            />
            <MergeSort />
        </>
    );
}