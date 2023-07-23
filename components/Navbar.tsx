"use client";

import React, { useState, useEffect } from "react";
import {
  FaCode,
  FaSun,
  FaRegSun,
  FaRegCircleUser,
  FaUser,
} from "react-icons/fa6";
import Link from "next/link";
import { Menu } from "@headlessui/react";

import { Question, questions } from "@/dummy/questions";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [sunClicked, setSunClicked] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<Question[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    const filteredQueries = questions.filter((question) =>
      question.question.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestedQueries(filteredQueries);
  };

  useEffect(() => {
    // Function to handle click events outside the input and suggestions list
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click target is outside the input and suggestions list
      if (
        target &&
        !target.closest(".suggestions-wrapper") &&
        !target.closest(".input-wrapper")
      ) {
        // Clear the suggested queries
        setSuggestedQueries([]);
      }
    };

    // Add the click event listener when the component mounts
    window.addEventListener("click", handleClickOutside);

    // Remove the click event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestedQueries([]);
  };

  return (
    <>
      <header className="flex flex-row justify-between items-center p-2">
        <nav className="p-3">
          <Link href="/" className="flex flex-row items-center ml-[10px]">
            <FaCode className="text-3xl" />
            <span className="text-2xl text-blue-700 font-bold ml-2">
              Coding OH
            </span>
          </Link>
        </nav>
        <div className="relative w-7/12">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="What is your query?"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          {suggestedQueries.length > 0 && (
            <ul className="absolute z-10 bg-white mt-2 w-full border border-gray-300 rounded-lg shadow-lg">
              {suggestedQueries.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.question)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                >
                  {suggestion.question}
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav className="p-3 flex flex-row items-center justify-between">
          <button onClick={() => setSunClicked(!sunClicked)}>
            {sunClicked ? (
              <FaRegSun className="text-xl mr-4" />
            ) : (
              <FaSun className="text-xl mr-4" />
            )}
          </button>
          <Link href="/" className="flex flex-row items-center ml-3">
            <div className="text-base font-medium p-3 border-solid border-blue-600 border-2 bg-blue-500 rounded-3xl">
              Contribute
            </div>
          </Link>
          <Link href="/" className="flex flex-row items-center ml-3">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button>
                <FaRegCircleUser className="text-3xl ml-3 text-cyan-600" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-slate-300 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  <a
                    href="/"
                    className="flex items-center justify-center px-2 py-2 text-sm"
                  >
                    Profile
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a
                    href="/"
                    className="text-red-500 flex items-center justify-center px-2 py-2 text-sm"
                  >
                    Log Out
                  </a>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </Link>
        </nav>
      </header>
      <hr className="border-solid border-black border-[1px]" />
    </>
  );
};

export default Navbar;
