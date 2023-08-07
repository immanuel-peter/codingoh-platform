import React, { useState } from "react";
import Link from "next/link";
import { SocialIcon } from "react-social-icons";

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
  const [isProjectGithubHovered, setIsProjectGithubHovered] = useState(false);

  //   const handleIconMouseEnter = (index: number) => {
  //     const updatedState = [...isProjectGithubHovered];
  //     updatedState[index] = true;
  //     setIsProjectGithubHovered(updatedState);
  //   };

  //   const handleIconMouseLeave = (index: number) => {
  //     const updatedState = [...isProjectGithubHovered];
  //     updatedState[index] = false;
  //     setIsProjectGithubHovered(updatedState);
  //   };

  return (
    <>
      <article
        className={`overflow-hidden rounded-lg border border-gray-200 ${getBgColor(
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
            className={`flex justify-end ${getBgColor(project.status)}`}
            onMouseEnter={() => setIsProjectGithubHovered(true)}
            onMouseLeave={() => setIsProjectGithubHovered(false)}
          >
            <SocialIcon
              url="https://www.github.com"
              className={`mt-4 outline-none ${getBgColor(project.status)}`}
              style={{
                height: isProjectGithubHovered ? 40 : 30,
                width: isProjectGithubHovered ? 40 : 30,
                transition: "height 0.3s, width 0.3s", // Add a transition for smooth animation
              }}
            />
          </div>
        </div>
      </article>
    </>
  );
};

export default Project;
