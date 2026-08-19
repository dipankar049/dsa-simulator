import BinarySearch from "../../features/search/BinarySearch";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Binary Search Algorithm Simulator",
    description:
        "Visualize how binary search divides sorted arrays in half recursively. Learn log(n) divide-and-conquer search concepts interactively.",
    keywords: [
        "binary search visualizer",
        "log n algorithm simulation",
        "sorted array search tool",
    ],
};

export default function Page() {
    return (
    <>
      <JsonLd
        data={learningResourceSchema({
          name: "Binary Search",
          description: metadata.description,
          path: "/binary-search",
        })}
      />
      <BinarySearch />
    </>
  );
}