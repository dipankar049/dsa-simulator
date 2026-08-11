import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { ThemeContext } from "../context/ThemeContext";

export default function Header({ toggleSidebar }) {
  const { theme, updateTheme } = useContext(ThemeContext);
  const toggleTheme = () => {
    updateTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="fixed w-full h-16 bg-surface border-b border-border text-ink flex items-center px-6 shadow-sm z-20">
      {/* Hamburger menu - visible on small screens */}
      <button
        className="md:hidden mr-4 p-1 rounded-md text-ink-secondary hover:text-accent hover:bg-element transition-colors"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Logo */}
      <div className="font-bold text-xl sm:text-2xl font-serif text-accent">
        <Link to="/">DSA Simulator</Link>
      </div>

      {/* Right icons */}
      <div className="ml-auto flex gap-4 items-center">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-full hover:bg-element transition-colors"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon className="w-6 h-6 text-frontier" />
          ) : (
            <MoonIcon className="w-5 h-5 text-ink-secondary" />
          )}
        </button>
        <a
          href="https://github.com/dipankar049"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-secondary hover:text-accent transition-colors"
        >
          <FaGithub className="text-2xl" />
        </a>
        <a
          href="https://www.linkedin.com/in/dipankar049/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-secondary hover:text-accent transition-colors"
        >
          <FaLinkedin className="text-2xl" />
        </a>
      </div>
    </header>
  );
}