"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PiCaretDoubleUpLight } from "react-icons/pi";
import { createClient } from "@/utils/supabase/client";

import { Navbar, Card, Question, FAB } from "@/components";
import { Coder, Question as QuestionType, Contributor } from "@/types";

interface QueryType {
  id: number;
  created_at: string;
  asker: Coder;
  question: string;
  contributors: Contributor[];
  meeters: {
    is_done: boolean;
    user_id: Coder;
  }[];
}

export default function Home() {
  const supabase = createClient();
  const [dbQuestions, setDbQuestions] = useState<QuestionType[]>([]);
  const [coders, setCoders] = useState<Coder[]>([]);
  const [showScrollTopButton, setShowScrollTopButton] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchDbQuestions = async () => {
      // Fetch all questions
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select(
          `
          id, 
          created_at, 
          asker ( id, first_name, last_name ), 
          question,
          contributors: comments(user_id: commenter(id, first_name, last_name, profile_image, auth_id)),
          meeters: schedulings(user_id: scheduler_id(id, first_name, last_name, profile_image, auth_id), is_done)
        `
        )
        .eq("answer", false)
        .order("created_at", { ascending: false })
        .returns<QueryType[]>();

      if (questionsError) {
        throw questionsError;
      } else {
        console.log(questions);
      }

      const updatedQuestions = questions.map((q) => {
        const { id, created_at, asker, question, contributors, meeters } = q;

        let updatedAsker: Coder = {
          id: asker.id as number,
          first_name: asker.first_name as string,
          last_name: asker.last_name as string,
        };

        const newMeeters = meeters.filter((m) => m.is_done);
        const updatedMeeters = newMeeters.map((m) => ({
          ...m,
          user_id: {
            id: m.user_id.id as number,
            first_name: m.user_id.first_name as string,
            last_name: m.user_id.last_name as string,
            profile_image: m.user_id.profile_image as boolean,
            auth_id: m.user_id.auth_id as string,
          },
        }));

        // Map the comments to contributors
        const updatedContributors: Contributor[] = contributors.map((c) => ({
          ...c,
          user_id: {
            id: c.user_id?.id as number,
            first_name: c.user_id?.first_name as string,
            last_name: c.user_id?.last_name as string,
            profile_image: c.user_id?.profile_image as boolean,
            auth_id: c.user_id?.auth_id as string,
          },
        }));

        const allContributors = [...updatedContributors, ...updatedMeeters];

        const uniqueContributors = (
          contributors: Contributor[]
        ): Contributor[] => {
          // Create a map to store unique contributors by auth_id
          const uniqueMap = new Map();

          // Iterate through the contributors array
          contributors.forEach((contributor) => {
            const authId = contributor.user_id?.auth_id;
            // If the auth_id is not already in the map, add it
            if (!uniqueMap.has(authId)) {
              uniqueMap.set(authId, contributor);
            }
          });

          // Convert the map values to an array
          return Array.from(uniqueMap.values());
        };

        // Return the transformed object
        return {
          id: id as number,
          created_at: created_at as string,
          asker: updatedAsker,
          question: question as string,
          contributors: uniqueContributors(allContributors),
        };
      });
      console.log(updatedQuestions);
      setDbQuestions(updatedQuestions);
    };
    const fetchCoders = async () => {
      const { data: coders, error } = await supabase
        .from("coders")
        .select("id, auth_id, first_name, last_name, position, stack")
        .eq("is_online", true);
      if (coders) {
        setCoders(coders);
      } else {
        console.error(error);
      }
    };
    fetchDbQuestions();
    fetchCoders();
  }, []);

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
          {dbQuestions.length === 0 ? (
            <h1 className="flex items-center justify-center font-bold mt-3 text-black">
              No unanswered questions
            </h1>
          ) : (
            <ul role="list" className="divide-y divide-gray-600">
              {dbQuestions.map((question, index) => (
                <li key={index} className="hover:bg-slate-100">
                  <Link
                    href={`/questions/${question.id}`}
                    className="flex justify-between gap-x-6 py-5"
                  >
                    <Question
                      question={question.question ?? ""}
                      asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                <h1 className="font-bold text-emerald-600 mr-5">{`${coders.length} online ${coders.length > 1 ? "users" : "user"}`}</h1>
                <Link href="/users/all" className="text-base text-sky-600 ml-5">
                  View All &rarr;
                </Link>
              </div>
              {coders.map((coder, index) => (
                <Link href={`/users/${coder?.auth_id}`}>
                  <Card
                    id={coder.id ?? 0}
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
