"use client";

import React, { useState } from "react";
import { FaGithub, FaLink } from "react-icons/fa6";
import { Select, message } from "antd";
import { useRouter } from "next/navigation";

import { projects, techSkills } from "@/dummy/questions";
import { Project } from "@/types";
import Navbar from "@/components/Navbar";
import { allIcons } from "@/utils/icons";
import { labelValues, uniqueArray } from "@/utils";
import { IoCloseCircleOutline } from "react-icons/io5";

const getProject = (projectId: string): Project | undefined => {
  return projects.find((project) => project.id === Number(projectId));
};

const { Option } = Select;

const Page = ({ params }: { params: { id: string } }) => {
  const project = getProject(params.id);
  if (!project) return false;
  const projectCopy = project;

  const [profileImg, setProfileImg] = useState<string>(project.image);
  const owner: string = project.owner.name;
  const [name, setName] = useState<string>(project.name);
  const [description, setDescription] = useState<string>(project.description);
  const [startDate, setStartDate] = useState<Date | undefined>(
    project.startDate
  );
  const [endDate, setEndDate] = useState<Date | undefined>(project.endDate);
  const [github, setGithub] = useState<string | undefined>(project.github);
  const [status, setStatus] = useState<string>(project.status);
  const [stack, setStack] = useState<string[] | undefined>(project.stack);
  const [needed, setNeeded] = useState<string[] | undefined>(project.needed);
  const [application, setApplication] = useState<string | undefined>(
    project.application
  );

  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const formattedDate = (date: Date | undefined): string => {
    return date instanceof Date ? date.toISOString().split("T")[0] : "";
  };

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProfileImg(URL.createObjectURL(img));
    }
  };

  const handleStackChange = (value: string[]) => {
    setStack(value);
  };
  const handleStackDeselect = (value: string) => {
    const newStack = stack?.filter((s) => s !== value);
    setStack(newStack);
  };

  const handleSkillChange = (value: string) => {
    needed && setNeeded([...needed, value]);
  };
  const handleSkillDeselect = (value: string) => {
    const newSkills = needed?.filter((skill) => skill !== value);
    setNeeded(newSkills);
  };

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const projectData = {
      profileImg,
      name,
      description,
      startDate,
      endDate,
      github,
      status,
      stack,
      needed,
      application,
    };

    if (
      projectData.name.trim() === "" &&
      projectData.description.trim() === "" &&
      !projectData.startDate &&
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
        router.push(`/users/${project.owner.id}`);
      } catch (error) {
        // console.log("Error:", error)
      }
    }
  };

  const handleFormClear = () => {
    setProfileImg(projectCopy.image);
    setName(projectCopy.name);
    setDescription(projectCopy.description);
    setStartDate(projectCopy.startDate);
    setEndDate(projectCopy.endDate);
    setGithub(projectCopy.github);
    setStatus(projectCopy.status);
    setStack(projectCopy.stack);
    setNeeded(projectCopy.needed);
    setApplication(projectCopy.application);
  };

  return (
    <>
      {contextHolder}
      <Navbar />
      <form
        className="mt-5 px-4 pb-3 flex items-center justify-start min-w-7xl"
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

            <div className="mt-5">
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
                    profileImg ||
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
                    value={owner}
                    type="text"
                    name="first-name"
                    id="first-name"
                    disabled
                    className="block w-1/3 rounded-md border-0 py-1.5 bg-slate-200 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    className="block w-4/5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    value={formattedDate(startDate)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setStartDate(
                        isNaN(newDate.getTime()) ? undefined : newDate
                      );
                    }}
                    type="date"
                    name="start-date"
                    id="start-date"
                    autoComplete="bday"
                    className="block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    value={formattedDate(endDate)}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setEndDate(
                        isNaN(newDate.getTime()) ? undefined : newDate
                      );
                    }}
                    type="date"
                    name="end-date"
                    id="end-date"
                    autoComplete="bday"
                    className="block w-1/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    value={github}
                    onChange={(e) => {
                      setGithub(e.target.value);
                    }}
                    type="text"
                    name="github"
                    id="github"
                    placeholder="www.github.com/username/repository"
                    className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                    className="flex flex-col w-1/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    <option>Ongoing</option>
                    <option>Completed</option>
                    <option>On Hold</option>
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
                    className="w-5/6"
                    mode="multiple"
                    placeholder="Python, TensorFlow, Pytorch, etc..."
                    defaultValue={stack}
                    onChange={handleStackChange}
                    onDeselect={handleStackDeselect}
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
                    className="w-5/6 grow-0"
                    mode="multiple"
                    placeholder="Project Management, Kanban, Cloud Computing..."
                    options={labelValues(uniqueArray(techSkills))}
                    allowClear
                    clearIcon={
                      <IoCloseCircleOutline className="text-red-300 hover:text-red-600" />
                    }
                    defaultValue={needed}
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
                    value={application}
                    onChange={(e) => {
                      setApplication(e.target.value);
                    }}
                    type="text"
                    name="application"
                    id="application"
                    placeholder="www.forms.gle/application"
                    className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
