import TopicCard from "../../components/TopicCard";
import DoublyLinkedListOperationsClient from "./DoublyLinkedListOperationsClient";

export default function DoublyLinkedListOperations() {
    return (
        <div>
            <TopicCard topicName="Doubly Linked List" />

            <DoublyLinkedListOperationsClient />

            <TopicCard topicName="Real-life Use (Doubly Linked List)" />
        </div>
    );
}