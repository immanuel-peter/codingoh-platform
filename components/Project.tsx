import React from "react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";
import { FaGithub } from "react-icons/fa6";

import { projects } from "@/dummy/questions";
import { Project as ProjectType } from "@/types";

const getBgColor = (status: string): string => {
  switch (status) {
    case "ongoing":
      return "bg-amber-100";
    case "completed":
      return "bg-green-100";
    case "on_hold":
      return "bg-orange-100";
    default:
      return "bg-white";
  }
};

const Project = ({ project }: { project: ProjectType }) => {
  return (
    <>
      <article
        className={`overflow-hidden rounded-lg min-h-[350px] border border-gray-200 ${getBgColor(
          project.status
        )} shadow-sm`}
      >
        <img
          alt="Office"
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          className="h-56 w-full object-cover"
        />
        <div
          className={`p-4 flex flex-col justify-between flex-grow ${getBgColor(
            project.status
          )}`}
        >
          <div className="bg-inherit">
            <Link href="/" className={getBgColor(project.status)}>
              <h3
                className={`text-lg font-medium text-gray-900 ${getBgColor(
                  project.status
                )}`}
              >
                {project.name}
              </h3>
            </Link>
            <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500 bg-inherit">
              {project.description}
            </p>
          </div>

          <div
            className={`flex justify-between justify-items-end items-end ${getBgColor(
              project.status
            )}`}
          >
            <Link
              href={`/users/${project.owner?.id}`}
              className="bg-inherit text-sm hover:underline"
            >
              {project.owner?.name}
            </Link>
            <Link href="https://www.github.com">
              <FaGithub
                className={`${getBgColor(
                  project.status
                )} h-7 w-7 hover:scale-150 transition duration-300`}
              />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default Project;
