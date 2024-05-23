"use client";

import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { Badge, Avatar as MAvatar } from "@mui/joy";
import { FaEdit, FaThumbsUp, FaHome } from "react-icons/fa";
import { FaPlus, FaXTwitter, FaThreads } from "react-icons/fa6";
import { Progress, Tooltip } from "antd";
import { MdOutlineKeyboardDoubleArrowRight, MdLogout } from "react-icons/md";
import { BsFilePlusFill } from "react-icons/bs";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { SocialIcon } from "react-social-icons";
import { createClient } from "@/utils/supabase/client";
import sortedIcons from "@/utils/icons";

import {
  Project as ProjectType,
  Proficiency,
  Social,
  Contributor,
} from "@/types";
import { getTopLanguages, getTopQuestions } from "@/utils";
import { Navbar, Question, Project, FAB, NewProjectForm } from "@/components";
import Banner from "@/public/banner.png";
import Avatar from "@/public/avatar.png";

type UserResponse = {
  id: string;
  [key: string]: any;
};

interface Coder {
  id: number;
  created_at?: string;
  first_name: string;
  last_name: string;
  gender?: string;
  birthday?: string;
  timezone: string;
  email_address: string;
  company?: string;
  position?: string;
  city?: string;
  us_state?: string;
  country?: string;
  about?: string;
  background_image?: number;
  skills?: string[];
  socials?: Social[];
  stack?: Proficiency[];
  education?: string;
  auth_id: string;
  profile_image: boolean;
}

interface CoderQuestion {
  id: number;
  created_at?: string;
  asker: Coder;
  question: string;
  tags?: string[];
  description: string;
  answer_preference: string;
  notify_email: boolean;
  notify_desktop: boolean;
  answer?: string;
  artificial_date?: Date | null;
  contributors?: Contributor[];
}

interface Response {
  id: number;
  created_at?: string;
  question_id: number;
  user_id: number;
}

interface CoderProject {
  id: number;
  created_at: string;
  owner: Coder;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  github?: string;
  status?: string;
  project_image?: string;
  stack?: string[];
  skills?: string[];
  application?: string;
}

const UserPage = ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const [supabaseUser, setSupabaseUser] = useState<UserResponse>({ id: "" });
  const [coder, setCoder] = useState<Coder>();
  const [coderQuestions, setCoderQuestions] = useState<CoderQuestion[]>([]);
  const [coderProjects, setCoderProjects] = useState<ProjectType[]>([]);
  const [coderResponses, setCoderResponses] = useState<CoderQuestion[]>([]);
  const combined = Array.from(new Set([...coderQuestions, ...coderResponses]));

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setSupabaseUser(user);
      } else {
        console.error(error);
      }
    };
    const fetchCoder = async () => {
      const { data, error } = await supabase
        .from("coders")
        .select("*")
        .eq("auth_id", params.id)
        .single();
      if (data) {
        setCoder(data);
      } else {
        console.error(error);
      }
    };
    fetchUser();
    fetchCoder();
  }, []);
  console.log(coder);

  const [questionTypeMode, setQuestionTypeMode] = useState<string>("all");
  const [isStackOpen, setIsStackOpen] = useState<boolean>(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [skillsOpen, setSkillsOpen] = useState<boolean>(false);
  const [projectTypeMode, setProjectTypeMode] = useState<string>("all");
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [newProjectModalOpen, setNewProjectModalOpen] =
    useState<boolean>(false);

  // const user = getUser(params.id);
  // if (!user) return false;

  useEffect(() => {
    const fetchCoderQuestions = async () => {
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .eq("asker", coder?.id);

      if (questionsError) {
        console.error(questionsError);
        return;
      }

      const { data: users, error: usersError } = await supabase
        .from("coders")
        .select("*");

      if (usersError) {
        console.error(usersError);
        return;
      }

      const { data: contributions, error: contributionsError } = await supabase
        .from("contributors")
        .select("*");

      if (contributionsError) {
        console.error(contributionsError);
        return;
      }

      const updatedQuestions = questions.map((q) => {
        const user = users.find((u) => u.id === q.asker);
        const questionContributors = contributions
          .filter((c) => c.question_id === q.id)
          .map((c) => {
            const contributorUser = users.find((u) => u.id === c.user_id);
            return {
              ...c,
              question_id: q,
              user_id: contributorUser || c.user_id,
            };
          });

        return {
          ...q,
          asker: user || q.asker,
          contributors: questionContributors,
        };
      });

      console.log(updatedQuestions);
      setCoderQuestions(updatedQuestions);
    };
    const fetchCoderProjects = async () => {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("owner", coder?.id);

      if (projectsError) {
        console.error(projectsError);
        return;
      }

      const { data: users, error: usersError } = await supabase
        .from("coders")
        .select("*");

      if (usersError) {
        console.error(usersError);
        return;
      }

      const updatedProjects = projects.map((p) => {
        const user = users.find((u) => u.id === p.owner);
        return { ...p, owner: user || p.owner }; // Ensures owner is not null if user not found
      });

      console.log(updatedProjects);
      setCoderProjects(updatedProjects);
    };
    const fetchCoderResponses = async () => {
      // Fetch contributions made by the coder
      const { data: contributions, error: contributionsError } = await supabase
        .from("contributors")
        .select("*")
        .eq("user_id", coder?.id);

      if (contributionsError) {
        throw contributionsError;
      }

      if (!contributions || contributions.length === 0) {
        // No contributions found for the coder
        setCoderResponses([]);
        return;
      }

      // Fetch users for the asker and contributor details
      const { data: users, error: usersError } = await supabase
        .from("coders")
        .select("*");

      if (usersError) {
        throw usersError;
      }

      // Extract question_ids from the contributions
      const questionIds = contributions.map((c) => c.question_id);

      // Fetch only the questions that the user has contributed to
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("*")
        .in("id", questionIds);

      if (questionsError) {
        throw questionsError;
      }

      const questionMap: { [key: number]: CoderQuestion } = {};

      // Populate questionMap with questions and their askers
      questions.forEach((q) => {
        const user = users.find((u) => u.id === q.asker);
        const question: CoderQuestion = {
          ...q,
          asker: user || q.asker,
          contributors: [],
        };
        questionMap[q.id] = question;
      });

      // Populate the contributors field in questions
      contributions.forEach((c) => {
        const question = questionMap[c.question_id];
        const user = users.find((u) => u.id === c.user_id);

        if (question) {
          question.contributors?.push({
            ...c,
            question_id: question,
            user_id: user || c.user_id,
          });
        }
      });

      const cResponseArray: CoderQuestion[] = Object.values(questionMap);
      console.log(cResponseArray);
      setCoderResponses(cResponseArray);
    };
    fetchCoderQuestions();
    fetchCoderProjects();
    fetchCoderResponses();
  }, [coder]);

  // const topLanguages: Proficiency[] = user.codingLanguages
  //   ? getTopLanguages(user.codingLanguages, 5)
  //   : [];

  // Function to format location based on provided city, state, and country
  const formatLocation = (
    city?: string,
    state?: string,
    country?: string
  ): string => {
    if (city) {
      if (country && state) {
        return city;
      } else if (country) {
        return city;
      } else if (state) {
        return city;
      } else {
        return city;
      }
    } else if (country) {
      if (state) {
        return country;
      } else {
        return country;
      }
    } else if (state) {
      return state;
    } else {
      return "N/A";
    }
  };

  const coderTopLanguages: Proficiency[] = coder?.stack
    ? getTopLanguages(coder?.stack, 5)
    : [];

  const isOnline = Math.random() > 0.5;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-3 m-0">
        <div className="relative flex h-32 w-full items-center justify-between rounded-xl bg-cover px-10 mb-4">
          <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full mr-20">
              <Badge
                badgeContent={isOnline ? "Online" : "Offline"}
                color={isOnline ? "success" : "danger"}
                size="md"
                variant="soft"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeInset="10%"
              >
                {coder?.profile_image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${params.id}`}
                    alt="profile picture"
                    className="h-full w-full rounded-full"
                    height={108}
                    width={108}
                  />
                ) : (
                  <MAvatar sx={{ "--Avatar-size": "108px" }}>
                    {coder?.first_name[0]}
                    {coder?.last_name[0]}
                  </MAvatar>
                )}
              </Badge>
            </div>
            <div className="flex-grow">
              <h1 className="text-xl font-bold">
                {coder?.first_name} {coder?.last_name}
              </h1>
              <span className="text-lg font-normal">{coder?.position}</span>
              <div className="flex flex-row gap-2">
                <SocialIcon
                  key="email"
                  network="email"
                  url={`mailto:${coder?.email_address}`}
                  style={{ height: 35, width: 35, marginTop: 10 }}
                />
                {coder?.socials
                  ? coder?.socials.map((social, index) =>
                      social.social !== "X" && social.social !== "Threads" ? (
                        <SocialIcon
                          key={index}
                          network={social.social
                            .toLowerCase()
                            .replace(/\s/g, "")}
                          url={
                            social.link.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
                          style={{ height: 35, width: 35, marginTop: "10px" }}
                        />
                      ) : social.social === "X" ? (
                        <Link
                          href={
                            social.link.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
                          className="h-[35px] w-[35px] mt-[10px] rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <FaXTwitter className="text-base" />
                        </Link>
                      ) : (
                        <Link
                          href={
                            social.link.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
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
          {supabaseUser.id === params.id && (
            <div className="flex flex-row gap-3">
              <Link
                href={`/users/${supabaseUser.id}/edit`}
                className="p-3 bg-cyan-300 hover:bg-cyan-400 border border-solid border-cyan-400 hover:border-cyan-500 items-center justify-center flex flex-row rounded-lg"
              >
                <FaEdit className="mr-3 bg-inherit" />
                Edit Profile
              </Link>
              <div
                onClick={handleSignOut}
                className="p-3 cursor-pointer bg-red-300 hover:bg-red-400 border border-solid border-red-400 hover:border-red-500 items-center justify-center flex flex-row rounded-lg"
              >
                <MdLogout className="mr-3 bg-inherit" />
                Log Out
              </div>
            </div>
          )}
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
              coder?.stack && coder?.stack.length > 0 ? "mb-4" : null
            }`}
          />
          {coder?.stack && coder?.stack?.length > 0 ? (
            <div className="pb-3 grid grid-cols-4 gap-4 items-center content-evenly justify-evenly justify-items-center rounded-b-xl">
              {coderTopLanguages
                .sort((a, b) => b.proficiency - a.proficiency)
                .map((language, index) => (
                  <>
                    <div key={index} className="col-span-1">
                      <Tooltip
                        title={language.language}
                        arrow={false}
                        placement="right"
                      >
                        {sortedIcons[language.language]}
                      </Tooltip>
                    </div>
                    <Progress
                      percent={language.proficiency}
                      format={(percent) => percent}
                      className="col-span-3"
                    />
                  </>
                ))}
              {coder.stack && coder.stack.length > 5 ? (
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
          <p className={`ml-3 mt-2 ${coder?.about ? null : "text-green-500"}`}>
            {coder?.about || "Still Finding Myself..."}
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
          {combined && combined.length > 0 ? (
            <>
              <div className={`rounded-b-xl flex flex-col justify-between`}>
                {questionTypeMode === "all" && (
                  <ul
                    role="list"
                    className="divide-y divide-gray-500 rounded-b-xl"
                  >
                    {combined.length <= 5
                      ? combined.map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                contributors={question.contributors || []}
                                date={
                                  question.created_at
                                    ? new Date(
                                        question.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : ""
                                }
                                answered={question.answer ? true : false}
                              />
                            </Link>
                          </li>
                        ))
                      : getTopQuestions(combined, 5).map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                contributors={question.contributors || []}
                                date={
                                  question.created_at
                                    ? new Date(
                                        question.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : ""
                                }
                                answered={question.answer ? true : false}
                              />
                            </Link>
                          </li>
                        ))}
                  </ul>
                )}
                {questionTypeMode === "all" && combined.length > 5 ? (
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
                    {coderQuestions.length <= 5
                      ? coderQuestions.map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                contributors={question.contributors || []}
                                date={
                                  question.created_at
                                    ? new Date(
                                        question.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : ""
                                }
                                answered={question.answer ? true : false}
                              />
                            </Link>
                          </li>
                        ))
                      : getTopQuestions(coderQuestions, 5).map(
                          (question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                  contributors={question.contributors || []}
                                  date={
                                    question.created_at
                                      ? new Date(
                                          question.created_at
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : ""
                                  }
                                  answered={question.answer ? true : false}
                                />
                              </Link>
                            </li>
                          )
                        )}
                  </ul>
                )}
                {questionTypeMode === "asked" && coderQuestions.length > 5 ? (
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
                    {coderResponses.length <= 5
                      ? coderResponses.map((question, index) => (
                          <li key={index}>
                            <Link
                              href={`/questions/${question.id}`}
                              className="flex justify-between gap-x-6 px-3 py-3"
                            >
                              <Question
                                question={question.question}
                                asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                contributors={question.contributors || []}
                                date={
                                  question.created_at
                                    ? new Date(
                                        question.created_at
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : ""
                                }
                                answered={question.answer ? true : false}
                              />
                            </Link>
                          </li>
                        ))
                      : getTopQuestions(coderResponses, 5).map(
                          (question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                  contributors={question.contributors || []}
                                  date={
                                    question.created_at
                                      ? new Date(
                                          question.created_at
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : ""
                                  }
                                  answered={question.answer ? true : false}
                                />
                              </Link>
                            </li>
                          )
                        )}
                  </ul>
                )}
                {questionTypeMode === "contributed" &&
                coderResponses.length > 5 ? (
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
                {coder?.education || "N/A"}
              </dd>
            </div>
            <div className="p-1 sm:flex sm:items-center sm:gap-4 sm:px-0">
              <dt className="ml-2 text-base font-bold leading-6 text-gray-900 sm:flex-none">
                Employer
              </dt>
              <dd className="mr-2 text-base leading-6 text-gray-700 sm:flex-1 sm:text-right">
                {coder?.company || "N/A"}
              </dd>
            </div>
            <div className="p-1 sm:flex sm:items-center sm:gap-4 sm:px-0">
              <dt className="ml-2 text-base font-bold leading-6 text-gray-900 sm:flex-none">
                Location
              </dt>
              <dd className="mr-2 text-base leading-6 text-gray-700 sm:flex-1 sm:text-right">
                {formatLocation(coder?.city, coder?.us_state, coder?.country)}
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
              {coder?.skills &&
                coder?.skills.map((skill, index) => (
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
              {supabaseUser.id === params.id && (
                <BsFilePlusFill
                  className="text-2xl hover:text-green-500 cursor-pointer"
                  onClick={() => setNewProjectModalOpen(true)}
                />
              )}
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
              coderProjects.length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "all" && (
              <>
                {coderProjects.length !== 0 ? (
                  coderProjects.length <= 6 ? (
                    coderProjects.map((project, index) => (
                      <Project project={project} key={index} />
                    ))
                  ) : (
                    coderProjects
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
            {projectTypeMode === "all" && coderProjects.length > 6 ? (
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
              coderProjects.filter((project) => project.status === "ongoing")
                .length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "ongoing" && (
              <>
                {coderProjects.filter((project) => project.status === "ongoing")
                  .length !== 0 ? (
                  coderProjects.filter(
                    (project) => project.status === "ongoing"
                  ).length <= 6 ? (
                    coderProjects
                      .filter((project) => project.status === "ongoing")
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  ) : (
                    coderProjects
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
            coderProjects.filter((project) => project.status === "ongoing")
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
              coderProjects.filter((project) => project.status === "completed")
                .length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "completed" && (
              <>
                {coderProjects.filter(
                  (project) => project.status === "completed"
                ).length !== 0 ? (
                  coderProjects.filter(
                    (project) => project.status === "completed"
                  ).length <= 6 ? (
                    coderProjects
                      .filter((project) => project.status === "completed")
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  ) : (
                    coderProjects
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
            coderProjects.filter((project) => project.status === "completed")
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
              coderProjects.filter((project) => project.status === "on_hold")
                .length !== 0
                ? "grid grid-cols-3 grid-rows-2 gap-5"
                : "flex items-center justify-center"
            }`}
          >
            {projectTypeMode === "on_hold" && (
              <>
                {coderProjects.filter((project) => project.status === "on_hold")
                  .length !== 0 ? (
                  coderProjects.filter(
                    (project) => project.status === "on_hold"
                  ).length <= 6 ? (
                    coderProjects
                      .filter((project) => project.status === "on_hold")
                      .map((project, index) => (
                        <Project key={index} project={project} />
                      ))
                  ) : (
                    coderProjects
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
            coderProjects.filter((project) => project.status === "on_hold")
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
                    {coder?.stack &&
                      coder?.stack.map((language, index) => (
                        <>
                          <div key={index} className="col-span-1">
                            <Tooltip
                              title={language.language}
                              arrow={false}
                              placement="right"
                            >
                              {sortedIcons[language.language]}
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
                          {combined.map((question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                  contributors={question.contributors || []}
                                  date={
                                    question.created_at
                                      ? new Date(
                                          question.created_at
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : ""
                                  }
                                  answered={question.answer ? true : false}
                                />
                              </Link>
                            </li>
                          ))}
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
                          {coderQuestions.map((question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                  contributors={question.contributors || []}
                                  date={
                                    question.created_at
                                      ? new Date(
                                          question.created_at
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : ""
                                  }
                                  answered={question.answer ? true : false}
                                />
                              </Link>
                            </li>
                          ))}
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
                          {coderResponses.map((question, index) => (
                            <li key={index}>
                              <Link
                                href={`/questions/${question.id}`}
                                className="flex justify-between gap-x-6 px-3 py-3"
                              >
                                <Question
                                  question={question.question}
                                  asker={`${question.asker.first_name} ${question.asker.last_name}`}
                                  contributors={question.contributors || []}
                                  date={
                                    question.created_at
                                      ? new Date(
                                          question.created_at
                                        ).toLocaleDateString("en-US", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        })
                                      : ""
                                  }
                                  answered={question.answer ? true : false}
                                />
                              </Link>
                            </li>
                          ))}
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
                    {coderProjects.map((project, index) => (
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
