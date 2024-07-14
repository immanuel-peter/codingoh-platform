"use client";

import React, { useState, useEffect } from "react";
import { Select, message } from "antd";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { JSONContent } from "@tiptap/react";

import { Navbar, TiptapEditor } from "@/components";
import { formatEmbeddingInput } from "@/utils";
import { tags } from "@/dummy/questions";
import { Tag, Coder } from "@/types";

const AddQuestion = () => {
  const router = useRouter();
  const supabase = createClient();
  const [coder, setCoder] = useState<Coder>();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
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
    fetchUser();
  }, []);

  const [messageApi, contextHolder] = message.useMessage();
  var titleCheck: boolean,
    descCheck: boolean,
    notifCheck: boolean = false;

  const [tagsList, setTagsList] = useState<Tag[]>(tags);
  const [json, setJson] = useState<JSONContent>();
  const [editorText, setEditorText] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    description: {} as JSONContent,
    tags: [] as string[],
    preferences: "text",
    notifications: {
      email: false,
      desktop: false,
    },
  });
  console.log(json);
  console.log(newQuestion);

  useEffect(() => {
    setNewQuestion((prevQuestion) => ({
      ...prevQuestion,
      description: json || ({} as JSONContent),
    }));
  }, [json]);

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

  const possibleData = {
    asker: coder?.id,
    question: newQuestion.title,
    tags: newQuestion.tags,
    description: newQuestion.description,
    answer_preference: newQuestion.preferences,
    notify_email: newQuestion.notifications.email,
    notify_desktop: newQuestion.notifications.desktop,
  };
  console.log(possibleData);

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

    if (!newQuestion.description) {
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
              newQuestion.title,
              editorText,
              newQuestion.tags
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
          asker: coder?.id,
          question: newQuestion.title,
          tags: newQuestion.tags,
          answer_preference: newQuestion.preferences,
          notify_email: newQuestion.notifications.email,
          notify_desktop: newQuestion.notifications.desktop,
          embedding: embedding,
          description_json: newQuestion.description,
        };

        // Make database call
        const { data: questionDataResponse, error: questionDataError } =
          await supabase.from("questions").insert(questionData).select();

        if (questionDataError) {
          console.log("Faulty data:", questionData);
          console.log("Error adding question data:", questionDataError);
          messageApi.open({
            type: "error",
            content: questionDataError.message,
            duration: 3,
          });
          return;
        }

        if (questionDataResponse) {
          console.log("Question added:", questionDataResponse);
          const { data: d, error: e } = await supabase
            .from("notifications")
            .insert({
              event: "add_question",
              coder_ref: coder?.id,
              question_ref: questionDataResponse[0].id,
            });
          if (d) {
            console.log(d);
          } else {
            console.error(e);
          }
          messageApi.open({
            type: "success",
            content: "Question added:",
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
    setNewQuestion({
      ...newQuestion,
      title: "",
      tags: [],
      preferences: "text",
      notifications: {
        email: false,
        desktop: false,
      },
      description: {} as JSONContent,
    });
  };

  return (
    <>
      {contextHolder}
      <Navbar />

      <form
        className="my-5 mx-5 flex items-center justify-center w-6xl"
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
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div className="col-span-full w-full">
                <TiptapEditor
                  onJsonChange={(Json) => setJson(Json)}
                  onTextChange={(text) => setEditorText(text)}
                />
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
