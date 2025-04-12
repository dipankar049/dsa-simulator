import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";
import { slide as Menu } from "react-burger-menu";

export default function Header({changeLanguage}) {
  const [themeOpen, setThemeOpen] = useState(false); // To toggle the theme options
  const [languageOpen, setLanguageOpen] = useState(false); // To toggle the theme options
  const [fontOpen, setFontOpen] = useState(false); // To toggle the theme options
  const [isOpen, setIsOpen] = useState(false); // for hamberger menu

  const themeRef = useRef();
  const fontRef = useRef();
  const languageRef = useRef();

  const { theme,  updateTheme } = useContext(ThemeContext);

  const handleThemeChange = (newTheme) => {
    updateTheme(newTheme);
  }

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setThemeOpen(false);
      } else if (fontRef.current && !fontRef.current.contains(event.target)) {
        setFontOpen(false);
      } else if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed w-full h-16 bg-blue-600 text-white flex items-center px-6 shadow-md z-20">
      <div className="flex items-center gap-6">
        <div className="font-bold text-2xl font-serif">
          <Link to="/">DSA Visualizer</Link>
        </div>
        <div>
        <button
          className="fixed right-4 top-4 z-50 text-3xl bg-gray-900 text-white p-2 rounded-md md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
          {/* <Menu isOpen={isOpen} onStateChange={({ isOpen }) => setIsOpen(isOpen)}>
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </Menu> */}
        </div>
        <nav className="md:flex items-center gap-6 text-lg">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="bg-blue-600 text-white py-2 rounded-md"
            >
              Language
            </button>
            {languageOpen && (
              <div className="z-50 absolute top-full mt-2 bg-blue-600 text-white rounded-md shadow-md w-32"
                ref={languageRef}
              >
                <button className="w-full px-4 py-2 text-left hover:bg-blue-500"
                 onClick={() => {changeLanguage('bn')}}
                >
                  Bengali
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-blue-500"
                 onClick={() => {changeLanguage('hi')}}
                >
                  Hindi
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-blue-500"
                 onClick={() => {changeLanguage('en')}}
                >
                  English
                </button>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setFontOpen(!fontOpen)}
              className="bg-blue-600 text-white py-2 rounded-md"
            >
              Font Size
            </button>
            {fontOpen && (
              <div className="z-50 absolute top-full mt-2 bg-blue-600 text-white rounded-md shadow-md w-32"
                ref={fontRef}
              >
                <button className="w-full px-4 py-2 text-left hover:bg-blue-500">
                  Small
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-blue-500">
                  medium
                </button>
                <button className="w-full px-4 py-2 text-left hover:bg-blue-500">
                  Large
                </button>
              </div>
            )}
          </div>

          {/* Theme Button */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="bg-blue-600 text-white py-2 rounded-md"
            >
              Theme
            </button>
            {themeOpen && (
              <div className="z-50 absolute top-full mt-2 bg-blue-600 text-white rounded-md shadow-md w-32"
                ref={themeRef}
              >
                <button 
                 className="w-full px-4 py-2 text-left hover:bg-blue-500"
                 onClick={() => { handleThemeChange('light')} }
                >
                  Light
                </button>
                <button
                 className="w-full px-4 py-2 text-left hover:bg-blue-500"
                 onClick={() => { handleThemeChange('dark')}}
                >
                  Dark
                </button>
                <button 
                 className="w-full px-4 py-2 text-left hover:bg-blue-500"
                 onClick={() => { handleThemeChange('blue')} }
                >
                  Blue
                </button>
              </div>
            )}
          </div>

          {/* Share Link */}
          <Link
            to="/share"
            className="hover:text-blue-200 transition duration-200"
          >
            Share
          </Link>
        </nav>
      </div>
      <div className="ml-auto">
        <Link
          to="/learn-more"
          className="bg-blue-800 px-4 py-2 rounded-lg text-sm hover:bg-blue-900 transition duration-200"
        >
          Learn More
        </Link>
      </div>
    </header>
  );
}
