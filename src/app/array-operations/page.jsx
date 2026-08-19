import StaticArrayOperations from "../../features/array-operations/StaticArrayOperations";
import DynamicArrayOperations from "../../features/array-operations/DynamicArrayOperations";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Static & Dynamic Array Operations Simulator",
    description:
        "Learn how fixed-size static arrays and auto-resizing dynamic arrays work. Explore memory overflow and array allocations visually.",
    keywords: [
        "static array simulator",
        "dynamic array visualizer",
        "array data structure tool",
        "memory overflow simulation",
    ],
};

export default function Page() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Array Operations",
                    description: metadata.description,
                    path: "/array-operations",
                })}
            />
            <StaticArrayOperations />
            <DynamicArrayOperations />
        </>
    );
}