"use client";

import React, { useEffect, useState } from "react";
import { FaGithub, FaLink } from "react-icons/fa6";
import { Select, message } from "antd";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { techSkills } from "@/dummy/questions";
import { Project } from "@/types";
import Navbar from "@/components/Navbar";
import sortedIcons from "@/utils/icons";
import { labelValues, uniqueArray } from "@/utils";
import { IoCloseCircleOutline } from "react-icons/io5";

const { Option } = Select;

const Page = ({ params }: { params: { id: string } }) => {
  const supabase = createClient();
  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const fetchProject = async () => {
      const { data: projectRetrievalData, error: projectRetrievalError } =
        await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single();
      if (projectRetrievalError) {
        console.error(projectRetrievalError);
        router.push("/");
      } else {
        const { data: coder, error: coderError } = await supabase
          .from("coders")
          .select("*")
          .eq("id", projectRetrievalData.owner)
          .single();
        const retrievedProject = { ...projectRetrievalData, owner: coder };
        setProject(retrievedProject);

        if (projectRetrievalData.project_image) {
          setProjectImg(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projectImages/projImage-${params.id}`
          );
        }
        setName(projectRetrievalData.name);
        setDescription(projectRetrievalData.description);
        setStartDate(projectRetrievalData.start_date);
        setEndDate(projectRetrievalData.end_date);
        setGithub(projectRetrievalData.github);
        setStatus(projectRetrievalData.status);
        setStack(projectRetrievalData.stack);
        setNeeded(projectRetrievalData.skills);
        setApplication(projectRetrievalData.application);
      }
    };
    fetchProject();
  }, []);

  // const project = getProject(params.id);
  // if (!project) return false;
  const projectCopy = Object.assign({}, project);

  const [newProjectImg, setNewProjectImg] = useState<File | null>(null);
  const [projectImg, setProjectImg] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | string | null>(null);
  const [endDate, setEndDate] = useState<Date | string | null>(null);
  const [github, setGithub] = useState<string | null>("");
  const [status, setStatus] = useState<string>("");
  const [stack, setStack] = useState<string[] | null>([]);
  const [needed, setNeeded] = useState<string[] | null>([]);
  const [application, setApplication] = useState<string | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const formattedDate = (date: Date | null): string => {
    return date instanceof Date ? date.toISOString().split("T")[0] : "";
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProjectImg(URL.createObjectURL(img));
      setNewProjectImg(img);
    }
  };

  const handleStackChange = (value: string[]) => {
    setStack(value);
  };
  const handleStackDeselect = (value: string) => {
    const newStack = stack?.filter((s) => s !== value) ?? null;
    setStack(newStack);
  };

  const handleSkillChange = (value: string) => {
    needed && setNeeded([...needed, value]);
  };
  const handleSkillDeselect = (value: string) => {
    const newSkills = needed?.filter((skill) => skill !== value) ?? null;
    setNeeded(newSkills);
  };

  const projectData = {
    projectImg,
    name,
    description,
    startDate,
    endDate,
    github,
    status,
    stack,
    needed,
    application: application || null,
  };
  console.log(projectData);

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const updatedProjectData = {
      name: name,
      description: description,
      start_date: startDate,
      end_date: endDate,
      github: github,
      status: status,
      stack: stack,
      skills: needed,
      application: application || null,
    };

    if (
      projectData.name.trim() === "" ||
      projectData.description.trim() === "" ||
      !projectData.startDate ||
      projectData.status.trim() === ""
    ) {
      messageApi.open({
        type: "error",
        content: "Please fill in all required fields",
        duration: 3,
      });
    } else {
      try {
        // Make database call
        // console.log("Added user to database:", userData.firstName, userData.lastName)
        // Redirect to dev profile page '/users/{/* id given by database */}'
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .update(updatedProjectData)
          .eq("id", project?.id)
          .select();

        if (projectError) {
          console.log("Faulty data:", updatedProjectData);
          console.log("Error updating project:", projectError);
          return;
        }

        console.log("Successfully updated project:", projectData);

        if (newProjectImg) {
          const { data: imageData, error: imageError } = await supabase.storage
            .from("projectImages")
            .upload(`projImage-${params.id}`, newProjectImg, { upsert: true });

          if (imageError) {
            console.log("Error updating project image:", imageError);
            return;
          }

          console.log("Project image updated:", imageData);
        }

        router.push(`/users/${project?.owner?.auth_id}`);
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const isProjectImage = project?.project_image;
      const ownerId = project?.owner?.auth_id;

      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", params.id);

      if (isProjectImage) {
        const { data, error } = await supabase.storage
          .from("projectImages")
          .remove([`projImage-${params.id}`]);

        if (error) {
          console.error("Error:", error);
        } else {
          console.log("Successfully deleted project image:", data);
        }
      }

      if (error) {
        console.error("Error:", error);
      } else {
        console.log("Successfully deleted project");
        router.push(`/users/${ownerId}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleFormClear = () => {
    setProjectImg(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/projectImages/projImage-${params.id}`
    );
    setName(projectCopy.name ?? "");
    setDescription(projectCopy.description ?? "");
    setStartDate(projectCopy.start_date ?? null);
    setEndDate(projectCopy.end_date ?? null);
    setGithub(projectCopy.github ?? null);
    setStatus(projectCopy.status ?? "ongoing");
    setStack(projectCopy.stack ?? null);
    setNeeded(projectCopy.skills ?? null);
    setApplication(projectCopy.application ?? null);
  };

  return (
    <>
      {contextHolder}
      <Navbar />
      <form
        className="mt-5 px-4 pb-3 flex flex-col items-center justify-center max-w-7xl"
        onSubmit={handleFormSubmit}
      >
        <div className="space-y-12">
          <div className="pb-4">
            <h2 className="text-base font-semibold leading-3 text-gray-900">
              Edit Project
            </h2>
            <span className="text-xs">
              <sup className="text-red-500">*</sup> Required fields
            </span>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="project-image"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Display Image{" "}
                  <span className="font-light leading-4">(optional)</span>
                </label>
                <img
                  src={
                    projectImg ||
                    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  }
                  alt="Associated Project Image"
                  className="h-96 w-4/5 object-cover border-2 border-black border-solid"
                />
                <div className="mt-3">
                  <label className="p-1.5 border border-solid border-gray-400 rounded-full cursor-pointer bg-gray-100 hover:bg-gray-200 shadow-sm font-medium">
                    Change
                    <input
                      type="file"
                      name="profile-img"
                      onChange={onImageChange} // need to work on this
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Owner Name <sup className="text-red-500">*</sup>
                </label>
                <div>
                  <input
                    value={`${project?.owner?.first_name} ${project?.owner?.last_name}`}
                    type="text"
                    name="first-name"
                    id="first-name"
                    disabled
                    className="block w-full rounded-md border-0 py-1.5 bg-slate-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Name <sup className="text-red-500">*</sup>
                </label>
                <div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="project-name"
                    id="project-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Description <sup className="text-red-500">*</sup>
                </label>
                <div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="about"
                    name="about"
                    rows={6}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Start Date <sup className="text-red-500">*</sup>
                </label>
                <div>
                  <input
                    value={
                      startDate
                        ? new Date(startDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setStartDate(isNaN(newDate.getTime()) ? "" : newDate);
                    }}
                    type="date"
                    name="start-date"
                    id="start-date"
                    autoComplete="bday"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  End Date{" "}
                  <span className="font-light leading-4">(optional)</span>
                </label>
                <div>
                  <input
                    value={
                      endDate
                        ? new Date(endDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setEndDate(isNaN(newDate.getTime()) ? "" : newDate);
                    }}
                    type="date"
                    name="end-date"
                    id="end-date"
                    max={new Date().toISOString().split("T")[0]}
                    autoComplete="bday"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="github"
                  className="flex flex-row gap-1 items-center text-sm font-medium leading-6 text-gray-900"
                >
                  GitHub Repo <FaGithub className="leading-5" />{" "}
                  <span className="font-light leading-4">(optional)</span>
                </label>
                <div>
                  <input
                    value={github || ""}
                    onChange={(e) => {
                      setGithub(e.target.value);
                    }}
                    type="text"
                    name="github"
                    id="github"
                    placeholder="https://www.github.com/username/repository"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="status"
                  className="flex flex-row gap-1 items-center text-sm font-medium leading-6 text-gray-900"
                >
                  Status <sup className="text-red-500">*</sup>
                </label>
                <div>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(
                        e.target.value as "ongoing" | "completed" | "on_hold"
                      )
                    }
                    className="flex flex-col w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="stack"
                  className="flex flex-row gap-1 items-center text-sm font-medium leading-6 text-gray-900"
                >
                  Tech Stack{" "}
                  <span className="font-light leading-4">(optional)</span>
                </label>
                <div>
                  <Select
                    className="w-full"
                    mode="multiple"
                    placeholder="Python, TensorFlow, Pytorch, etc..."
                    value={stack}
                    onChange={handleStackChange}
                    onDeselect={handleStackDeselect}
                  >
                    {Object.keys(sortedIcons).map((icon) => (
                      <Option value={icon}>
                        <div className="flex flex-row justify-between items-center px-3">
                          {sortedIcons[icon]}
                          {icon}
                        </div>
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="needed"
                  className="flex flex-row gap-1 items-center text-sm font-medium leading-6 text-gray-900"
                >
                  Needed Skills{" "}
                  <span className="font-light leading-4">(optional)</span>
                </label>
                <div>
                  <Select
                    className="w-full grow-0"
                    mode="tags"
                    placeholder="Project Management, Kanban, Cloud Computing..."
                    options={labelValues(uniqueArray(techSkills))}
                    allowClear
                    clearIcon={
                      <IoCloseCircleOutline className="text-red-300 hover:text-red-600" />
                    }
                    value={needed} // Fix: Ensure value is of type string | null | undefined
                    onDeselect={handleSkillDeselect}
                    onSelect={handleSkillChange}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="application"
                  className="flex flex-row gap-1 items-center text-sm font-medium leading-6 text-gray-900"
                >
                  Application to Join Project <FaLink className="leading-5" />{" "}
                  <span className="font-light leading-4">(optional)</span>
                </label>
                <div>
                  <input
                    value={application || ""}
                    onChange={(e) => {
                      setApplication(e.target.value);
                    }}
                    type="text"
                    name="application"
                    id="application"
                    placeholder="https://www.forms.gle/application"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-start gap-x-3">
              <button
                type="button"
                className="text-sm font-semibold text-gray-900 border border-solid border-gray-400 hover:bg-gray-300 px-3 py-2 rounded-full"
                onClick={handleFormClear}
              >
                Reset
              </button>
              <button
                type="button"
                className="rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Page;
