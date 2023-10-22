"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLightbulb, FaPlus, FaCaretUp } from "react-icons/fa6";
import { PiCaretDoubleUpLight } from "react-icons/pi";
import { Tooltip } from "@mui/material";

import { Navbar, Card, Question, FAB } from "@/components";
import { users, questions } from "@/dummy/questions";
import { convertToComparableDate } from "@/utils";

export default function Home() {
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const onlineUsers = users.filter((user) => user.isOnline);

  const latestQuestions = questions.slice().sort((a, b) => {
    const aComparableDate: Date = convertToComparableDate(a.date, a.time);
    const bComparableDate: Date = convertToComparableDate(b.date, b.time);
    return bComparableDate.getTime() - aComparableDate.getTime(); // Compare in descending order
  });
  const unansweredQuestions = latestQuestions.filter(
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
              <li key={index} className="hover:bg-slate-100">
                <Link
                  href={`/questions/${question.id}`}
                  className="flex justify-between gap-x-6 py-5"
                >
                  <Question
                    question={question.question}
                    asker={question.asker.name}
                    contributors={question.contributors || []}
                    date={question.date}
                    extraStyles={["cursor-pointer"]}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="basis-1/4 items-center justify-center">
          {onlineUsers.length !== 0 ? (
            <div>
              <div className="flex items-center justify-center mt-3">
                <h1 className="font-bold text-emerald-600 mr-5">{`${onlineUsers.length} online users`}</h1>
                <Link href="/users/all" className="text-base text-sky-600 ml-5">
                  View All &rarr;
                </Link>
              </div>
              {onlineUsers.map((user, index) => (
                <Link href={`/users/${user.id}`}>
                  <Card
                    key={index}
                    name={user.name}
                    position={user.position || "Undefined"}
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

      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 left-1/2 z-10 bg-gray-500 opacity-50 text-white font-semibold w-8 h-8 rounded-full flex items-center justify-center animate-bounce ${
          showScrollTopButton ? "visible" : "invisible"
        }`}
      >
        <PiCaretDoubleUpLight className="bg-inherit self-center" />
      </button>
      <FAB />
    </main>
  );
}
