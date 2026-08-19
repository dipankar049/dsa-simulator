import QuickSort from "@/features/sort/QuickSort";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Quick Sort Visualizer | Pivot Partitioning Simulator",
    description:
        "See how Quick Sort picks a pivot and partitions the array around it, recursively, until the array is sorted.",
    keywords: [
        "quick sort simulator",
        "pivot partitioning visualizer",
        "recursive sorting tool",
    ],
};

export default function Page() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Quick Sort",
                    description: metadata.description,
                    path: "/quick-sort",
                })}
            />
            <QuickSort />
        </>
    );
}