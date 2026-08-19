import TopicCard from '@/components/TopicCard';
import LinearSearchClient from './LinearSearchClient';

export default function LinearSearch() {
    return (
        <div className="space-y-6">
            {/* 1. Server Rendered TopicCard (100% SEO friendly) */}
            <TopicCard topicName="Linear Search" />

            {/* 2. Interactive Animation UI */}
            <LinearSearchClient />

            {/* 3. Server Rendered Real-life Use Case */}
            <TopicCard topicName="Real-life Use (Linear Search)" />
        </div>
    );
}