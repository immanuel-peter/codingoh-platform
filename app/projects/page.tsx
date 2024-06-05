"use client";

import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { createClient } from "@/utils/supabase/client";

import { Navbar, Project, FAB, NewFAB } from "@/components";
import { combineText } from "@/utils";
import { Coder, Project as ProjectType } from "@/types";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On Hold" },
];

const Page = () => {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; [key: string]: any }>();
  const [coder, setCoder] = useState<Coder>();
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const [projQuery, setProjQuery] = useState<string>("");
  const [status, setStatus] = useState<string>("all");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: coder, error } = await supabase
          .from("coders")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        if (coder) {
          setCoder(coder);
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    };
    const fetchProjects = async () => {
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*");
      if (projects) {
        let ownerIds = projects.map((project) => project.owner);
        const { data: coders, error: codersError } = await supabase
          .from("coders")
          .select("*")
          .in("id", ownerIds);
        if (coders) {
          projects.forEach((project) => {
            project.owner = coders.find((coder) => coder.id === project.owner);
          });
        } else {
          console.error(codersError);
        }
        setProjects(projects);
      } else {
        console.error(projectsError);
      }
    };
    fetchUser();
    fetchProjects();
  }, []);

  const sortedProjects = projects?.sort((a, b) =>
    a.start_date && b.start_date
      ? new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      : 0
  );

  const handleChange = (value: string) => {
    setStatus(value);
  };

  return (
    <>
      <Navbar />
      <div className="px-20 mt-5 flex justify-between items-end">
        <input
          type="text"
          value={projQuery}
          onChange={(e) => setProjQuery(e.target.value)}
          placeholder="Find a project..."
          className="w-7/12 rounded-full border-black border-solid border p-3 pe-10 shadow-sm sm:text-sm"
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
              ?.filter((project) =>
                combineText(
                  project.name ?? "",
                  project.description ?? "",
                  project.owner?.first_name ?? "",
                  project.owner?.last_name ?? "",
                  project.stack?.join(", ") ?? "",
                  project.skills?.join(", ") ?? ""
                )
                  .toLowerCase()
                  .includes(projQuery.toLowerCase())
              )
              .map((project, index) => (
                <Project project={project} key={index} />
              ))
          : sortedProjects
              ?.filter((project) => project.status === status)
              .filter((project) =>
                combineText(
                  project.name ?? "",
                  project.description ?? "",
                  project.owner?.first_name ?? "",
                  project.owner?.last_name ?? "",
                  project.stack?.join(", ") ?? "",
                  project.skills?.join(", ") ?? ""
                )
                  .toLowerCase()
                  .includes(projQuery.toLowerCase())
              )
              .map((project, index) => (
                <Project project={project} key={index} />
              ))}
      </div>
      <FAB />
    </>
  );
};

export default Page;
