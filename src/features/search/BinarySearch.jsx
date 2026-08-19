import TopicCard from "../../components/TopicCard";
import BinarySearchClient from "./BinarySearchClient";

const BinarySearch = () => {
    return (
        <div>
            <TopicCard topicName="Binary Search" />

            <BinarySearchClient />

            <TopicCard topicName="Real-life Use (Binary Search)" />
        </div>
    );
};

export default BinarySearch;