"use client";

import React, { useState, useEffect, Fragment } from "react";
import {
  FaCode,
  FaSun,
  FaRegSun,
  FaRegCircleUser,
  FaInbox,
  FaHandshakeAngle,
} from "react-icons/fa6";
import { FaCheckCircle, FaThumbsUp, FaSearch } from "react-icons/fa";
import {
  FaArrowUpRightFromSquare,
  FaCheck,
  FaCirclePlus,
} from "react-icons/fa6";
import { FcPlus } from "react-icons/fc";
import { BsFillSunFill, BsSun, BsMoon } from "react-icons/bs";
import { HiDocumentText } from "react-icons/hi2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Avatar } from "@mui/joy";

import { questions, inboxItems } from "@/dummy/questions";
import { Question } from "@/types";
import AvatarPic from "public/avatar.png";

const Navbar = ({ isProfile }: { isProfile?: boolean }) => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [sunClicked, setSunClicked] = useState(false);
  const [suggestedQueries, setSuggestedQueries] = useState<Question[]>([]);
  const [openInbox, setOpenInbox] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);

    const filteredQueries = questions.filter((question) =>
      question.question.toLowerCase().includes(inputValue.toLowerCase())
    );
    setSuggestedQueries(filteredQueries);
  };

  useEffect(() => {
    // Function to handle click events outside the input and suggestions list
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click target is outside the input and suggestions list
      if (
        target &&
        !target.closest(".suggestions-wrapper") &&
        !target.closest(".input-wrapper")
      ) {
        // Clear the suggested queries
        setSuggestedQueries([]);
      }
    };

    // Add the click event listener when the component mounts
    window.addEventListener("click", handleClickOutside);

    // Remove the click event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion: string, suggestionId: number) => {
    setQuery(suggestion);
    setSuggestedQueries([]);
    router.push(`/questions/${suggestionId}`);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (query.trim() !== "") {
        router.push(`/search?q=${encodeURI(query)}`);
      }
      setSuggestedQueries([]);
    }
  };

  return (
    <>
      <header className="flex flex-row justify-between items-center p-2">
        <nav className="p-3">
          <Link href="/" className="flex flex-row items-center ml-[10px]">
            <FaCode className="text-3xl" />
            <div className="flex flex-col">
              <span className="text-2xl text-blue-700 font-bold ml-2">
                CodingOH
              </span>
              <span className="text-[10.5px] ml-2">
                Stack Overflow in Real Time
              </span>
            </div>
          </Link>
        </nav>
        <div className="relative w-7/12">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyPress}
            placeholder="What is your query?"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          {suggestedQueries.length > 0 && (
            <ul className="absolute z-10 bg-white mt-2 w-full border border-gray-300 rounded-lg shadow-lg divide-y divide-slate-200 max-h-[500px] overflow-y-auto">
              {suggestedQueries.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleSuggestionClick(suggestion.question, suggestion.id)
                  }
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                    suggestion.isAnswered
                      ? "flex flex-row justify-between items-center"
                      : ""
                  }`}
                >
                  {suggestion.question}
                  {suggestion.isAnswered ? (
                    <FaCheckCircle className="text-green-500 bg-inherit" />
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav className="p-3 flex flex-row items-center justify-evenly gap-6">
          <Link
            href="https://successful-echium-b3f.notion.site/Support-CodingOH-67de2dbf28694086bbf3d59baa1fa10b?pvs=4"
            target="_blank"
          >
            <HiDocumentText className="text-3xl hover:text-blue-500 cursor-pointer" />
          </Link>
          {/* <SignedOut>
            <Link
              href="/sign-in"
              className="px-3 py-2 rounded-full font-semibold border border-solid border-black bg-gray-100 hover:bg-gray-200 text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="px-3 py-2 rounded-full font-semibold border border-solid border-black bg-blue-500 hover:bg-blue-600 text-white"
            >
              Sign Up
            </Link>
          </SignedOut> */}

          <Link href="/questions/add">
            <FaCirclePlus className="text-3xl mx-1 text-green-500 hover:text-green-700" />
          </Link>
          <div
            className="mx-1 cursor-pointer"
            onClick={() => setOpenInbox(true)}
          >
            <FaInbox className="text-3xl hover:text-amber-900" />
          </div>

          <Link href="/users/8591247">
            <Avatar
              size="md"
              className="hover:text-blue-500 hover:bg-blue-300/50"
            >
              IP
            </Avatar>
          </Link>
        </nav>
      </header>
      <hr className="border-solid border-black border-[1px]" />

      <Transition appear show={openInbox} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setOpenInbox(false)}
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
            <div className="fixed inset-0 bg-gray-400/75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-auto">
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
                <Dialog.Panel className="w-fit max-w-full transform overflow-auto rounded-2xl bg-white border-slate-200 border border-solid p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="p-2 text-2xl font-bold leading-6 text-gray-900 underline underline-offset-auto"
                  >
                    Inbox
                  </Dialog.Title>

                  <div className="p-3 overflow-auto flex flex-col text-left justify-between">
                    <div className="rounded-b-xl flex flex-col justify-between">
                      <ul
                        role="list"
                        className="divide-y divide-gray-500 rounded-b-xl"
                      >
                        {inboxItems.map((item, index) => (
                          <li key={index}>
                            <InboxItem
                              userLink={`/users/${item.randUser.id}`}
                              name={item.randName}
                              question={item.randQuestion}
                              link={item.link}
                              unread={item.unread}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex flex-row justify-between items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setOpenInbox(false)}
                    >
                      Cool!
                      <FaThumbsUp className="ml-3 text-base bg-inherit" />
                    </button>
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

const InboxItem = ({
  userLink,
  name,
  question,
  link,
  unread,
}: {
  userLink: string;
  name: string;
  question: string;
  link: string;
  unread: boolean;
}) => {
  const router = useRouter();

  const [read, setRead] = useState(false);

  const handleChange = () => {
    if (!read) {
      setRead(true);
    } else {
      setRead(true);
    }
  };

  return (
    <div className="flex items-center justify-between gap-x-6 px-3 py-3">
      <div className="flex flex-row items-center gap-3">
        {!read ? (
          <div
            className="flex-none rounded-full bg-white bg-emerald-500/20 p-1 cursor-pointer"
            onClick={() => handleChange()}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
          </div>
        ) : (
          <FaCheck className="text-green-500" />
        )}
        <div className="flex flex-row items-center text-sm gap-2">
          <span
            className="text-blue-300 hover:underline hover:underline-offset-auto cursor-pointer"
            onClick={() => router.push(userLink)}
          >
            {name}
          </span>{" "}
          responded to <span className="text-blue-300">{question}</span>
        </div>
      </div>
      <Link href={link} onClick={() => handleChange()}>
        <FaArrowUpRightFromSquare className="hover:text-blue-600" />
      </Link>
    </div>
  );
};

export default Navbar;
