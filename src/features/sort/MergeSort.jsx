import TopicCard from "@/components/TopicCard";
import MergeSortClient from "./MergeSortClient";

const MergeSort = () => {
    return (
        <div>
            <TopicCard topicName="Merge Sort" />
            <MergeSortClient />
            <TopicCard topicName="Real-life Use (Merge Sort)" />
        </div>
    );
};

export default MergeSort;