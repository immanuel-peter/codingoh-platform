"use client";

import React, { useState } from "react";
import { Select } from "antd";

import { projects } from "@/dummy/questions";
import { Navbar, Project } from "@/components";
import { combineText } from "@/utils";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const page = () => {
  const sortedProjects = projects.sort(
    (a, b) => b.startDate.getTime() - a.startDate.getTime()
  );

  const [projQuery, setProjQuery] = useState("");
  const [status, setStatus] = useState("all");

  const handleChange = (value: string) => {
    setStatus(value);
  };

  return (
    <>
      <Navbar />
      <div className="px-20 mt-5 flex justify-between items-center">
        <input
          type="text"
          value={projQuery}
          onChange={(e) => setProjQuery(e.target.value)}
          placeholder="Find a project..."
          className="w-7/12 rounded-md border-black border-solid border p-3 pe-10 shadow-sm sm:text-sm"
        />
        <Select
          defaultValue="all"
          style={{ width: 160 }}
          size="large"
          onChange={handleChange}
          options={statusOptions}
        />
      </div>
      <div className="p-20 pt-10 grid grid-cols-4 gap-4">
        {status === "all"
          ? sortedProjects
              .filter((project) =>
                combineText(project.name, project.description)
                  .toLowerCase()
                  .includes(projQuery.toLowerCase())
              )
              .map((project, index) => (
                <Project project={project} key={index} />
              ))
          : sortedProjects
              .filter((project) => project.status === status)
              .filter((project) =>
                combineText(project.name, project.description)
                  .toLowerCase()
                  .includes(projQuery.toLowerCase())
              )
              .map((project, index) => (
                <Project project={project} key={index} />
              ))}
      </div>
    </>
  );
};

export default page;
