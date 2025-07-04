import { EngDefEx } from '../data/EngDefEx';
import { ThemeContext } from '../context/ThemeContext';
import { useContext } from 'react';

const TopicCard = ({ topicName }) => {
  const { theme } = useContext(ThemeContext);
  const topic = EngDefEx.find((item) => item.title === topicName);

  if (!topic) {
    return <p className="text-red-500">Topic not found.</p>;
  }

  // const cardTheme = theme === "light" ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-100';
  // const subTextTheme = theme === "light" ? 'text-gray-700' : 'text-gray-400';

  return (
    <details
      // className={`my-6 p-4 sm:p-5 md:p-6 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'} rounded-lg shadow-md`}
      className={`my-4 sm:my-6 p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-md`}
    >
      <summary className="text-base sm:text-lg md:text-xl font-semibold cursor-pointer">
        {topic.title}
      </summary>

      <p
        className="mt-2 text-gray-700	dark:text-gray-200 text-sm sm:text-base md:text-lg"
        dangerouslySetInnerHTML={{ __html: topic.definition }}
      />

      <h3 className="text-base sm:text-lg md:text-xl font-semibold mt-4">Example</h3>

      <pre className="bg-gray-800 dark:bg-gray-900 text-white p-3 sm:p-4 text-xs sm:text-sm md:text-base rounded-md whitespace-pre-wrap mt-2">
        {topic.exampleCode}
      </pre>
    </details>
  );

};

export default TopicCard;
