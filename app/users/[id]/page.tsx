"use client";

import React, { Fragment, useState } from "react";
import Image from "next/image";
import { Badge } from "@mui/joy";
import { FaEdit, FaThumbsUp, FaHome } from "react-icons/fa";
import { FaPlus, FaXTwitter, FaThreads } from "react-icons/fa6";
import { Progress, Tooltip, Select } from "antd";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { BsFilePlusFill } from "react-icons/bs";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { SocialIcon } from "react-social-icons";

import { users, questions, projects, techSkills } from "@/dummy/questions";
import { User, Project as ProjectType, Proficiency } from "@/types";
import { getTopLanguages, getTopQuestions } from "@/utils";
import { Navbar, Question, Project, FAB, NewProjectForm } from "@/components";
import { sortQuestionsAndContributions, projectsMap } from "@/utils";
import Banner from "@/public/banner.png";
import Avatar from "@/public/avatar.png";
import { allIcons } from "@/utils/icons";

const getUser = (userId: string): User | undefined => {
  return users.find((user) => user.id === Number(userId));
};

const UserPage = ({ params }: { params: { id: string } }) => {
  const [questionTypeMode, setQuestionTypeMode] = useState<string>("all");
  const [isStackOpen, setIsStackOpen] = useState<boolean>(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [skillsOpen, setSkillsOpen] = useState<boolean>(false);
  const [projectTypeMode, setProjectTypeMode] = useState<string>("all");
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [newProjectModalOpen, setNewProjectModalOpen] =
    useState<boolean>(false);

  const user = getUser(params.id);

  if (!user) return false;

  const userMap = sortQuestionsAndContributions(questions, users);
  const userQuestionsAndContributions = userMap[user.id];

  const topLanguages: Proficiency[] = user.codingLanguages
    ? getTopLanguages(user.codingLanguages, 5)
    : [];

  const userProjects: ProjectType[] = projectsMap(projects, user) || [];

  return (
    <>
      <Navbar isProfile />
      <div className="p-3 m-0">
        <div className="relative flex h-32 w-full items-center justify-between rounded-xl bg-cover px-10 mb-4">
          <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full mr-20">
              <Badge
                badgeContent={user.isOnline ? "Online" : "Offline"}
                color={user.isOnline ? "success" : "danger"}
                size="md"
                variant="soft"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeInset="10%"
              >
                <Image
                  src={Avatar}
                  alt="profile picture"
                  className="h-full w-full rounded-full"
                />
              </Badge>
            </div>
            <div className="flex-grow">
              <h1 className="text-xl font-bold">{user.name}</h1>
              <span className="text-lg font-normal">{user.position}</span>
              <div className="flex flex-row gap-2">
                <SocialIcon
                  key="email"
                  network="email"
                  url={`mailto:${user.email}`}
                  style={{ height: 35, width: 35, marginTop: 10 }}
                />
                {user.platforms
                  ? user.platforms.map((platform, index) =>
                      platform !== "X" && platform !== "Threads" ? (
                        <SocialIcon
                          key={index}
                          network={platform.toLowerCase().replace(/\s/g, "")}
                          url={`https://www.${platform
                            .toLowerCase()
                            .replace(/\s/g, "")}.com/`}
                          style={{ height: 35, width: 35, marginTop: "10px" }}
                        />
                      ) : platform === "X" ? (
                        <Link
                          href="https://www.x.com"
                          className="h-[35px] w-[35px] mt-[10px] rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <FaXTwitter className="text-base" />
                        </Link>
                      ) : (
                        <Link
                          href="https://www.threads.net"
                          className="h-[35px] w-[35px] mt-[10px] rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <FaThreads className="text-base" />
                        </Link>
                      )
                    )
                  : null}
              </div>
            </div>
          </div>
          <div>
            <Link
              href={`/users/${user.id}/edit`}
              className="p-3 bg-cyan-300 hover:bg-cyan-400 border border-solid border-cyan-400 hover:border-cyan-500 items-center justify-center flex flex-row rounded-lg"
            >
              <FaEdit className="mr-3 bg-inherit" />
              Edit Profile
            </Link>
          </div>
        </div>
        <Image
          src={Banner}
          alt="background cover"
          className="h-2 w-full rounded-xl"
        />
      </div>
      <main className="p-3 m-0 grid grid-cols-4 grid-flow-dense gap-4">
        <div className="row-span-3 border border-solid border-gray-300 rounded-xl h-fit">
          <h1 className="p-2 ml-3 text-2xl font-bold rounded-t-xl">Stack</h1>
          <hr
            className={`border-solid border border-black ${
              user.codingLanguages && user.codingLanguages.length > 0
                ? "mb-4"
                : null
            }`}
          />
          {user.codingLanguages && user.codingLanguages?.length > 0 ? (
            <div className="pb-3 grid grid-cols-4 gap-4 items-center content-evenly justify-evenly justify-items-center rounded-b-xl">
              {topLanguages
                .sort((a, b) => b.proficiency - a.proficiency)
                .map((language, index) => (
                  <>
                    <div key={index} className="col-span-1">
                      <Tooltip
                        title={language.language}
                        arrow={false}
                        placement="right"
                      >
                        {allIcons[language.language]}
                      </Tooltip>
                    </div>
                    <Progress
                      percent={language.proficiency}
                      format={(percent) => percent}
                      className="col-span-3"
                    />
                  </>
                ))}
              {user.codingLanguages && user.codingLanguages.length > 5 ? (
                <button
                  className="col-start-3 col-span-2 text-base text-blue-500 flex flex-row right-0 self-end items-center justify-between"
                  onClick={() => setIsStackOpen(true)}
                >
                  See More
                  <MdOutlineKeyboardDoubleArrowRight className="ml-3" />
                </button>
              ) : null}
            </div>
          ) : (
            <div className="pl-2 py-5 ml-3 text-xl my-1 text-green-500">
              Still Learning...
            </div>
          )}
        </div>
        <div className="col-span-3 border border-solid border-gray-300 rounded-xl p-2 h-fit">
          <h1 className="text-2xl font-bold ml-3 underline underline-offset-4">
            About
          </h1>
          <p className={`ml-3 mt-2 ${user.about ? null : "text-green-500"}`}>
            {user.about || "Still Finding Myself..."}
          </p>
        </div>
        <div className="col-span-3 col-start-2 row-span-6 border border-solid border-gray-300 rounded-t-xl h-fit">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold ml-3 p-2 rounded-tl-xl">
              Questions
            </h1>
            <div className="flex flex-row justify-between items-center gap-2 mr-3 rounded-tr-xl">
              <button
                className={`mr-2 text-sm text-black bg-red-400 hover:bg-red-600 hover:text-white hover:scale-110 p-1 border border-solid border-red-500 rounded-full h-5 w-5 flex items-center justify-center ${
                  questionTypeMode === "all" ? "invisible" : null
                }`}
                onClick={() => setQuestionTypeMode("all")}
              >
                x
              </button>
              <button
                className={`p-2 rounded-full border border-solid border-sky-500 text-sky-500 ${
                  questionTypeMode === "asked" ? "bg-blue-300" : null
                }`}
                onClick={() => setQuestionTypeMode("asked")}
              >
                <span
                  className={`${
                    questionTypeMode === "asked"
                      ? "bg-blue-300 text-white"
                      : null
                  }`}
                >
                  Asked Questions
                </span>
              </button>
              <button
                className={`p-2 rounded-full border border-solid border-sky-500 text-sky-500 ${
                  questionTypeMode === "contributed" ? "bg-blue-300" : null
                }`}
                onClick={() => setQuestionTypeMode("contributed")}
              >
                <span
                  className={`${
                    questionTypeMode === "contributed"
                      ? "bg-blue-300 text-white"
                      : null
                  }`}
                >
                  Contributed Questions
                </span>
              </button>
            </div>
          </div>
          <hr className="border-solid border border-black" />
          {userQuestionsAndContributions.allQuestions &&
          userQuestionsAndContributions.allQuestions.length > 0 ? (
            <>
              <div className={`rounded-b-xl flex flex-col justify-between`}>
                {questionTypeMode === "all" && (
                  <ul
                    role="list"
                    className="divide-y divide-gray-500 rounded-b-xl"
                  >
                    {userQuestionsAndContributions.allQuestions.length <= 5
                      ? userQuestionsAndContributions.allQuestions.map(
                          (question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={question.asker.name}
                                  contributors={question.contributors || []}
                                  date={question.date}
                                  answered={question.isAnswered}
                                />
                              </Link>
                            </li>
                          )
                        )
                      : getTopQuestions(
                          userQuestionsAndContributions.allQuestions,
                          5
                        ).map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={question.asker.name}
                                contributors={question.contributors || []}
                                date={question.date}
                                answered={question.isAnswered}
                              />
                            </Link>
                          </li>
                        ))}
                  </ul>
                )}
                {questionTypeMode === "all" &&
                userQuestionsAndContributions.allQuestions.length > 5 ? (
                  <button
                    className="text-base text-blue-500 flex flex-row self-end items-center justify-between rounded-br-xl"
                    onClick={() => setIsQuestionsOpen(true)}
                  >
                    See More
                    <MdOutlineKeyboardDoubleArrowRight className="mx-2 my-2" />
                  </button>
                ) : null}
              </div>
              <div className={`rounded-b-xl flex flex-col justify-between`}>
                {questionTypeMode === "asked" && (
                  <ul
                    role="list"
                    className="divide-y divide-gray-500 rounded-b-xl"
                  >
                    {userQuestionsAndContributions.askedQuestions.length <= 5
                      ? userQuestionsAndContributions.askedQuestions.map(
                          (question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={question.asker.name}
                                  contributors={question.contributors || []}
                                  date={question.date}
                                  answered={question.isAnswered}
                                />
                              </Link>
                            </li>
                          )
                        )
                      : getTopQuestions(
                          userQuestionsAndContributions.askedQuestions,
                          5
                        ).map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={question.asker.name}
                                contributors={question.contributors || []}
                                date={question.date}
                                answered={question.isAnswered}
                              />
                            </Link>
                          </li>
                        ))}
                  </ul>
                )}
                {questionTypeMode === "asked" &&
                userQuestionsAndContributions.askedQuestions.length > 5 ? (
                  <button
                    className="text-base text-blue-500 flex flex-row self-end items-center justify-between rounded-bl-xl"
                    onClick={() => setIsQuestionsOpen(true)}
                  >
                    See More
                    <MdOutlineKeyboardDoubleArrowRight className="mx-2 my-2" />
                  </button>
                ) : null}
              </div>
              <div className={`rounded-b-xl flex flex-col justify-between`}>
                {questionTypeMode === "contributed" && (
                  <ul
                    role="list"
                    className="divide-y divide-gray-500 rounded-b-xl"
                  >
                    {userQuestionsAndContributions.contributedQuestions
                      .length <= 5
                      ? userQuestionsAndContributions.contributedQuestions.map(
                          (question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={question.asker.name}
                                  contributors={question.contributors || []}
                                  date={question.date}
                                  answered={question.isAnswered}
                                />
                              </Link>
                            </li>
                          )
                        )
                      : getTopQuestions(
                          userQuestionsAndContributions.contributedQuestions,
                          5
                        ).map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={question.asker.name}
                                contributors={question.contributors || []}
                                date={question.date}
                                answered={question.isAnswered}
                              />
                            </Link>
                          </li>
                        ))}
                  </ul>
                )}
                {questionTypeMode === "contributed" &&
                userQuestionsAndContributions.contributedQuestions.length >
                  5 ? (
                  <button
                    className="text-base text-blue-500 flex flex-row self-end items-center justify-between rounded-bl-xl"
                    onClick={() => setIsQuestionsOpen(true)}
                  >
                    See More
                    <MdOutlineKeyboardDoubleArrowRight className="mx-2 my-2" />
                  </button>
                ) : null}
              </div>
            </>
          ) : (
            <div className="rounded-b-xl text-center py-16">
              <p className="text-xl underline">No Questions Yet</p>
              <div className="flex flex-row justify-center items-center mt-2">
                <div className="flex flex-row justify-center items-center gap-2 text-lg">
                  Ask Question{" "}
                  <Link href="/questions/add">
                    <FaPlus className="text-blue-400 text-xl hover:text-blue-600 hover:scale-125" />
                  </Link>
                </div>
                <div className="mx-3 scale-[2.0]">|</div>
                <div className="flex flex-row justify-center items-center gap-2 text-lg">
                  Contribute to Question{" "}
                  <Link href="/">
                    <FaHome className="text-blue-400 text-xl hover:text-blue-600 hover:scale-125" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row-span-3 col-start-1 col-span-1 border border-solid border-gray-300 rounded-xl ">
          <h1 className="p-2 ml-3 text-2xl font-bold rounded-tr-xl">
            Metadata
          </h1>
          <hr className="border-solid border border-black" />
          <dl className="divide-y divide-gray-100">
            <div className="p-1 sm:flex sm:items-center sm:gap-4 sm:px-0">
              <dt className="ml-2 text-base font-bold leading-6 text-gray-900 sm:flex-none">
                Education
              </dt>
              <dd className="mr-2 text-base leading-6 text-gray-700 sm:flex-1 sm:text-right">
                {user.education || "N/A"}
              </dd>
            </div>
            <div className="p-1 sm:flex sm:items-center sm:gap-4 sm:px-0">
              <dt className="ml-2 text-base font-bold leading-6 text-gray-900 sm:flex-none">
                Employer
              </dt>
              <dd className="mr-2 text-base leading-6 text-gray-700 sm:flex-1 sm:text-right">
                {user.company || "N/A"}
              </dd>
            </div>
            <div className="p-1 sm:flex sm:items-center sm:gap-4 sm:px-0">
              <dt className="ml-2 text-base font-bold leading-6 text-gray-900 sm:flex-none">
                Location
              </dt>
              <dd className="mr-2 text-base leading-6 text-gray-700 sm:flex-1 sm:text-right">
                {user.location || "N/A"}
              </dd>
            </div>
            <div className="p-1 sm:flex sm:items-center sm:gap-4 sm:px-0">
              <dt className="ml-2 text-base font-bold leading-6 text-gray-900 sm:flex-none">
                Skills
              </dt>
              <dd className="mr-2 text-base leading-6 text-gray-700 sm:flex-1 sm:text-right">
                <button
                  className="self-center hover:rotate-90"
                  onClick={() => setSkillsOpen(!skillsOpen)}
                >
                  {">"}
                </button>
              </dd>
            </div>
            <div
              className={`divide-y divide-dashed divide-gray-300 ${
                skillsOpen ? "block" : "hidden"
              }`}
            >
              {user.skills &&
                user.skills.map((skill, index) => (
                  <>
                    <dt></dt>
                    <dd
                      key={index}
                      className="text-base text-gray-700 bg-gray-100 p-[2px] sm:flex-1 sm:text-center"
                    >
                      {skill}
                    </dd>
                  </>
                ))}
            </div>
          </dl>
        </div>
        <div className="col-span-3 col-start-2 p-2 border border-solid border-gray-300 rounded-xl">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <h1 className="text-2xl font-bold ml-3 p-2 rounded-tl-xl">
                Projects
              </h1>
              <BsFilePlusFill
                className="text-2xl hover:text-green-500 cursor-pointer"
                onClick={() => setNewProjectModalOpen(true)}
              />
            </div>
            <div className="flex flex-row justify-between items-center gap-2 mb-1 mr-3 rounded-tr-xl">
              <button
                className={`mr-2 text-sm text-black bg-red-400 hover:bg-red-600 hover:text-white hover:scale-110 p-1 border border-solid border-red-500 rounded-full h-5 w-5 flex items-center justify-center ${
                  projectTypeMode === "all" ? "invisible" : null
                }`}
                onClick={() => setProjectTypeMode("all")}
              >
                x
              </button>
              <button
                className={`p-2 rounded-full border border-solid border-amber-500 text-amber-500 ${
                  projectTypeMode === "ongoing" ? "bg-amber-300" : null
                }`}
                onClick={() => setProjectTypeMode("ongoing")}
              >
                <span
                  className={`${
                    projectTypeMode === "ongoing"
                      ? "bg-amber-300 text-white"
                      : null
                  }`}
                >
                  Ongoing
                </span>
              </button>
              <button
                className={`p-2 rounded-full border border-solid border-green-500 text-green-500 ${
                  projectTypeMode === "completed" ? "bg-green-300" : null
                }`}
                onClick={() => setProjectTypeMode("completed")}
              >
                <span
                  className={`${
                    projectTypeMode === "completed"
                      ? "bg-green-300 text-white"
                      : null
                  }`}
                >
                  Completed
                </span>
              </button>
              <button
                className={`p-2 rounded-full border border-solid border-orange-500 text-orange-500 ${
                  projectTypeMode === "on_hold" ? "bg-orange-300" : null
                }`}
                onClick={() => setProjectTypeMode("on_hold")}
              >
                <span
                  className={`${
                    projectTypeMode === "on_hold"
                      ? "bg-orange-300 text-white"
                      : null
                  }`}
                >
                  On Hold
                </span>
              </button>
            </div>
          </div>
          <hr className="border-solid border border-black" />
          <div
            className={`p-2 m-2 ${
              userProjects.length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "all" && (
              <>
                {userProjects.length !== 0 ? (
                  userProjects.length <= 6 ? (
                    userProjects.map((project, index) => (
                      <Project project={project} key={index} />
                    ))
                  ) : (
                    userProjects
                      .slice(0, 6)
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  )
                ) : (
                  <h1 className="text-2xl font-bold">No Projects Available</h1>
                )}
              </>
            )}
            {projectTypeMode === "all" && userProjects.length > 6 ? (
              <>
                <div className="col-start-3 relative bottom-0 right-0 flex flex-col items-end justify-between pr-1">
                  <button
                    className="text-base text-blue-500 inline-flex items-center gap-1"
                    onClick={() => setIsProjectsOpen(true)}
                  >
                    See More
                    <span
                      aria-hidden="true"
                      className="block transition-all group-hover:ms-0.5"
                    >
                      &rarr;
                    </span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <div
            className={`p-2 m-2 ${
              userProjects.filter((project) => project.status === "ongoing")
                .length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "ongoing" && (
              <>
                {userProjects.filter((project) => project.status === "ongoing")
                  .length !== 0 ? (
                  userProjects.filter((project) => project.status === "ongoing")
                    .length <= 6 ? (
                    userProjects
                      .filter((project) => project.status === "ongoing")
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  ) : (
                    userProjects
                      .filter((project) => project.status === "ongoing")
                      .slice(0, 6)
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  )
                ) : (
                  <h1 className="text-2xl font-bold">No Ongoing Projects</h1>
                )}
              </>
            )}
            {projectTypeMode === "ongoing" &&
            userProjects.filter((project) => project.status === "ongoing")
              .length > 6 ? (
              <div className="col-start-3 relative bottom-0 right-0 flex flex-col items-end justify-between pr-1">
                <button
                  className="text-base text-blue-500 inline-flex items-center gap-1"
                  onClick={() => setIsProjectsOpen(true)}
                >
                  See More
                  <span
                    aria-hidden="true"
                    className="block transition-all group-hover:ms-0.5"
                  >
                    &rarr;
                  </span>
                </button>
              </div>
            ) : null}
          </div>
          <div
            className={`p-2 m-2 ${
              userProjects.filter((project) => project.status === "completed")
                .length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "completed" && (
              <>
                {userProjects.filter(
                  (project) => project.status === "completed"
                ).length !== 0 ? (
                  userProjects.filter(
                    (project) => project.status === "completed"
                  ).length <= 6 ? (
                    userProjects
                      .filter((project) => project.status === "completed")
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  ) : (
                    userProjects
                      .filter((project) => project.status === "completed")
                      .slice(0, 6)
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  )
                ) : (
                  <h1 className="text-2xl font-bold">No Completed Projects</h1>
                )}
              </>
            )}
            {projectTypeMode === "completed" &&
            userProjects.filter((project) => project.status === "completed")
              .length > 6 ? (
              <div className="col-start-3 relative bottom-0 right-0 flex flex-col items-end justify-between pr-1">
                <button
                  className="text-base text-blue-500 inline-flex items-center gap-1"
                  onClick={() => setIsProjectsOpen(true)}
                >
                  See More
                  <span
                    aria-hidden="true"
                    className="block transition-all group-hover:ms-0.5"
                  >
                    &rarr;
                  </span>
                </button>
              </div>
            ) : null}
          </div>
          <div
            className={`p-2 m-2 ${
              userProjects.filter((project) => project.status === "on_hold")
                .length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "on_hold" && (
              <>
                {userProjects.filter((project) => project.status === "on_hold")
                  .length !== 0 ? (
                  userProjects.filter((project) => project.status === "on_hold")
                    .length <= 6 ? (
                    userProjects
                      .filter((project) => project.status === "on_hold")
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  ) : (
                    userProjects
                      .filter((project) => project.status === "on_hold")
                      .slice(0, 6)
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  )
                ) : (
                  <h1 className="text-2xl font-bold">No Projects On Hold</h1>
                )}
              </>
            )}
            {projectTypeMode === "on_hold" &&
            userProjects.filter((project) => project.status === "on_hold")
              .length > 6 ? (
              <div className="col-start-3 relative bottom-0 right-0 flex flex-col items-end justify-between pr-1">
                <button
                  className="text-base text-blue-500 inline-flex items-center gap-1"
                  onClick={() => setIsProjectsOpen(true)}
                >
                  See More
                  <span
                    aria-hidden="true"
                    className="block transition-all group-hover:ms-0.5"
                  >
                    &rarr;
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <FAB />
      </main>
      <Transition appear show={isStackOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setIsStackOpen(false)}
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-auto rounded-2xl bg-white border-slate-200 border border-solid p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="p-2 text-2xl font-bold leading-6 text-gray-900"
                  >
                    Stack
                  </Dialog.Title>
                  <hr className="border-solid border-black border" />
                  <div className="p-3 overflow-auto grid grid-cols-4 gap-4 items-center content-evenly justify-evenly justify-items-center rounded-b-xl">
                    {user.codingLanguages &&
                      user.codingLanguages.map((language, index) => (
                        <>
                          <div key={index} className="col-span-1">
                            <Tooltip
                              title={language.language}
                              arrow={false}
                              placement="right"
                            >
                              {allIcons[language.language]}
                            </Tooltip>
                          </div>
                          <Progress
                            percent={language.proficiency}
                            format={(percent) => percent}
                            className="col-span-3"
                          />
                        </>
                      ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex flex-row justify-between items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsStackOpen(false)}
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
      <Transition appear show={isQuestionsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setIsQuestionsOpen(false)}
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
                <Dialog.Panel className="w-full max-w-full transform overflow-auto rounded-2xl bg-white border-slate-200 border border-solid p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="p-2 text-2xl font-bold leading-6 text-gray-900"
                  >
                    Questions
                  </Dialog.Title>
                  <hr className="border-solid border-black border" />
                  <div className="flex flex-row items-center justify-center gap-2 mt-2">
                    <button
                      className={`mr-2 text-sm text-black bg-red-400 hover:bg-red-600 hover:text-white hover:scale-110 p-1 border border-solid border-red-500 rounded-full h-5 w-5 flex items-center justify-center ${
                        questionTypeMode === "all" ? "invisible" : null
                      }`}
                      onClick={() => setQuestionTypeMode("all")}
                    >
                      x
                    </button>
                    <button
                      className={`p-2 rounded-full border border-solid border-sky-500 text-sky-500 ${
                        questionTypeMode === "asked" ? "bg-blue-300" : null
                      }`}
                      onClick={() => setQuestionTypeMode("asked")}
                    >
                      <span
                        className={`${
                          questionTypeMode === "asked"
                            ? "bg-blue-300 text-white"
                            : null
                        }`}
                      >
                        Asked Questions
                      </span>
                    </button>
                    <button
                      className={`p-2 rounded-full border border-solid border-sky-500 text-sky-500 ${
                        questionTypeMode === "contributed"
                          ? "bg-blue-300"
                          : null
                      }`}
                      onClick={() => setQuestionTypeMode("contributed")}
                    >
                      <span
                        className={`${
                          questionTypeMode === "contributed"
                            ? "bg-blue-300 text-white"
                            : null
                        }`}
                      >
                        Contributed Questions
                      </span>
                    </button>
                  </div>
                  <div className="p-3 overflow-auto flex flex-col text-left justify-between">
                    <div
                      className={`rounded-b-xl flex flex-col justify-between`}
                    >
                      {questionTypeMode === "all" && (
                        <ul
                          role="list"
                          className="divide-y divide-gray-500 rounded-b-xl"
                        >
                          {userQuestionsAndContributions.allQuestions.map(
                            (question, index) => (
                              <li key={index}>
                                <Link
                                  href={`/questions/${question.id}`}
                                  className="flex justify-between gap-x-6 px-3 py-3"
                                >
                                  <Question
                                    question={question.question}
                                    asker={question.asker.name}
                                    contributors={question.contributors || []}
                                    date={question.date}
                                    answered={question.isAnswered}
                                  />
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                    <div
                      className={`rounded-b-xl flex flex-col justify-between`}
                    >
                      {questionTypeMode === "asked" && (
                        <ul
                          role="list"
                          className="divide-y divide-gray-500 rounded-b-xl"
                        >
                          {userQuestionsAndContributions.askedQuestions.map(
                            (question, index) => (
                              <li key={index}>
                                <Link
                                  href={`/questions/${question.id}`}
                                  className="flex justify-between gap-x-6 px-3 py-3"
                                >
                                  <Question
                                    question={question.question}
                                    asker={question.asker.name}
                                    contributors={question.contributors || []}
                                    date={question.date}
                                    answered={question.isAnswered}
                                  />
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                    <div
                      className={`rounded-b-xl flex flex-col justify-between`}
                    >
                      {questionTypeMode === "contributed" && (
                        <ul
                          role="list"
                          className="divide-y divide-gray-500 rounded-b-xl"
                        >
                          {userQuestionsAndContributions.contributedQuestions.map(
                            (question, index) => (
                              <li key={index}>
                                <Link
                                  href={`/questions/${question.id}`}
                                  className="flex justify-between gap-x-6 px-3 py-3"
                                >
                                  <Question
                                    question={question.question}
                                    asker={question.asker.name}
                                    contributors={question.contributors || []}
                                    date={question.date}
                                    answered={question.isAnswered}
                                  />
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex flex-row justify-between items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsQuestionsOpen(false)}
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
      <Transition appear show={isProjectsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setIsProjectsOpen(false)}
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
                <Dialog.Panel className="w-full max-w-full transform overflow-auto rounded-2xl bg-white border-slate-200 border border-solid p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="p-2 text-2xl font-bold leading-6 text-gray-900"
                  >
                    Projects
                  </Dialog.Title>
                  <hr className="border-solid border-black border" />

                  <div className="p-2 m-2 grid grid-cols-4 gap-5">
                    {projects.map((project, index) => (
                      <Project key={index} project={project} />
                    ))}
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex flex-row justify-between items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsProjectsOpen(false)}
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
      <Transition appear show={newProjectModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 overflow-auto"
          onClose={() => setNewProjectModalOpen(false)}
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
                <Dialog.Panel className="w-1/2 max-w-full transform overflow-auto rounded-2xl bg-white border-slate-200 border border-solid p-6 shadow-xl transition-all">
                  <Dialog.Title
                    as="h1"
                    className="p-2 text-4xl font-bold leading-6 text-gray-900 underline underline-offset-auto"
                  >
                    New Project
                  </Dialog.Title>

                  <NewProjectForm />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UserPage;

/*
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={`w-${getRandomSize()} h-${getRandomSize()} rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 p-4`}
            ></div>
          ))}
        </div>
*/

/*
{user ? (
        <div>
          <h1>ID: {user.id}</h1>
          <h1>Name: {user.name}</h1>
          <h1>About: {user.about}</h1>
          <h1>Languages: {stringifyList(user.codingLanguages)}</h1>
          <h1>Email: {user.email}</h1>
          <h1>Files: {stringifyList(user.fileAttachments)}</h1>
          <h1>Online: {user.isOnline ? "True" : "False"}</h1>
          <h1>Position: {user.position}</h1>
        </div>
      ) : (
        <h1>User Does Not Exist</h1>
      )}
*/

/*
<div className="flex justify-start ml-2 mr-5">
          <Card
            name={user.name}
            position={user.position}
            languages={user.codingLanguages}
            isOnline={user.isOnline}
          />
        </div>

<div className="divide-y divide-gray-600">
          <div>
            <ul role="list" className="divide-y divide-gray-600">
              {userQuestionsAndContributions.askedQuestions.map(
                (question, index) => (
                  <li key={index} className="flex justify-between gap-x-6 py-5">
                    <Question
                      question={question.question}
                      asker={question.asker.name}
                      contributors={question.contributors.length}
                      date={question.date}
                      answered={question.isAnswered}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <ul role="list" className="divide-y divide-gray-600">
              {userQuestionsAndContributions.contributedQuestions.map(
                (question, index) => (
                  <li key={index} className="flex justify-between gap-x-6 py-5">
                    <Question
                      question={question.question}
                      asker={question.asker.name}
                      contributors={question.contributors.length}
                      date={question.date}
                      answered={question.isAnswered}
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
*/

/*
<input
                          id="tech-stack"
                          name="tech-stack"
                          type="text"
                          placeholder="Provide the stack necessary for your project"
                          className="basis-3/5 self-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                        
                        <button
                          type="button"
                          className="basis-[6%] self-center rounded-full py-1.5 text-gray-900 border border-solid border-blue-400 bg-blue-300 hover:bg-blue-500 sm:text-sm sm:leading-6"
                          onClick={() => {}}
                        >
                          +
                        </button>
*/

/*
const [newProjectImage, setNewProjectImage] = useState<string>("");
  const [newProject, setNewProject] = useState<ProjectType>({
    id: 0, // Provide default values or replace with actual values
    owner: users[0],
    name: "",
    description: "",
    startDate: new Date(),
    endDate: undefined, // or specify a default value
    github: "",
    status: "ongoing",
    image: newProjectImage || "",
    stack: [],
    needed: [], // Initialize as an empty array
    application: "",
  });

  console.log(newProject.needed);

const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setNewProjectImage(URL.createObjectURL(img));
    }
  };

  const handleStackChange = (value: string[]) => {
    setNewProject({
      ...newProject,
      stack: value,
    });
  };

  const handleSkillChange = (value: string) => {
    setNewProject({
      ...newProject,
      needed: newProject.needed ? [...newProject.needed, value] : [value],
    });
  };

const [messageApi, contextHolder] = message.useMessage();

  const handleFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (newProject.name.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a project title",
        duration: 3,
      });
    }

    if (newProject.description.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a project description",
        duration: 3,
      });
    }

    if (
      newProject.application?.trim() !== "" &&
      newProject.needed?.length === 0
    ) {
      messageApi.open({
        type: "error",
        content:
          "If you are providing an application link, please provide needed skills for the project.",
        duration: 3,
      });
    } else {
      try {
        // Make database call
        
      } catch (error) {
        // console.log("Error:", error)
      }
    }
  };

<form onSubmit={handleFormSubmit}>
                    <div className="p-2 m-2">
                      <div className="flex flex-col">
                        <label
                          htmlFor="name"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Project Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Coding OH"
                          value={newProject.name === "" ? "" : newProject.name}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              name: e.target.value,
                            })
                          }
                          className="flex flex-col w-full self-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="description"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          placeholder="Coding OH is this web app."
                          rows={7}
                          value={
                            newProject.description === ""
                              ? ""
                              : newProject.description
                          }
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              description: e.target.value,
                            })
                          }
                          className="flex flex-col w-full self-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="status"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Status
                        </label>
                        <div className="self-center">
                          <select
                            id="status"
                            name="status"
                            value={newProject.status}
                            onChange={(e) =>
                              setNewProject({
                                ...newProject,
                                status: e.target.value as
                                  | "ongoing"
                                  | "completed"
                                  | "on_hold",
                              })
                            }
                            className="flex flex-col w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          >
                            <option>Ongoing</option>
                            <option>Completed</option>
                            <option>On Hold</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="github"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Github Repo
                        </label>
                        <input
                          id="github"
                          name="github"
                          type="text"
                          placeholder="www.github.com"
                          value={
                            newProject.github === "" ? "" : newProject.github
                          }
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              github: e.target.value,
                            })
                          }
                          className="flex flex-col w-full self-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="picture"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Associated Picture
                        </label>
                        <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          {newProjectImage === "" ? (
                            <div className="text-center">
                              <FaCamera
                                className="mx-auto h-12 w-12 text-gray-300"
                                aria-hidden="true"
                              />
                              <div className="flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    value={newProject.image}
                                    onChange={onImageChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">
                                PNG, JPG, GIF up to 10MB
                              </p>
                            </div>
                          ) : (
                            <Image
                              src={newProjectImage}
                              width={424}
                              height={172}
                              alt="New Project Picture"
                              className="w-full h-full"
                            />
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="tech-stack"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Tech Stack
                        </label>
                        <div className="flex flex-row justify-center items-center gap-6 w-full">
                          <Select
                            className="w-full"
                            mode="multiple"
                            placeholder="Python, TensorFlow, Pytorch, etc..."
                            onChange={handleStackChange}
                          >
                            {Object.keys(allIcons).map((icon) => (
                              <Option value={icon}>
                                <div className="flex flex-row justify-between items-center px-3">
                                  {allIcons[icon]}
                                  {icon}
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </div>
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="needed"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Needed Skills for Project
                        </label>
                        <Select
                          className="w-full"
                          mode="tags"
                          placeholder="Project Management, Kanban, Cloud Computing..."
                          options={labelValues(uniqueArray(techSkills))}
                          allowClear
                          clearIcon={
                            <IoCloseCircleOutline className="text-red-300 hover:text-red-600" />
                          }
                          onChange={handleSkillChange}
                        />
                      </div>

                      <div className="flex flex-col mt-3">
                        <label
                          htmlFor="application"
                          className="flex flex-col text-sm font-medium leading-6 text-gray-900 mb-1"
                        >
                          Application to Join Project
                        </label>
                        <input
                          id="application"
                          name="application"
                          type="text"
                          placeholder="www.forms.gle/application"
                          value={
                            newProject.application === ""
                              ? ""
                              : newProject.application
                          }
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              application: e.target.value,
                            })
                          }
                          className="flex flex-col w-full self-center rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex flex-row justify-between items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-base font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        Upload
                        <FaUpload className="ml-3 text-base bg-inherit" />
                      </button>
                    </div>
                  </form>
*/
