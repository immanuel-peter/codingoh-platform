"use client";

import React, { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { FaEdit, FaThumbsUp, FaHome } from "react-icons/fa";
import {
  FaPlus,
  FaXTwitter,
  FaThreads,
  FaShare,
  FaLink,
} from "react-icons/fa6";
import { Progress, Tooltip, message, Badge, Avatar as DAvatar } from "antd";
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
  Contributor,
  Coder,
  Question as QuestionType,
} from "@/types";
import { getTopLanguages, getTopQuestions } from "@/utils";
import { Navbar, Question, Project, FAB, NewProjectForm } from "@/components";
import backgrounds from "@/public/backgrounds";
import Banner from "@/public/banner.png";
import Avatar from "@/public/avatar.png";

type UserResponse = {
  id: string;
  [key: string]: any;
};

const UserPage = ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const [supabaseUser, setSupabaseUser] = useState<UserResponse>({ id: "" });
  const [coder, setCoder] = useState<Coder>();
  const [coderQuestions, setCoderQuestions] = useState<QuestionType[]>([]);
  const [coderProjects, setCoderProjects] = useState<ProjectType[]>([]);
  const [coderResponses, setCoderResponses] = useState<QuestionType[]>([]);
  const combined = Array.from(new Set([...coderQuestions, ...coderResponses]));
  const [messageApi, contextHolder] = message.useMessage();

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
  // console.log(coder);

  const [questionTypeMode, setQuestionTypeMode] = useState<string>("all");
  const [isStackOpen, setIsStackOpen] = useState<boolean>(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState<boolean>(false);
  const [skillsOpen, setSkillsOpen] = useState<boolean>(false);
  const [projectTypeMode, setProjectTypeMode] = useState<string>("all");
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [newProjectModalOpen, setNewProjectModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchCoderQuestions = async () => {
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
        .eq("asker", coder?.id)
        .order("created_at", { ascending: false });

      if (questionsError) {
        console.error(questionsError);
        return;
      }

      const updatedQuestions = questions.map((q) => {
        const { id, created_at, asker, question, contributors, meeters } = q;

        const updatedAsker: Coder = {
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
            id: c.user_id.id as number,
            first_name: c.user_id.first_name as string,
            last_name: c.user_id.last_name as string,
            profile_image: c.user_id.profile_image as boolean,
            auth_id: c.user_id.auth_id as string,
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
      setCoderQuestions(updatedQuestions);
    };
    const fetchCoderProjects = async () => {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select(
          `id, owner (first_name, last_name, auth_id), name, description, status, github, stack, skills, project_image, application`
        )
        .eq("owner", coder?.id);

      if (projectsError) {
        console.error(projectsError);
        return;
      }

      const updatedProjects: ProjectType[] = projects.map((project) => {
        const updatedOwner: Coder = {
          first_name: project.owner.first_name as string,
          last_name: project.owner.last_name as string,
          auth_id: project.owner.auth_id as string,
        };

        return {
          id: project.id as number,
          owner: updatedOwner, // Updated owner object
          name: project.name as string,
          description: project.description as string,
          status: project.status as string,
          github: project.github as string,
          stack: project.stack as string[],
          skills: project.skills as string[],
          project_image: project.project_image as boolean,
          application: project.application as string,
        };
      });

      setCoderProjects(updatedProjects);
    };
    const fetchCoderResponses = async () => {
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
        .order("created_at", { ascending: false });

      if (questionsError) {
        console.error(questionsError);
        return;
      } else {
        console.log(questions);
      }

      const updatedQuestions: QuestionType[] = questions.map((q) => {
        const { id, created_at, asker, question, contributors, meeters } = q;

        const updatedAsker: Coder = {
          id: asker.id as number,
          first_name: asker.first_name as string,
          last_name: asker.last_name as string,
        };

        const newMeeters = meeters.filter(
          (m) => m.user_id.auth_id == params.id && m.is_done
        );
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
            id: c.user_id.id as number,
            first_name: c.user_id.first_name as string,
            last_name: c.user_id.last_name as string,
            profile_image: c.user_id.profile_image as boolean,
            auth_id: c.user_id.auth_id as string,
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

      const finalQuestions: QuestionType[] = updatedQuestions.filter((q) =>
        q.contributors?.some(
          (c) => c.user_id?.id === coder?.id && c.user_id?.id !== q.asker?.id
        )
      );
      setCoderResponses(finalQuestions);
    };
    fetchCoderQuestions();
    fetchCoderProjects();
    fetchCoderResponses();
  }, [coder]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    messageApi.open({
      type: "info",
      content: "Link copied to clipboard",
      duration: 3,
    });
  };

  const addProject = (project: ProjectType) => {
    setCoderProjects([...coderProjects, project]);
    setNewProjectModalOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Navbar />
      <div className="p-3 m-0">
        <div className="relative flex h-32 w-full items-center justify-between rounded-xl bg-cover px-10 mb-4">
          <div className="flex flex-row items-center justify-between gap-x-4">
            <div className="flex items-center justify-center rounded-full mr-8">
              <Badge
                color={isOnline ? "green" : "red"}
                status={isOnline ? "success" : "error"}
                offset={[0, 35]}
              >
                {coder?.profile_image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${params.id}`}
                    alt="profile picture"
                    className="rounded-full"
                    height={100}
                    width={100}
                  />
                ) : (
                  <DAvatar size={108}>
                    {coder?.first_name && coder.first_name[0]}
                    {coder?.last_name && coder.last_name[0]}
                  </DAvatar>
                )}
              </Badge>
            </div>
            <div className="flex-grow">
              <h1 className="text-xl font-bold">
                {coder?.first_name} {coder?.last_name}
              </h1>
              <span className="text-lg font-normal">{coder?.position}</span>
              <div className="flex flex-row gap-2">
                {coder?.socials
                  ? coder?.socials.map((social, index) =>
                      social.social?.toLowerCase() !== "x" &&
                      social.social?.toLowerCase() !== "threads" &&
                      social.social?.toLowerCase() !== "personal" ? (
                        <SocialIcon
                          key={index}
                          network={social.social
                            ?.toLowerCase()
                            .replace(/\s/g, "")}
                          url={
                            social.link?.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
                          style={{ height: 35, width: 35, marginTop: "10px" }}
                        />
                      ) : social.social?.toLowerCase() === "x" ? (
                        <Link
                          href={
                            social.link?.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
                          className="h-[35px] w-[35px] mt-[10px] bg-black text-white rounded-full flex items-center justify-center"
                        >
                          <FaXTwitter className="text-base" />
                        </Link>
                      ) : social.social?.toLowerCase() === "threads" ? (
                        <Link
                          href={
                            social.link?.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
                          className="h-[35px] w-[35px] mt-[10px] rounded-full bg-black text-white flex items-center justify-center"
                        >
                          <FaThreads className="text-base" />
                        </Link>
                      ) : (
                        <Link
                          href={
                            social.link?.startsWith("https://")
                              ? social.link
                              : `https://${social.link}`
                          }
                          className="h-[35px] w-[35px] mt-[10px] rounded-full bg-gray-300 text-black flex items-center justify-center"
                        >
                          <FaLink className="text-base" />
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
                onClick={handleCopyLink}
                className="p-3 cursor-pointer bg-orange-300 hover:bg-orange-400 border border-solid border-orange-400 hover:border-orange-500 items-center justify-center flex flex-row rounded-lg"
              >
                <FaShare className="mr-3 bg-inherit" />
                Share Profile
              </div>
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
          src={backgrounds[coder?.background_image ?? 0]}
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
            <div className="pb-3 pr-2 grid grid-cols-4 gap-4 items-center content-evenly justify-evenly justify-items-center rounded-b-xl">
              {coderTopLanguages
                .sort((a, b) =>
                  b.proficiency && a.proficiency
                    ? b.proficiency - a.proficiency
                    : 0
                )
                .map((language, index) => (
                  <>
                    <div key={index} className="col-span-1">
                      <Tooltip
                        title={language.language}
                        arrow={false}
                        placement="right"
                      >
                        {sortedIcons[language.language ?? ""]}
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
                                question={question.question ?? ""}
                                asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                question={question.question ?? ""}
                                asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                question={question.question ?? ""}
                                asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                  question={question.question ?? ""}
                                  asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                question={question.question ?? ""}
                                asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                  question={question.question ?? ""}
                                  asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                              {sortedIcons[language.language ?? ""]}
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
                                  question={question.question ?? ""}
                                  asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                  question={question.question ?? ""}
                                  asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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
                                  question={question.question ?? ""}
                                  asker={`${question.asker?.first_name} ${question.asker?.last_name}`}
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

                  <NewProjectForm onOk={addProject} />
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
