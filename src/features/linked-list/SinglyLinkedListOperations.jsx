import TopicCard from "../../components/TopicCard";
import SinglyLinkedListOperationsClient from "./SinglyLinkedListOperationsClient";

const SinglyLinkedListOperations = () => {
    return (
        <div>
            <TopicCard topicName="Singly Linked List" />

            <SinglyLinkedListOperationsClient />

            <TopicCard topicName="Real-life Use (Singly Linked List)" />
        </div>
    );
};

export default SinglyLinkedListOperations;