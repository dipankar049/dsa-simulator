import HomePage from "../features/HomePage";
import JsonLd from "@/components/JsonLd";
import { softwareApplicationSchema } from "@/lib/seo";

export const metadata = {
  title: "DSA Simulator — Learn Data Structures & Algorithms Visually",
  description: "Interactive visualizations for arrays, linked lists, searching, and sorting algorithms.",
};

export default function Page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema()} />
      <HomePage />
    </>
  );
}