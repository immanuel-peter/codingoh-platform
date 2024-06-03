"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaLightbulb, FaPlus, FaCaretUp } from "react-icons/fa6";
import { PiCaretDoubleUpLight } from "react-icons/pi";
import { Tooltip } from "@mui/material";
import { createClient } from "@/utils/supabase/client";

import { Navbar, Card, Question, FAB } from "@/components";
import { Coder, Question as QuestionType } from "@/types";

export default function Home() {
  const supabase = createClient();
  const [supabaseUser, setSupabaseUser] = useState<{
    id: string;
    [key: string]: any;
  }>();
  const [dev, setDev] = useState<Coder | null>();
  const [dbQuestions, setDbQuestions] = useState<QuestionType[]>([]);
  const [coders, setCoders] = useState<Coder[]>([]);
  console.log(dbQuestions, dbQuestions.length);
  console.log(coders, coders.length);

  useEffect(() => {
    const fetchDev = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (user) {
        setSupabaseUser(user);
        const { data: dev, error: devError } = await supabase
          .from("coders")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        if (dev) {
          setDev(dev);
        }
      } else {
        console.error(userError);
      }
    };
    const fetchDbQuestions = async () => {
      // Fetch all questions
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("*");

      if (questionsError) {
        throw questionsError;
      }

      // Fetch all users
      const { data: users, error: usersError } = await supabase
        .from("coders")
        .select("*");

      if (usersError) {
        throw usersError;
      }

      // Fetch all comments
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("*");

      if (commentsError) {
        throw commentsError;
      }

      // Create a map of users for quick lookup
      const userMap = new Map(users.map((user) => [user.id, user]));

      // Create a unique list of contributors for each question
      const updatedQuestions = questions.map((question) => {
        const asker = userMap.get(question.asker) || question.asker;

        // Get unique contributors for this question
        const contributorSet = new Set();
        comments
          .filter((comment) => comment.question === question.id)
          .forEach((comment) => {
            const contributorJson = JSON.stringify({
              user_id: asker,
              question_id: question,
            });
            contributorSet.add(contributorJson);
          });

        // Convert the set back to an array of unique contributors
        const contributors = Array.from(contributorSet).map((contributorJson) =>
          JSON.parse(contributorJson as string)
        );

        return {
          ...question,
          asker,
          contributors,
        };
      });

      // Apply your existing filter logic
      const finalQuestions = updatedQuestions.filter(
        (question) => Math.random() > 0.5
      );

      setDbQuestions(finalQuestions);
    };
    const fetchCoders = async () => {
      const { data: coders, error } = await supabase.from("coders").select("*");
      if (coders) {
        const updatedCoders = coders.filter((coder) => Math.random() > 0.5);
        setCoders(updatedCoders);
      } else {
        console.error(error);
      }
    };
    fetchDev();
    fetchDbQuestions();
    fetchCoders();
  }, []);

  const [showScrollTopButton, setShowScrollTopButton] =
    useState<boolean>(false);

  const latestQuestions = dbQuestions.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateB.getTime() - dateA.getTime(); // Newest to oldest
  });

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
          {latestQuestions.length === 0 ? (
            <h1 className="flex items-center justify-center font-bold mt-3 text-black">
              No unanswered questions
            </h1>
          ) : (
            <ul role="list" className="divide-y divide-gray-600">
              {latestQuestions.map((question, index) => (
                <li key={index} className="hover:bg-slate-100">
                  <Link
                    href={`/questions/${question.id}`}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <Question
                      question={question.question}
                      asker={`${question.asker.first_name} ${question.asker.last_name}`}
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
                      extraStyles={["cursor-pointer"]}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="basis-1/4 items-center justify-center">
          {coders.length !== 0 ? (
            <div>
              <div className="flex items-center justify-center mt-3">
                <h1 className="font-bold text-emerald-600 mr-5">{`${coders.length} online users`}</h1>
                <Link href="/users/all" className="text-base text-sky-600 ml-5">
                  View All &rarr;
                </Link>
              </div>
              {coders.map((coder, index) => (
                <Link href={`/users/${coder?.auth_id}`}>
                  <Card
                    id={coder.id}
                    key={index}
                    name={`${coder.first_name} ${coder.last_name}`}
                    position={coder.position || "Undefined"}
                    languages={coder.stack}
                    isOnline={true}
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
