"use client";

import React, { useState, useEffect } from "react";
import {
  FaCode,
  FaSun,
  FaRegSun,
  FaRegCircleUser,
  FaInbox,
} from "react-icons/fa6";
import Link from "next/link";

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
              CodingOH
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
        <nav className="p-3 flex flex-row items-center justify-evenly">
          <button onClick={() => setSunClicked(!sunClicked)}>
            {sunClicked ? (
              <FaRegSun className="text-xl mr-3" />
            ) : (
              <FaSun className="text-xl mr-3" />
            )}
          </button>
          <Link href="/" className="ml-3 p-3">
            <FaRegCircleUser className="text-3xl text-cyan-600" />
          </Link>
          <Link href="/" className="ml-3 p-3">
            <FaInbox className="text-3xl" />
          </Link>
        </nav>
      </header>
      <hr className="border-solid border-black border-[1px]" />
    </>
  );
};

export default Navbar;
