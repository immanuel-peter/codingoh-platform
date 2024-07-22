"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Spin } from "antd";
import { PiCaretDoubleUpLight } from "react-icons/pi";

import { Navbar, Question, FAB } from "@/components";
import { semanticSearch } from "@/api/search";
import { Question as QuestionType } from "@/types";

// How can I let each id correspond to a unique set of rows in MySQL?

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams ? searchParams.get("q") : null;
  const encodedSearchQuery = encodeURI(searchQuery || "");
  const originalQuestion = decodeURI(encodedSearchQuery);

  const [loading, setLoading] = useState<boolean>(false);
  const [questionsInOrder, setQuestionsInOrder] = useState<QuestionType[]>([]);
  const [showScrollTopButton, setShowScrollTopButton] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const result = await semanticSearch(originalQuestion);
        console.log(result);
        setQuestionsInOrder(result as QuestionType[]);
        setLoading(false);
        console.log(questionsInOrder);
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
      {loading ? (
        <>
          <Navbar />
          <div className="flex justify-center items-center h-screen">
            <Spin size="large" />
          </div>
        </>
      ) : (
        <>
          <Navbar />
          <div className="flex w-full">
            <div className="px-3 w-full">
              <ul role="list" className="divide-y divide-gray-600 w-full">
                {questionsInOrder.map((question, index) => (
                  <li key={index}>
                    <Link
                      href={`/questions/${question.id}`}
                      className={`flex justify-between gap-x-6 py-5 ${question.answer ? "bg-green-300" : null}`}
                    >
                      <Question
                        key={question.id}
                        question={question.question ?? ""}
                        asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
                        answered={question.answer ?? false}
                        contributors={question.contributors || []}
                        date={
                          question.created_at
                            ? new Date(question.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : ""
                        }
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
          <FAB />
        </>
      )}
    </>
  );
};

export default SearchPage;
