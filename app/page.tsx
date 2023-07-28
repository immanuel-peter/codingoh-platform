import React from "react";
import Link from "next/link";
import { FaLightbulb, FaPlus } from "react-icons/fa6";
import { Tooltip } from "@mui/material";

import { Navbar, Card, Question } from "@/components";
import { users, questions } from "@/dummy/questions";

export default function Home() {
  const onlineUsers = users.filter((user) => user.isOnline);
  const unansweredQuestions = questions.filter(
    (question) => !question.isAnswered
  );

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
      <Tooltip title="Add Question" placement="left">
        <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-5 shadow-md">
          <FaPlus className="bg-inherit text-inherit text-2xl" />
        </button>
      </Tooltip>
    </main>
  );
}
