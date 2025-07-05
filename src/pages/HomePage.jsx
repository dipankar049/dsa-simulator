import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { useTranslate } from '../assets/TranslationObj';
import { ThemeContext } from '../context/ThemeContext';

export default function HomePage({language}) {

  const translate = useTranslate(language);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="absolute inset-0 w-full min-h-[92vh] pt-[200px] sm:pt-16 flex flex-col items-center justify-center bg-white text-gray-800 dark:bg-gray-700 dark:text-white">
      {/* Welcome Section */}
      <section className="px-[10%] text-center py-4">
        <h1 className="text-4xl font-bold text-blue-500 dark:text-cyan-300">Welcome to DSA Simulator {"{ }"} </h1>
        <p className="mt-4 text-lg">
          Experience the magic of learning Data Structures and Algorithms with intuitive visualizations, practical examples, and interactive tools.
        </p>
        {/* {translate && <p>{translate.greeting}</p>} */}
      </section>

      {/* Features Section */}
      <section className="w-full px-[10%] grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {[
          { title: "Array Operations", path: "/arrayOp" },
          { title: "Linked List Operations", path: "/listOp" },
          { title: "Linear & Binary Search", path: "/linSearch" },
          { title: "Sorting Algorithms", path: "/bubbleSort" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="p-4 border rounded-lg bg-blue-50 hover:bg-blue-200 text-blue-600 hover:text-blue-800 dark:bg-gray-800 dark:text-white transition divAnimate"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
          </Link>
        ))}
      </section>

      {/* Call-to-Action */}
      <section className="px-[10%]  bg-white dark:bg-gray-700 text-center py-4 sm:my-10">
        <p className="text-lg">
          Ready to sharpen your skills? Explore our collection of interactive DSA tools and master algorithms like never before!
        </p>
        <Link
          to="/arrayOp"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg btnAnimate"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}