import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import { useTranslate } from '../assets/TranslationObj';
import { ThemeContext } from '../context/ThemeContext';
import { Helmet } from 'react-helmet-async';
// import AnimatedCard from '../components/card/AnimatedCard';

export default function HomePage({language}) {

  const translate = useTranslate(language);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="absolute inset-0 w-full min-h-[92vh] pt-[200px] sm:pt-16 flex flex-col items-center justify-center text-gray-800 bg-theme-gradient dark:text-white">
      <Helmet>
        <title>DSA Simulator | Interactive Data Structures & Algorithms Visualizer</title>
        <meta name="description" content="Master Data Structures and Algorithms visually. Interactively simulate arrays, linked lists, searching, and sorting algorithms in real time." />
        <meta name="keywords" content="dsa simulator, algorithm visualizer, learn data structures visually, code simulation tool" />
      </Helmet>
      {/* Welcome Section */}
      <section className="px-[10%] text-center py-4">
        <p className="text-3xl [text-shadow:2px_4px_6px_rgba(0,0,0,0.2)] sm:text-4xl font-semibold sm:font-bold text-blue-500 dark:text-cyan-300">Welcome to DSA Simulator {"{ }"} </p>
        <p className="mt-4 text-lg">
          Experience the magic of learning Data Structures and Algorithms with intuitive visualizations, practical examples, and interactive tools.
        </p>
        {/* {translate && <p>{translate.greeting}</p>} */}
      </section>
      {/* <AnimatedCard /> */}

      {/* Features Section */}
      <section className="w-full px-[10%] grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {[
          { title: "Array Operations", path: "/array-operations" },
          { title: "Linked List Operations", path: "/linked-list-operations" },
          { title: "Linear & Binary Search", path: "/linear-search" },
          { title: "Sorting Algorithms", path: "/bubble-sort" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="p-4 flex justify-center border rounded-lg bg-blue-200 hover:bg-blue-200 text-blue-800 hover:text-blue-800 dark:bg-gray-800 dark:text-white shadow-xl transition divAnimate"
          >
            <h3 className="text-lg sm:text-xl font-semibold">{item.title}</h3>
          </Link>
        ))}
      </section>

      {/* Call-to-Action */}
      <section className="px-[10%] text-center py-4 sm:my-10">
        <p className="text-lg">
          Ready to sharpen your skills? Explore our collection of interactive DSA tools and master algorithms like never before!
        </p>
        <Link
          to="/array-operations"
          className="text-base inline-block mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg btnAnimate"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}