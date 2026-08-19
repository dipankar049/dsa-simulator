import SinglyLinkedListOperations from "../../features/linked-list/SinglyLinkedListOperations";
import DoublyLinkedListOperations from "../../features/linked-list/DoublyLinkedListOperations";
import JsonLd from "@/components/JsonLd";
import { learningResourceSchema } from "@/lib/seo";

export const metadata = {
    title: "Singly & Doubly Linked List Operations Simulator",
    description:
        "Simulate node insertion, deletion, and pointer link updates visually in singly and doubly linked list data structures.",
    keywords: [
        "singly linked list simulator",
        "doubly linked list visualizer",
        "linked list operations",
        "data structures visualizer",
    ],
};

export default function LinkedListOperationsPage() {
    return (
        <>
            <JsonLd
                data={learningResourceSchema({
                    name: "Linked List Operations",
                    description: metadata.description,
                    path: "/linked-list-operations",
                })}
            />
            <SinglyLinkedListOperations />
            <DoublyLinkedListOperations />
        </>
    );
}