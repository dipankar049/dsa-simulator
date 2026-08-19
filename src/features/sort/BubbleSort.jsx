import TopicCard from "@/components/TopicCard";
import BubbleSortClient from "./BubbleSortClient";

const BubbleSort = () => {
    return (
        <div>
            <TopicCard topicName="Bubble Sort" />
            <BubbleSortClient />
            <TopicCard topicName="Real-life Use (Bubble Sort)" />
        </div>
    );
};

export default BubbleSort;