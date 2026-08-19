import TopicCard from "../../components/TopicCard";
import DynamicArrayOperationsClient from "./DynamicArrayOperationsClient";

export default function DynamicArrayOperations() {
    return (
        <div>
            <TopicCard topicName="Dynamic Array" />

            <DynamicArrayOperationsClient />

            <TopicCard topicName="Real-Life Use(Dynamic Array)" />
        </div>
    );
}