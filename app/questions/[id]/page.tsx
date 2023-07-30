"use client";

import React from "react";
import { FaLightbulb, FaPlus, FaVideo, FaCheck } from "react-icons/fa6";
import { Tooltip } from "@mui/material";
import ReactMarkdown from "react-markdown";

import { questions, users } from "@/dummy/questions";
import { Question, User, Contributor } from "@/types";
import { Navbar } from "@/components";
import { daysBetweenDateAndToday } from "@/utils";
import { Comments } from "@/components";

const getQuestion = (userId: string): Question | undefined => {
  return questions.find((question) => question.id === Number(userId));
};

const subText =
  "I have a WPF - mvvm application. I have method in viewmodel that communicates with service layer and service layer communicates with database using entity framework. I am puzzled what to return if user is not found in database.";

const codeString = `
  using KnitterNotebook.Database;
  using KnitterNotebook.Exceptions;
  using KnitterNotebook.Models;
  using KnitterNotebook.Models.Dtos;
  using KnitterNotebook.Services.Interfaces;
  using Microsoft.EntityFrameworkCore;
  using System;
  using System.Threading.Tasks;

  namespace KnitterNotebook.Services
  {
      public class UserService : CrudService<User>, IUserService
      {
          private readonly DatabaseContext _databaseContext;

          public UserService(DatabaseContext databaseContext) : base(databaseContext)
          {
              _databaseContext = databaseContext;
          }

          public async Task<string> GetNicknameAsync(int id)
              => (await _databaseContext.Users.FindAsync(id)
                  ?? throw new EntityNotFoundException(ExceptionsMessages.UserWithIdNotFound(id)))
                  .Nickname;

          public async Task<string?> GetNicknameAsync2(int id)
              => await _databaseContext.Users.FindAsync(id)?.Nickname;

      }
  }
  `;

const markdown = `${subText}\n\`\`\`csharp\n${codeString}\`\`\``;

const markdownQuestion = `
  # How to Sort an Array of Numbers in JavaScript

  I have an array of numbers in JavaScript that I want to sort in ascending order. What is the best way to achieve this?

  ## Question

  I have the following array:

  \`\`\`javascript
  const numbers = [5, 2, 9, 1, 5, 6];
  \`\`\`

  I want to sort it in ascending order so that it becomes:

  \`\`\`javascript
  [1, 2, 5, 5, 6, 9];
  \`\`\`

  What is the most efficient and straightforward way to sort this array in JavaScript?
  `;

const markdownAnswer = `
# Using the \`Array.prototype.sort()\` method

You can use the built-in \`sort()\` method of the Array object. By default, it sorts elements as strings, which may lead to incorrect results when sorting numbers. To correctly sort numbers, you need to provide a custom sorting function as follows:

\`\`\`javascript
const numbers = [5, 2, 9, 1, 5, 6];
numbers.sort((a, b) => a - b);
\`\`\`

This will sort the array in ascending order.
`;

const QuestionPage = ({ params }: { params: { id: string } }) => {
  const question = getQuestion(params.id);

  if (!question) return false;

  const [activeButton, setActiveButton] = React.useState("Question");
  console.log(activeButton);

  return (
    <>
      <Navbar />
      <div className="p-3 m-0">
        <div className="mx-auto max-w-5xl py-5 px-8 border-solid border-black border-[1px] border-x-0 border-t-0">
          <div className="flex flex-row justify-between bg-inherit">
            <h1 className="flex-initial basis-10/12 shrink bg-inherit text-4xl text-left">
              {question.question}
            </h1>
            {!question.isAnswered ? (
              <button className="basis-1/12 text-base font-medium p-3 h-14 self-center items-center justify-between flex flex-row border-solid border-blue-600 border-[1px] bg-blue-500 rounded-md">
                <FaVideo className="bg-blue-500 text-slate-200 mr-3" />
                <p className="bg-blue-500 text-slate-200">Schedule</p>
              </button>
            ) : (
              <button className="basis-1/12 text-base font-medium p-3 h-14 self-center items-center justify-between flex flex-row border-solid border-green-600 border-[1px] bg-green-500 rounded-md">
                <FaCheck className="bg-green-500 text-slate-200 mr-3" />
                <p className="bg-green-500 text-slate-200">Answered</p>
              </button>
            )}
          </div>
          <div className="flex flex-row justify-between items-center my-2 bg-inherit">
            <span className="bg-inherit">{question.asker.name}</span>
            <span className="bg-inherit">
              {question.date}, {question.time}
            </span>
          </div>
          <div className="flex flex-row justify-center items-center">
            <button
              onClick={() => setActiveButton("Question")}
              className={`p-4 bg-gray-300 hover:bg-gray-400 border-solid border-gray-400 border rounded-l-2xl ${
                activeButton !== "Question"
                  ? "opacity-50"
                  : "opacity-100 bg-gray-400"
              }`}
            >
              Question
            </button>
            <button
              onClick={
                question.isAnswered
                  ? () => setActiveButton("Answer")
                  : undefined
              }
              className={`p-4 border-solid border-green-400 border rounded-r-2xl ${
                question.isAnswered
                  ? "enabled hover:bg-green-400 cursor-pointer opacity-100"
                  : "disabled cursor-text opacity-50"
              } ${
                activeButton === "Answer"
                  ? "bg-green-400 opacity-100"
                  : "bg-green-200"
              }`}
            >
              Answer
            </button>
          </div>
        </div>
        {activeButton === "Question" ? (
          <ReactMarkdown
            children={markdownQuestion}
            className="mx-auto max-w-5xl py-3 px-3 bg-gray-200 text-justify"
          ></ReactMarkdown>
        ) : (
          <ReactMarkdown
            children={markdownAnswer}
            className="mx-auto max-w-5xl py-3 px-3 bg-gray-200 text-justify"
          ></ReactMarkdown>
        )}
      </div>
      <Comments />

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
    </>
  );
};

export default QuestionPage;
