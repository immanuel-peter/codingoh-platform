"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Select, message } from "antd";
import { FaArrowTurnDown, FaMarkdown } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

import { Navbar, RenderMd } from "@/components";
import { tags } from "@/dummy/questions";
import { Tag, Coder, Question } from "@/types";
import { formatEmbeddingInput } from "@/utils";

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

const EditQuestion = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; [key: string]: any }>();
  const [coder, setCoder] = useState<Coder>();
  const [question, setQuestion] = useState<Question>();

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
    const fetchQuestion = async () => {
      const { data: question, error } = await supabase
        .from("questions")
        .select("*")
        .eq("id", params.id)
        .single();
      if (question) {
        const { data: coder, error } = await supabase
          .from("coders")
          .select("*")
          .eq("id", question.asker)
          .single();
        if (coder) {
          question.asker = coder;
        }
        setQuestion(question);
        setUpdatedQuestion({
          ...updatedQuestion,
          title: question.question,
          tags: question.tags,
          preferences: question.answer_preference,
          notifications: {
            email: question.notify_email,
            desktop: question.notify_desktop,
          },
        });
        setMarkdown(question.description);
      } else {
        console.error(error);
      }
    };
    fetchUser();
    fetchQuestion();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  var titleCheck: boolean,
    descCheck: boolean,
    notifCheck: boolean = false;

  const [tagsList, setTagsList] = useState<Tag[]>(tags);
  const [markdown, setMarkdown] = useState<string>(placeholderMdText);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [updatedQuestion, setUpdatedQuestion] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    preferences: "text",
    notifications: {
      email: false,
      desktop: false,
    },
  });

  console.log(updatedQuestion);

  useEffect(() => {
    setUpdatedQuestion((prevQuestion) => ({
      ...prevQuestion,
      description: markdown === placeholderMdText ? "" : markdown,
    }));
  }, [markdown, placeholderMdText]);

  const handleTagSelect = (value: string) => {
    const exists = tagsList.some((tag) => tag.value === value);

    if (exists) {
      setUpdatedQuestion({
        ...updatedQuestion,
        tags: [...updatedQuestion.tags, value],
      });
    }

    if (!exists) {
      const updatedTagsList = [...tagsList, { value, label: value }];
      setTagsList(updatedTagsList);
      setUpdatedQuestion({
        ...updatedQuestion,
        tags: [...updatedQuestion.tags, value],
      });
    }
  };

  const handleTagDeselect = (value: string) => {
    const newTags = updatedQuestion.tags.filter((tag) => tag !== value);
    setUpdatedQuestion({ ...updatedQuestion, tags: newTags });
  };

  const possibleData = {
    asker: coder?.id,
    question: updatedQuestion.title,
    tags: updatedQuestion.tags,
    description: updatedQuestion.description,
    answer_preference: updatedQuestion.preferences,
    notify_email: updatedQuestion.notifications.email,
    notify_desktop: updatedQuestion.notifications.desktop,
  };
  console.log(possibleData);

  const handleQuestionSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (updatedQuestion.title.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a title for your question",
        duration: 3,
      });
    } else {
      titleCheck = true;
    }

    if (updatedQuestion.description.trim() === "") {
      messageApi.open({
        type: "error",
        content: "Please provide a description for your question",
        duration: 3,
      });
    } else {
      descCheck = true;
    }

    if (
      updatedQuestion.notifications.desktop === false &&
      updatedQuestion.notifications.email === false
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
        // Compute embedding using Fetch API
        const response = await fetch("https://api.openai.com/v1/embeddings", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: formatEmbeddingInput(
              updatedQuestion.title,
              updatedQuestion.description,
              updatedQuestion.tags
            ),
            dimensions: 512,
          }),
        });

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(
            `API request failed with status ${response.status}: ${errorDetails.message}`
          );
        }

        const embeddingData = await response.json();
        const embedding = embeddingData.data[0].embedding;

        const questionData = {
          question: updatedQuestion.title,
          tags: updatedQuestion.tags,
          description: updatedQuestion.description,
          answer_preference: updatedQuestion.preferences,
          notify_email: updatedQuestion.notifications.email,
          notify_desktop: updatedQuestion.notifications.desktop,
          embedding: embedding,
        };

        // Make database call
        const { data: questionDataResponse, error: questionDataError } =
          await supabase
            .from("questions")
            .update(questionData)
            .eq("id", params.id)
            .select();

        if (questionDataError) {
          console.log("Faulty data:", questionData);
          console.log("Error updating question data:", questionDataError);
          messageApi.open({
            type: "error",
            content: questionDataError.message,
            duration: 3,
          });
          return;
        }

        if (questionDataResponse) {
          console.log("Question updated:", questionDataResponse);
          messageApi.open({
            type: "success",
            content: "Question successfully updated",
            duration: 3,
          });
          router.push(`/questions/${questionDataResponse[0].id}`);
        }
      } catch (error) {
        console.log("Error:", error);
        messageApi.open({
          type: "error",
          content: "An error occurred while submitting the question.",
          duration: 3,
        });
      }
    }
  };

  const handleFormCancel = () => {
    setMarkdown(placeholderMdText);
    setUpdatedQuestion({
      ...updatedQuestion,
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
        className="mt-5 mb-5 flex items-center justify-center max-w-7xl"
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
                  value={updatedQuestion.title}
                  onChange={(e) =>
                    setUpdatedQuestion({
                      ...updatedQuestion,
                      title: e.target.value,
                    })
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
                        target="_blank"
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
                      className="bg-inherit leading-7"
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
                  value={updatedQuestion.tags}
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
                        checked={updatedQuestion.preferences === "text"}
                        onChange={() =>
                          setUpdatedQuestion({
                            ...updatedQuestion,
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
                        checked={updatedQuestion.preferences === "video"}
                        onChange={() =>
                          setUpdatedQuestion({
                            ...updatedQuestion,
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
                        checked={updatedQuestion.notifications.email}
                        onChange={() =>
                          setUpdatedQuestion({
                            ...updatedQuestion,
                            notifications: {
                              ...updatedQuestion.notifications,
                              email: !updatedQuestion.notifications.email,
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
                        checked={updatedQuestion.notifications.desktop}
                        onChange={() =>
                          setUpdatedQuestion({
                            ...updatedQuestion,
                            notifications: {
                              ...updatedQuestion.notifications,
                              desktop: !updatedQuestion.notifications.desktop,
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

export default EditQuestion;
