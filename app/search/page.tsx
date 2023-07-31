"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tooltip } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import { PiCaretDoubleUpLight } from "react-icons/pi";

import { Navbar, Question } from "@/components";
import { rankSearchQuestions } from "@/api/search";
import { questions } from "@/dummy/questions";
import { Question as QuestionType } from "@/types";

const findQuestion = (q: string): QuestionType | undefined => {
  const matchedQuestion = questions.find((question) => question.question === q);
  if (!matchedQuestion) {
    return;
  }
  return matchedQuestion;
};

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");
  const originalQuestion = decodeURI(encodedSearchQuery);

  const [questionsInOrder, setQuestionsInOrder] = useState<QuestionType[]>([]);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const result = await rankSearchQuestions(originalQuestion);
        let questionsArray = result.split(",");
        questionsArray = questionsArray.map((question: string) =>
          findQuestion(question)
        );
        setQuestionsInOrder(
          questionsArray.filter(
            (question: QuestionType) => question !== undefined
          ) as QuestionType[]
        );
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [originalQuestion]);

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
    <>
      <Navbar />
      <div className="flex w-full">
        <div className="px-3 w-full">
          <ul role="list" className="divide-y divide-gray-600 w-full">
            {questionsInOrder.map((question, index) => (
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
                    answered={question.isAnswered}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
    </>
  );
};

export default SearchPage;
