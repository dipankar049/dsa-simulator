import BubbleSort from "@/features/sort/BubbleSort";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Bubble Sort Visualizer | Interactive Sorting Simulator",
    description:
        "Simulate the bubble sort algorithm swapping adjacent elements step-by-step. Perfect visual aid for learning O(n²) sorting mechanics.",
    keywords: [
        "bubble sort simulator",
        "interactive sorting visualizer",
        "adjacent element swapping",
    ],
};

export default function Page() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Bubble Sort",
                    description: metadata.description,
                    path: "/bubble-sort",
                })}
            />
            <BubbleSort />
        </>
    );
}