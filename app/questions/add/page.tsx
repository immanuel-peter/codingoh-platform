"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Select, message } from "antd";
import ReactMarkdown from "react-markdown";

import { Navbar, RenderMd } from "@/components";
import { FaArrowTurnDown, FaMarkdown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { tags } from "@/dummy/questions";
import { Tag } from "@/types";

const placeholderMdText: string = `# Fibonacci sequence not working

I'm trying to write a program that will print the Fibonacci sequence to the console. I have the following code, but it's not working:

\`\`\`python
def fibonacci(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

def main():
    for i in range(10):
        print(fibonacci(i))

if __name__ == "__main__":
    main()
\`\`\`

I've tried the following steps to try to resolve the issue:

* I've checked my syntax and it looks correct.
* I've tried running the code in a different IDE and it's still not working.
* I've searched for similar issues online and I haven't found any solutions that work for me.

I'm not sure what else to try. Can anyone help me figure out what's wrong with my code?
`;

const AddQuestion = () => {
  const [messageApi, contextHolder] = message.useMessage();
  var titleCheck: boolean,
    descCheck: boolean,
    notifCheck: boolean = false;

  const [tagsList, setTagsList] = useState<Tag[]>(tags);
  const [markdown, setMarkdown] = useState<string>(placeholderMdText);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    preferences: "text",
    notifications: {
      email: false,
      desktop: false,
    },
  });

  console.log(newQuestion);

  useEffect(() => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      description: markdown === placeholderMdText ? "" : markdown,
    }));
  }, [markdown, placeholderMdText]);

  const handleTagSelect = (value: string) => {
    const exists = tagsList.some((tag) => tag.value === value);

    if (exists) {
      setNewQuestion({ ...newQuestion, tags: [...newQuestion.tags, value] });
    }

    if (!exists) {
      const updatedTagsList = [...tagsList, { value, label: value }];
      setTagsList(updatedTagsList);
      setNewQuestion({ ...newQuestion, tags: [...newQuestion.tags, value] });
    }
  };

  const handleTagDeselect = (value: string) => {
    const newTags = newQuestion.tags.filter((tag) => tag !== value);
    setNewQuestion({ ...newQuestion, tags: newTags });
  };

  const handleQuestionSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (newQuestion.title.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a title for your question",
        duration: 3,
      });
    } else {
      titleCheck = true;
    }

    if (newQuestion.description.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a description for your question",
        duration: 3,
      });
    } else {
      descCheck = true;
    }

    if (
      newQuestion.notifications.desktop === false &&
      newQuestion.notifications.email === false
    ) {
      messageApi.open({
        type: "error",
        content: "Please provide a method of notification",
        duration: 3,
      });
    } else {
      notifCheck = true;
    }

    if (titleCheck && descCheck && notifCheck) {
      try {
        // Make database call
        // console.log("Added question to database:", question.title);
        // Redirect to dev profile page /questions/{/* id given by database */}
      } catch (error) {
        // console.log("Error:", error)
      }
    }
  };

  const handleFormCancel = () => {
    setMarkdown(placeholderMdText);
    setNewQuestion({
      ...newQuestion,
      title: "",
      tags: [],
      preferences: "text",
      notifications: {
        email: false,
        desktop: false,
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Navbar />

      <form
        className="mt-5 flex items-center justify-center max-w-7xl"
        onSubmit={handleQuestionSubmit}
      >
        <div className="space-y-12 py-4">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add Question
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Describe your problem here. If you have code in your question, the
              more words you add to the context of the problem, the more likely
              youre question will be answered.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="title"
                  className="flex items-center justify-between gap-2 text-sm font-medium leading-6 text-gray-900 mb-2"
                >
                  Question Title
                </label>
                <input
                  id="title"
                  name="title"
                  placeholder="Fibonacci sequence not working"
                  value={newQuestion.title}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, title: e.target.value })
                  }
                  className="block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="flex items-center justify-between gap-2 text-sm font-medium leading-6 text-gray-900"
                >
                  <span className="flex items-center gap-2">
                    Describe Your Question Here <FaArrowTurnDown />
                  </span>
                  <button
                    type="button"
                    className={
                      !isPreviewOpen
                        ? "bg-blue-300 py-1 px-2 text-slate-600 border border-solid border-blue-700 hover:bg-blue-600 hover:text-white rounded-full mr-1"
                        : "bg-slate-50 py-1 px-2 text-black border border-solid border-red-700 hover:bg-red-400 rounded-full mr-1"
                    }
                    onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                  >
                    {isPreviewOpen ? (
                      <IoClose className="inline-block justify-items-center bg-inherit mr-1" />
                    ) : null}
                    {!isPreviewOpen ? "Preview" : "Close Preview"}
                  </button>
                </label>

                {!isPreviewOpen ? (
                  <>
                    <div className="mt-2">
                      <textarea
                        id="about"
                        name="about"
                        value={markdown === placeholderMdText ? "" : markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        rows={10}
                        className="block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder={placeholderMdText}
                        defaultValue={""}
                      />
                    </div>
                    <p className="flex items-center gap-2 mt-3 text-sm leading-6 text-gray-600">
                      Write your question in Markdown{" "}
                      <FaMarkdown className="text-base" />
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Don't know how to write in Markdown? Check out this{" "}
                      <Link
                        href="https://www.markdownguide.org/"
                        className="text-blue-500 hover:underline hover:underline-offset-2"
                      >
                        guide
                      </Link>
                      .
                    </p>
                  </>
                ) : (
                  <div className="mt-2 w-full p-2 rounded-md border border-solid border-black">
                    <RenderMd
                      markdown={markdown}
                      className="bg-inherit leading-loose"
                    />
                  </div>
                )}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="tags"
                  className="text-sm font-medium leading-6 text-gray-900"
                >
                  Tags (Optional)
                </label>
                <Select
                  mode="tags"
                  className="mt-2"
                  style={{ width: "100%" }}
                  placeholder="List applicable tags"
                  onSelect={handleTagSelect}
                  onDeselect={handleTagDeselect}
                  options={tagsList}
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Preferences
            </h2>

            <div className="mt-1 space-y-8">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900/75">
                  How would you like your question answered?
                </legend>
                <div className="mt-3 space-y-3">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="text-preference"
                        name="text-preference"
                        value="text"
                        type="radio"
                        checked={newQuestion.preferences === "text"}
                        onChange={() =>
                          setNewQuestion({
                            ...newQuestion,
                            preferences: "text",
                          })
                        }
                        className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="text-preference"
                        className="font-medium text-gray-900"
                      >
                        Text
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="video"
                        name="video"
                        value="video"
                        type="radio"
                        checked={newQuestion.preferences === "video"}
                        onChange={() =>
                          setNewQuestion({
                            ...newQuestion,
                            preferences: "video",
                          })
                        }
                        className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="video"
                        className="font-medium text-gray-900"
                      >
                        Video
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <h2 className="text-base font-semibold leading-7 text-gray-900 mt-7">
              Notifications
            </h2>

            <div className="mt-2 space-y-8">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-gray-900/75">
                  Push Notifications
                </legend>
                <div className="mt-3 space-y-3">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="email"
                        name="email"
                        type="checkbox"
                        onChange={() =>
                          setNewQuestion({
                            ...newQuestion,
                            notifications: {
                              ...newQuestion.notifications,
                              email: !newQuestion.notifications.email,
                            },
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="email"
                        className="font-medium text-gray-900"
                      >
                        Email
                      </label>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="desktop-notifications"
                        name="desktop-notifications"
                        type="checkbox"
                        onChange={() =>
                          setNewQuestion({
                            ...newQuestion,
                            notifications: {
                              ...newQuestion.notifications,
                              desktop: !newQuestion.notifications.desktop,
                            },
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="desktop-notifications"
                        className="font-medium text-gray-900"
                      >
                        Desktop Notifications
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={handleFormCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddQuestion;
