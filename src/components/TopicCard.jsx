import { EngDefEx } from "../data/EngDefEx";

const TopicCard = ({ topicName }) => {
  const topic = EngDefEx.find((item) => item.title === topicName);

  if (!topic) {
    return (
      <p className="text-sm text-swapping">
        Topic not found.
      </p>
    );
  }

  return (
    <details className="topicCard">
  <summary className="topicCard-title">
    {topic.title}
  </summary>

  <div className="topicCard-content">
    <p
      className="topicCard-description"
      dangerouslySetInnerHTML={{ __html: topic.definition }}
    />

    <h3 className="topicCard-exampleTitle">
      Example
    </h3>

    <pre className="topicCard-code">
      {topic.exampleCode}
    </pre>
  </div>
</details>
  );
};

export default TopicCard;