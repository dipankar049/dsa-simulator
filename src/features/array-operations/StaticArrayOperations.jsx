import TopicCard from "../../components/TopicCard";
import StaticArrayOperationsClient from "./StaticArrayOperationsClient";

const StaticArrayOperations = () => {
    return (
        <div>
            <TopicCard topicName="Array" />
            <TopicCard topicName="Static Array" />

            <StaticArrayOperationsClient />

            <TopicCard topicName="Real-life Use(Static Array)" />
        </div>
    );
};

export default StaticArrayOperations;