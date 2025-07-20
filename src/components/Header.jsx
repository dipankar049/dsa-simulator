import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { ThemeContext } from "../context/ThemeContext";

export default function Header({ toggleSidebar }) {
  const { theme, updateTheme } = useContext(ThemeContext);
  const toggleTheme = () => {
    updateTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="fixed w-full h-16 bg-blue-600 dark:bg-blue-950 text-white flex items-center px-6 shadow-md z-20">
      {/* Hamburger menu - visible on small screens */}
      <button
        className="md:hidden mr-4 text-2xl"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      {/* Logo */}
      <div className="font-bold text-xl sm:text-2xl font-serif">
        <Link to="/">DSA Simulator</Link>
      </div>

      {/* Right icons */}
      <div className="ml-auto flex gap-4 items-center">
        <button
          onClick={toggleTheme}
          className="p-1 rounded-full text-xl"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <SunIcon className="w-8 h-8 text-yellow-400" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-800" />
          )}
        </button>
        <a href="https://github.com/dipankar049" target="_blank" rel="noopener noreferrer">
          <FaGithub className="text-2xl hover:text-gray-300" />
        </a>
        <a href="https://www.linkedin.com/in/dipankar049/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="text-2xl hover:text-gray-300" />
        </a>
      </div>
    </header>
  );
}
