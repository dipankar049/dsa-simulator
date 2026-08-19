// Server component — renders topic definition + example for SEO.
// Only the <details> toggle is isolated in a "use client" wrapper.
import { EngDefEx } from "../data/EngDefEx";
import TopicCardDetails from "./TopicCardDetails";

const TopicCard = ({ topicName }) => {
    const topic = EngDefEx.find((item) => item.title === topicName);

    if (!topic) {
        return <p className="text-sm text-swapping">Topic not found.</p>;
    }

    return (
        <TopicCardDetails>
            <summary className="topicCard-title">{topic.title}</summary>
            <div className="topicCard-content">
                {/* div not p — definition HTML contains block-level <p> tags,
                    nesting them inside <p> is invalid and breaks hydration */}
                <div
                    className="topicCard-description"
                    dangerouslySetInnerHTML={{ __html: topic.definition }}
                />
                <h3 className="topicCard-exampleTitle">Example</h3>
                <pre className="topicCard-code">{topic.exampleCode}</pre>
            </div>
        </TopicCardDetails>
    );
};

export default TopicCard;
