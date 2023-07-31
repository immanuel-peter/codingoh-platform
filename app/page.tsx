"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLightbulb, FaPlus, FaCaretUp } from "react-icons/fa6";
import { PiCaretDoubleUpLight } from "react-icons/pi";
import { Tooltip } from "@mui/material";

import { Navbar, Card, Question } from "@/components";
import { users, questions } from "@/dummy/questions";

export default function Home() {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const onlineUsers = users.filter((user) => user.isOnline);
  const unansweredQuestions = questions.filter(
    (question) => !question.isAnswered
  );

  const handleScroll = () => {
    setShowScrollTopButton(window.scrollY > 0);
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main>
      <Navbar />
      <div className="flex">
        <div className="basis-3/4 px-3">
          <ul role="list" className="divide-y divide-gray-600">
            {unansweredQuestions.map((question, index) => (
              <li key={index}>
                <Link
                  href={`/questions/${question.id}`}
                  className="flex justify-between gap-x-6 py-5"
                >
                  <Question
                    question={question.question}
                    asker={question.asker.name}
                    contributors={question.contributors}
                    date={question.date}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="basis-1/4 items-center justify-center">
          {onlineUsers.length !== 0 ? (
            <div>
              <h1 className="flex items-center justify-center font-bold mt-3 text-emerald-600">{`${onlineUsers.length} online users`}</h1>
              {onlineUsers.map((user, index) => (
                <Link href={`/users/${user.id}`}>
                  <Card
                    key={index}
                    name={user.name}
                    position={user.position}
                    languages={user.codingLanguages}
                    isOnline={user.isOnline}
                    extraStyles="last-of-type:mb-3"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <h1 className="flex items-center justify-center font-bold mt-3 text-black">
              No users online
            </h1>
          )}
        </div>
      </div>
      <button className="fixed bottom-4 left-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-md">
        <div className="flex flex-row items-center justify-center bg-inherit text-inherit">
          <FaLightbulb className="bg-inherit text-inherit mr-2" />
          Help CodingOH
        </div>
      </button>
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 left-1/2 z-10 bg-gray-500 opacity-50 text-white font-semibold w-8 h-8 rounded-full flex items-center justify-center ${
          showScrollTopButton ? "visible" : "invisible"
        }`}
      >
        <PiCaretDoubleUpLight className="bg-inherit self-center" />
      </button>
      <Tooltip title="Add Question" placement="left">
        <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-5 shadow-md">
          <FaPlus className="bg-inherit text-inherit text-2xl" />
        </button>
      </Tooltip>
    </main>
  );
}
