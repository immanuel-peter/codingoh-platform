"use client";

import React, { useState, Fragment } from "react";
import {
  FaLightbulb,
  FaPlus,
  FaVideo,
  FaCheck,
  FaXmark,
  FaCalendar,
  FaUpload,
} from "react-icons/fa6";
import { MdOutlineScheduleSend } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import { Transition, Dialog } from "@headlessui/react";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Tag, Tooltip } from "antd";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import Avatar from "@/public/avatar.png";
import { questions, users } from "@/dummy/questions";
import { Question, User, Contributor } from "@/types";
import { Navbar, FAB, RenderMd } from "@/components";
import { daysBetweenDateAndToday, generateMetadata } from "@/utils";
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

  const [activeButton, setActiveButton] = useState("Question");
  const [isScheduleMeetOpen, setIsScheduleMeetOpen] = useState(false);
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [didSchedule, setDidSchedule] = useState<boolean>(false);

  console.log(dateTime, didSchedule);

  const handleSchedule = () => {
    setDidSchedule(true);
    setIsScheduleMeetOpen(false);
  };

  return (
    <>
      <Navbar />
      <div className="p-3 m-0">
        <div className="mx-auto max-w-7xl py-5 px-8 border-solid border-black border-[1px] border-x-0 border-t-0">
          <div className="flex flex-row justify-between bg-inherit">
            <h1 className="flex-initial basis-10/12 shrink bg-inherit text-4xl text-left">
              {question.question}
            </h1>
            {!question.isAnswered ? (
              <button
                onClick={
                  !didSchedule ? () => setIsScheduleMeetOpen(true) : undefined
                }
                className={`basis-1/12 text-base font-medium p-3 h-14 self-center items-center justify-between flex flex-row border-solid border-[1px] ${
                  !didSchedule
                    ? "border-blue-600 hover:border-blue-800 bg-blue-500 hover:bg-blue-700"
                    : "border-yellow-600 bg-yellow-500 cursor-text"
                } rounded-xl`}
              >
                <FaVideo className="bg-inherit text-slate-200 mr-3" />
                <p className="bg-inherit text-slate-200">
                  {!didSchedule ? "Schedule" : "Scheduled"}
                </p>
              </button>
            ) : (
              <button className="basis-1/12 text-base font-medium p-3 h-14 self-center items-center justify-between flex flex-row border-solid border-green-600 border-[1px] bg-green-500 rounded-md">
                <FaCheck className="bg-green-500 text-slate-200 mr-3" />
                <p className="bg-green-500 text-slate-200">Answered</p>
              </button>
            )}
          </div>
          <div className="flex justify-center items-center gap-3 p-3 py-5">
            {question.tags?.map((tag) => <Tag>{tag}</Tag>)}
          </div>
          <div className="flex flex-row justify-between items-center my-2 bg-inherit">
            <Link href={`/users/${question.asker.id}`}>
              <span className="bg-inherit hover:underline">
                {question.asker.name}
              </span>
            </Link>
            <span className="bg-inherit">
              {question.date}, {question.time}
            </span>
          </div>
          {/* <div className="flex flex-row justify-center items-center">
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
              onClick={() => setActiveButton("Answer")}
              className={`p-4 border-solid border-green-400 border rounded-r-2xl hover:bg-green-400 cursor-pointer opacity-100 ${
                activeButton === "Answer"
                  ? "bg-green-400 opacity-100"
                  : "bg-green-200"
              }`}
            >
              Answer
            </button>
          </div> */}
        </div>
        <RenderMd
          markdown={question.description}
          className="mx-auto max-w-7xl py-3 px-3 mt-3 text-justify border border-solid border-black rounded-2xl"
        />
        {question.isAnswered ? (
          <RenderMd
            markdown={question.answer || markdownAnswer}
            className="mx-auto max-w-7xl py-3 px-3 mt-3 text-justify border border-solid border-black rounded-2xl"
          />
        ) : (
          <div className="mx-auto max-w-7xl py-3 px-3 mt-3 text-center flex flex-col justify-center border border-solid border-black rounded-2xl">
            <h1 className="text-xl font-semibold">
              Ready to answer this question?
            </h1>
            <div className="flex flex-col items-center mt-2">
              <textarea
                placeholder="Type the answer in Markdown"
                className="w-[896px] rounded-xl"
                rows={20}
              ></textarea>
            </div>
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-green-100 px-4 py-2 text-base font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                onClick={handleSchedule}
              >
                Upload <FaUpload />
              </button>
            </div>
          </div>
        )}
        {/* {activeButton === "Question" ? (
          <RenderMd
            markdown={question.description}
            className="mx-auto max-w-7xl py-3 px-3 mt-3 text-justify border border-solid border-black rounded-2xl"
          />
        ) : question.isAnswered ? (
          <RenderMd
            markdown={question.answer || markdownAnswer}
            className="mx-auto max-w-7xl py-3 px-3 mt-3 text-justify border border-solid border-black rounded-2xl"
          />
        ) : (
          <div className="mx-auto max-w-7xl py-3 px-3 mt-3 text-center flex flex-col justify-center border border-solid border-black rounded-2xl">
            <h1 className="text-xl font-semibold">
              Ready to answer this question?
            </h1>
            <div className="flex flex-col items-center mt-2">
              <textarea
                placeholder="Type the answer in Markdown"
                className="w-[896px] rounded-xl"
                rows={20}
              ></textarea>
            </div>
            <div className="mt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-green-100 px-4 py-2 text-base font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                onClick={handleSchedule}
              >
                Upload <FaUpload />
              </button>
            </div>
          </div>
        )} */}
      </div>
      <Comments contributors={question.contributors || []} />

      <FAB />

      <Transition appear show={isScheduleMeetOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsScheduleMeetOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-blue-600 inline-flex items-center gap-2"
                  >
                    Schedule Your Meeting <FaVideo />
                  </Dialog.Title>
                  <div className="py-4 mt-4 mb-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Choose Date and Time"
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        sx={{ width: "100%", height: "100%" }}
                        value={dateTime}
                        onChange={(newValue) => setDateTime(newValue)}
                        format="lll"
                      />
                    </LocalizationProvider>
                  </div>

                  <div>
                    <textarea
                      placeholder="Explain why you want to help and what you offer"
                      className="w-full rounded-lg placeholder:text-sm"
                    ></textarea>
                  </div>

                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-yellow-100 px-4 py-2 text-base font-medium text-yellow-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                      onClick={handleSchedule}
                    >
                      Schedule <MdOutlineScheduleSend />
                    </button>
                  </div>

                  <hr className="border-solid border-black border-[1px] my-5" />

                  <div className="flex flex-row justify-between items-center">
                    <div className="flex justify-start items-center gap-3 basis-1/2">
                      <Image
                        src={Avatar}
                        alt="profile picture"
                        className="h-[15%] w-[15%] rounded-full"
                      />
                      <div className="text-lg">Immanuel Peter</div>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <Tooltip title="Accept" color="#4ade80" placement="left">
                        <div className="p-2 rounded-full border border-solid border-black hover:bg-green-100 cursor-pointer">
                          <FaCheck className="text-green-500" />
                        </div>
                      </Tooltip>
                      <Tooltip title="Reject" color="#f87171" placement="top">
                        <div className="p-2 rounded-full border border-solid border-black hover:bg-red-100 cursor-pointer">
                          <FaXmark className="text-red-500" />
                        </div>
                      </Tooltip>
                      <Tooltip
                        title="Reschedule"
                        color="#38bdf8"
                        placement="right"
                      >
                        <div className="p-2 rounded-full border border-solid border-black hover:bg-blue-100 cursor-pointer">
                          <FaCalendar className="text-blue-500" />
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    Requested session on{" "}
                    <span className="text-blue-400 font-bold text-sm">
                      MM/DD/YYYY
                    </span>{" "}
                    @{" "}
                    <span className="text-blue-400 font-bold text-sm">
                      HH:MM AP
                    </span>
                    <div className="p-2 bg-gray-200 rounded-md text-sm">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vestibulum scelerisque ultrices efficitur. Phasellus porta
                      ligula nisi, ut sagittis neque molestie nec. Donec
                      sagittis vitae mi eu dignissim. Suspendisse scelerisque
                      ante vitae ullamcorper volutpat. Vivamus lectus nibh,
                      dapibus non felis in, dapibus imperdiet nisi. Cras
                      consectetur semper arcu, quis viverra nunc maximus id.
                    </div>
                    <div className="mt-2">
                      <textarea
                        placeholder="Respond to the request here. If you want to reschedule, include the date and time you want."
                        className="placeholder:text-sm w-full rounded-lg"
                      ></textarea>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default QuestionPage;

/*
className={`p-4 border-solid border-green-400 border rounded-r-2xl ${
                question.isAnswered
                  ? "enabled hover:bg-green-400 cursor-pointer opacity-100"
                  : "disabled cursor-text opacity-50"
              } ${
                activeButton === "Answer"
                  ? "bg-green-400 opacity-100"
                  : "bg-green-200"
              }`}
*/

/*
onClick={
                question.isAnswered
                  ? () => setActiveButton("Answer")
                  : undefined
              }
*/

/*
<div className="mx-auto max-w-7xl py-5 px-8 border-solid border-black border-[1px] border-x-0 border-t-0">
          <div className="flex flex-row justify-between bg-inherit">
            <h1 className="flex-initial basis-10/12 shrink bg-inherit text-4xl text-left">
              {question.question}
            </h1>
            {!question.isAnswered ? (
              <button
                onClick={
                  !didSchedule ? () => setIsScheduleMeetOpen(true) : undefined
                }
                className={`basis-1/12 text-base font-medium p-3 h-14 self-center items-center justify-between flex flex-row border-solid border-[1px] ${
                  !didSchedule
                    ? "border-blue-600 hover:border-blue-800 bg-blue-500 hover:bg-blue-700"
                    : "border-yellow-600 bg-yellow-500 cursor-text"
                } rounded-xl`}
              >
                <FaVideo className="bg-inherit text-slate-200 mr-3" />
                <p className="bg-inherit text-slate-200">
                  {!didSchedule ? "Schedule" : "Scheduled"}
                </p>
              </button>
            ) : (
              <button className="basis-1/12 text-base font-medium p-3 h-14 self-center items-center justify-between flex flex-row border-solid border-green-600 border-[1px] bg-green-500 rounded-md">
                <FaCheck className="bg-green-500 text-slate-200 mr-3" />
                <p className="bg-green-500 text-slate-200">Answered</p>
              </button>
            )}
          </div>
          <div className="flex justify-center items-center gap-3 p-3 py-5">
            {question.tags?.map((tag) => <Tag>{tag}</Tag>)}
          </div>
          <div className="flex flex-row justify-between items-center my-2 bg-inherit">
            <Link href={`/users/${question.asker.id}`}>
              <span className="bg-inherit hover:underline">
                {question.asker.name}
              </span>
            </Link>
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
              onClick={() => setActiveButton("Answer")}
              className={`p-4 border-solid border-green-400 border rounded-r-2xl hover:bg-green-400 cursor-pointer opacity-100 ${
                activeButton === "Answer"
                  ? "bg-green-400 opacity-100"
                  : "bg-green-200"
              }`}
            >
              Answer
            </button>
          </div>
        </div>
*/
