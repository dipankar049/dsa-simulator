import { EngDefEx } from '../data/EngDefEx';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const TopicCard = ({ topicName }) => {
    const { theme } = useContext(ThemeContext);
    const topic = EngDefEx.find((item) => item.title === topicName);

    if (!topic) {
        return <p className="text-red-500">Topic not found.</p>;
    }

    return (
        <details
        className={`my-6 p-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'} rounded-lg shadow-md`}
        >
        <summary>{topic.title}</summary>
        <p
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: topic.definition }}
        />

        {/* {topic.diagram && <img src={topic.diagram} alt="Diagram" className="mt-4" />} */}

        <h3 className="text-xl font-semibold mt-4">Example</h3>
        <pre className="bg-gray-800 text-white p-4 rounded-md whitespace-pre-wrap">
            {topic.exampleCode}
        </pre>
        </details>
    );
};

export default TopicCard;
