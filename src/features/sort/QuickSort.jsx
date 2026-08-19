import TopicCard from "@/components/TopicCard";
import QuickSortClient from "./QuickSortClient";

const QuickSort = () => {
    return (
        <div>
            <TopicCard topicName="Quick Sort" />
            <QuickSortClient />
            {/* Optional: Add additional static TopicCards or markdown content here */}
            <TopicCard topicName="Real-life Use (Quick Sort)" />
        </div>
    );
};

export default QuickSort;