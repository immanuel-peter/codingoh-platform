import React from "react";
import Image from "next/image";

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
              <li key={index} className="flex justify-between gap-x-6 py-5">
                <Question
                  question={question.question}
                  asker={question.asker.name}
                  contributors={question.contributors.length}
                  date={question.date}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="basis-1/4 items-center justify-center">
          {onlineUsers.length !== 0 ? (
            <div>
              <h1 className="flex items-center justify-center font-bold mt-3 text-emerald-600">{`${onlineUsers.length} online users`}</h1>
              {onlineUsers.map((user, index) => (
                <Card
                  key={index}
                  name={user.name}
                  position={user.position}
                  isOnline={user.isOnline}
                />
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
        Help CodingOH
      </button>
    </main>
  );
}
