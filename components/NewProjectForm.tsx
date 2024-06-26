"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { message, Select } from "antd";
import { FaUpload, FaCamera } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import { Project as ProjectType, Coder } from "@/types";
import { techSkills } from "@/dummy/questions";
import sortedIcons from "@/utils/icons";
import { labelValues, uniqueArray } from "@/utils";

const { Option } = Select;

const NewProjectForm = () => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; [key: string]: any }>();
  const [coder, setCoder] = useState<Coder>();

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
          .select("id")
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
    fetchUser();
  }, []);

  const [newProjectImage, setNewProjectImage] = useState<File | null>(null);
  const [newProject, setNewProject] = useState<ProjectType>({
    id: 0, // Provide default values or replace with actual values
    created_at: new Date(),
    owner: coder || null, // Add null check to ensure coder is not undefined
    name: "",
    description: "",
    start_date: new Date().toDateString(),
    end_date: undefined, // or specify a default value
    github: "",
    status: "ongoing",
    project_image: newProjectImage ? true : false,
    stack: [],
    skills: [], // Initialize as an empty array
    application: "",
  });
  console.log(newProject.skills);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setNewProjectImage(img);
    }
  };

  const handleStackChange = (value: string[]) => {
    setNewProject({
      ...newProject,
      stack: value,
    });
  };

  const handleSkillChange = (value: string[]) => {
    setNewProject({
      ...newProject,
      skills: value,
    });
  };

  // Form Actions
  const [messageApi, contextHolder] = message.useMessage();
  let nameCheck = false;
  let descriptionCheck = false;
  let appCheck = false;

  const handleFormSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (newProject.name?.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a project title",
        duration: 3,
      });
    } else {
      nameCheck = true;
    }

    if (newProject.description?.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a project description",
        duration: 3,
      });
    } else {
      descriptionCheck = true;
    }

    if (
      newProject.application?.trim() !== "" &&
      newProject.skills?.length === 0
    ) {
      messageApi.open({
        type: "error",
        content:
          "If you are providing an application link, please provide needed skills for the project.",
        duration: 3,
      });
    } else {
      appCheck = true;
    }

    if (nameCheck && descriptionCheck && appCheck) {
      try {
        const newProjectData = {
          owner: coder?.id,
          name: newProject.name,
          description: newProject.description,
          github: newProject.github,
          status: newProject.status,
          project_image: newProjectImage ? true : false,
          stack: newProject.stack,
          skills: newProject.skills,
          application: newProject.application,
        };

        const { data: projectDataResponse, error: projectDataError } =
          await supabase.from("projects").insert(newProjectData).select();

        if (projectDataError) {
          console.log("Faulty data:", newProjectData);
          console.log("Error uploading new project data:", projectDataError);
          return;
        }

        console.log("Project data uploaded:", projectDataResponse);

        if (newProjectImage) {
          const { data: d, error: e } = await supabase.storage
            .from("projectImages")
            .upload(`projImage-${projectDataResponse[0].id}`, newProjectImage, {
              upsert: false,
            });

          if (d) {
            console.log("Project image uploaded:", d);
            return;
          }

          let maxProjectId = 0;
          let imageUploaded = false;
          let attempt = 0;

          const { data, error } = await supabase
            .from("projects")
            .select("id")
            .order("id", { ascending: false })
            .limit(1);

          if (data) {
            maxProjectId = data[0].id;
          }

          while (!imageUploaded) {
            const fileName = `projImage-${maxProjectId + attempt}`;

            const { data: existingFileData, error: existingFileError } =
              await supabase.storage.from("projectImages").list("", {
                search: fileName,
              });

            if (existingFileData && existingFileData.length === 0) {
              const { data: imageData, error: imageError } =
                await supabase.storage
                  .from("projectImages")
                  .upload(fileName, newProjectImage, {
                    upsert: false, // Set to false to avoid overwriting
                  });

              if (imageError) {
                console.log("Error uploading profile image:", imageError);
                return;
              }

              console.log("Profile image uploaded:", imageData);
              imageUploaded = true;
            } else {
              attempt++;
            }
          }

          router.refresh();
        }
      } catch (error) {
        console.log("Error:", error);
      }
    }
  };

  return (
    <>
      {contextHolder}
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
                newProject.description === "" ? "" : newProject.description
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
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
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
              placeholder="https://www.github.com"
              value={newProject.github === "" ? "" : newProject.github}
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
              {!newProjectImage ? (
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
                        value={
                          newProjectImage
                            ? URL.createObjectURL(newProjectImage)
                            : ""
                        }
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
                  src={
                    newProjectImage ? URL.createObjectURL(newProjectImage) : ""
                  }
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
                newProject.application === "" ? "" : newProject.application
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
    </>
  );
};

export default NewProjectForm;
