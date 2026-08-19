import SelectionSort from "../../features/sort/SelectionSort";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Selection Sort Visualizer | Minimum Element Swapping Simulator",
    description:
        "See how Selection Sort scans for the minimum element in an unsorted list and brings it to the front step-by-step.",
    keywords: [
        "selection sort simulator",
        "unsorted array scan animation",
        "linear sorting tool",
    ],
};

export default function Page() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Selection Sort",
                    description: metadata.description,
                    path: "/selection-sort",
                })}
            />
            <SelectionSort />
        </>
    );
}