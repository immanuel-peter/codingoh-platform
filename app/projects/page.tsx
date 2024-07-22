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
        .select(
          `id, owner (first_name, last_name, auth_id), name, description, status, github, stack, skills, project_image, application`
        )
        .order("created_at", { ascending: false });

      if (projects) {
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

        setProjects(updatedProjects);

        // let ownerIds = projects.map((project) => project.owner);
        // const { data: coders, error: codersError } = await supabase
        //   .from("coders")
        //   .select("*")
        //   .in("id", ownerIds);
        // if (coders) {
        //   projects.forEach((project) => {
        //     project.owner = coders.find((coder) => coder.id === project.owner);
        //   });
        // } else {
        //   console.error(codersError);
        // }
        // setProjects(projects);
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
