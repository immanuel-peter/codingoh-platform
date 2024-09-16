"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Drawer,
  Avatar,
  Tooltip,
  DatePicker,
  TimePicker,
  Calendar,
  message,
} from "antd";
import {
  FaCircleDot,
  FaCheck,
  FaArrowTurnDown,
  FaXmark,
  FaCalendar,
  FaVideo,
} from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { MdOutlineScheduleSend } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import {
  Coder,
  Question,
  Notification,
  Comment,
  Project,
  Scheduling,
} from "@/types";
import { Card } from "@/components";

dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

const SpotlightAction = ({ notification }: { notification: Notification }) => {
  const supabase = createClient();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [projectDeleted, setProjectDeleted] = useState<boolean>(false);
  const [questionDeleted, setQuestionDeleted] = useState<boolean>(false);
  const [receiverNote, setReceiverNote] = useState<string>("");
  const [scheduleMessage, setScheduleMessage] = useState<string>("");
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [dateString, setDateString] = useState<string>("");
  const [timeString, setTimeString] = useState<string>("");
  const [schedulingSent, setSchedulingSent] = useState<boolean>(false);
  const [reschedulingSent, setReschedulingSent] = useState<boolean>(false);

  useEffect(() => {
    const newDateTime = dayjs(
      `${dateString} ${timeString}`,
      "MM/DD/YYYY h:mm a"
    );
    if (newDateTime.isValid()) {
      setDateTime(newDateTime);
    }
  }, [dateString, timeString]);
  const formattedDate = dateTime?.toDate();

  useEffect(() => {
    if (notification) {
      // Check if notification is defined
      setDateString(
        notification.scheduling_ref?.scheduled_time
          ? dayjs(new Date(notification.scheduling_ref?.scheduled_time)).format(
              "MM/DD/YYYY"
            )
          : ""
      );
      setTimeString(
        notification.scheduling_ref?.scheduled_time
          ? dayjs(new Date(notification.scheduling_ref?.scheduled_time)).format(
              "h:mm a"
            )
          : ""
      );
      setDateTime(
        notification.scheduling_ref?.scheduled_time
          ? dayjs(new Date(notification.scheduling_ref?.scheduled_time))
          : null
      );
      setScheduleMessage(notification.scheduling_ref?.sender_note || "");
    }
  }, [notification]); // Ensure notification is included in the dependency array

  const deleteQuestion = async (id: number) => {
    try {
      const { error } = await supabase.rpc("delete_question_and_notify", {
        question_id: id,
      });
      if (error) {
        console.error("Error deleting question:", error);
      } else {
        setQuestionDeleted(true);
        console.log("Question deleted successfully");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const deleteProject = async (projectId: number) => {
    try {
      // Call the Supabase function to delete the project and get the project image boolean
      const { data, error } = await supabase.rpc(
        "delete_project_and_get_image",
        { id: projectId }
      );

      if (error) {
        console.error("Error deleting project:", error);
        return;
      }

      const projectImageExists = data;

      if (projectImageExists) {
        // Delete the project image from Supabase storage
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("projectImages")
            .remove([`projImage-${projectId}`]);

        if (storageError) {
          console.error("Error deleting project image:", storageError);
        } else {
          console.log("Successfully deleted project image:", storageData);
        }
      }

      console.log("Project deleted successfully");
      setProjectDeleted(true);
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "accept":
        return (
          <div className="mt-2 flex items-center text-green-600">
            <p>This scheduling has been accepted!</p>
          </div>
        );
      case "reject":
        return (
          <div className="mt-2 flex items-center text-red-600">
            <p>This scheduling has been rejected.</p>
          </div>
        );
      case "reschedule":
        return (
          <div className="mt-2 flex items-center text-blue-600">
            <p>This scheduling has been asked to be rescheduled.</p>
          </div>
        );
      case "delete":
        return (
          <div className="mt-2 flex items-center text-red-600">
            <p>This scheduling has been canceled.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSchedulingAccept = async (schedulingId: number) => {
    try {
      // Call the Supabase function to update the scheduling and insert into notifications
      const { error } = await supabase.rpc("handle_scheduling_accept", {
        p_id: schedulingId,
      });

      if (error) {
        console.error("Error updating scheduling:", error);
        return;
      }

      // Update the notification status locally if needed
      if (
        notification.scheduling_ref &&
        notification.scheduling_ref.status !== "accept"
      ) {
        notification.scheduling_ref.status = "accept";
      }

      console.log("Scheduling updated successfully");
      router.refresh();
    } catch (error) {
      console.error("Error accepting meeting request:", error);
    }
  };

  const handleSchedulingReject = async (schedulingId: number) => {
    try {
      // Call the Supabase function to update the scheduling and insert into notifications
      const { error } = await supabase.rpc("handle_scheduling_reject", {
        p_id: schedulingId,
      });

      if (error) {
        console.error("Error updating scheduling:", error);
        return;
      }

      // Update the notification status locally if needed
      if (
        notification.scheduling_ref &&
        notification.scheduling_ref.status !== "reject"
      ) {
        notification.scheduling_ref.status = "reject";
      }

      console.log("Scheduling rejected successfully");
      router.refresh();
    } catch (error) {
      console.error("Error rejecting meeting request:", error);
    }
  };

  const handleReschedule = async (
    schedulingId: number,
    receiverNote: string | null
  ) => {
    try {
      // Call the Supabase function to update the scheduling and insert into notifications
      const { error } = await supabase.rpc("handle_reschedule", {
        p_id: schedulingId,
        note: receiverNote,
      });

      if (error) {
        console.error("Error rescheduling meeting:", error);
        return;
      }

      // Update the notification status locally if needed
      if (
        notification.scheduling_ref &&
        notification.scheduling_ref.status !== "reschedule"
      ) {
        notification.scheduling_ref.status = "reschedule";
      }

      console.log("Scheduling rescheduled successfully");
      router.refresh();
    } catch (error) {
      console.error("Error rescheduling meeting request:", error);
    }
  };

  const handleSchedule = async () => {
    let dateCheck = false;
    if (!dateString || !timeString) {
      messageApi.open({
        type: "error",
        content: "Please provide a date and time for your meeting",
        duration: 3,
      });
    } else {
      dateCheck = true;
    }

    const scheduleData = {
      scheduler_id: notification.scheduling_ref?.scheduler_id?.id,
      receiver_id: notification.question_ref?.asker?.id,
      question_id: notification.question_ref?.id,
      scheduled_time: formattedDate ? new Date(formattedDate) : null,
      sender_note: scheduleMessage || null,
    };

    if (dateCheck) {
      try {
        const { data: scheduleDataResponse, error: scheduleError } =
          await supabase.from("schedulings").insert(scheduleData).select();

        if (scheduleError) {
          console.log("Faulty data:", scheduleData);
          console.log("Error uploading scheduling data:", scheduleError);
          return;
        }

        if (scheduleDataResponse) {
          setSchedulingSent(true);
          console.log("Scheduling added:", scheduleDataResponse);
          const { data: d, error: e } = await supabase
            .from("notifications")
            .insert({
              event: "schedule_meet",
              coder_ref: notification.question_ref?.asker?.id,
              question_ref: notification.question_ref?.id,
              scheduling_ref: scheduleDataResponse[0].id,
            })
            .select();
          if (d) {
            console.log(d);
          } else {
            console.error(e);
          }
          router.refresh();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleScheduleEdit = async () => {
    let dateCheck = false;
    if (!dateString || !timeString) {
      messageApi.open({
        type: "error",
        content: "Please provide a date and time for your meeting",
        duration: 3,
      });
    } else {
      dateCheck = true;
    }

    const scheduleData = {
      scheduled_time: formattedDate ? new Date(formattedDate) : null,
      sender_note: scheduleMessage || null,
      status: null,
      is_confirmed: false,
    };

    if (dateCheck) {
      try {
        const { data: scheduleDataResponse, error: scheduleError } =
          await supabase
            .from("schedulings")
            .update(scheduleData)
            .eq("id", notification.scheduling_ref?.id)
            .select();

        if (scheduleError) {
          console.log("Faulty data:", scheduleData);
          console.log("Error uploading scheduling data:", scheduleError);
          return;
        }

        if (scheduleDataResponse) {
          console.log("Scheduling updated:", scheduleDataResponse);
          setReschedulingSent(true);
          const { data: d, error: e } = await supabase
            .from("notifications")
            .insert({
              event: "schedule_meet",
              coder_ref: notification.scheduling_ref?.receiver_id?.id,
              question_ref: notification.question_ref?.id,
              scheduling_ref: notification.scheduling_ref?.id,
            })
            .select();
          if (d) {
            console.log(d);
          } else {
            console.error(e);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (notification?.event == "signup") {
    return (
      <div className="flex flex-col items-start justify-start w-full overflow-y-auto">
        <div className="px-1.5 pt-1.5">
          <div className="flex flex-row items-center justify-center">
            🎉 Check out your profile{" "}
            <Link
              href={`/users/${notification.coder_ref?.auth_id}`}
              className="ml-1 text-blue-600 hover:underline hover:underline-offset-4"
            >
              here
            </Link>
            ! Check out your card below. <FaArrowTurnDown className="ml-1" />
          </div>
        </div>
        <Card
          id={notification.coder_ref?.id ?? 0}
          name={`${notification.coder_ref?.first_name} ${notification.coder_ref?.last_name}`}
          position={notification.coder_ref?.position}
          languages={notification.coder_ref?.stack}
          isOnline
          extraStyles="p-0"
        />
      </div>
    );
  } else if (notification?.event == "delete_question") {
    return (
      <div className="flex flex-col items-start justify-start p-1.5 w-full overflow-y-auto">
        <p className="flex items-center">
          A question you contributed to has been deleted. We're sorry if this
          caused any inconvenience, but feel free to contribute to another
          question or add your own question.
        </p>
        <div className="flex flex-row items-center justify-between w-full mt-2">
          <Link
            href="/"
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
          >
            Contribute to Question
          </Link>
          <Link
            href="/questions/add"
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
          >
            Add Question
          </Link>
        </div>
      </div>
    );
  } else if (notification?.event == "add_question") {
    if (questionDeleted) {
      return (
        <div className="flex flex-col items-start justify-start p-1.5 w-full overflow-y-auto">
          <p className="mt-2 flex items-center text-red-600">
            This question has been deleted.
          </p>
          <div className="flex flex-row items-center justify-between w-full mt-2">
            <Link
              href="/"
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
            >
              Contribute to Question
            </Link>
            <Link
              href="/questions/add"
              className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
            >
              Add Question
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start justify-start p-1.5 w-full overflow-y-auto">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View your question</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        <div className="flex flex-row items-center justify-between w-full mt-2">
          <Link
            href={`/questions/${notification.question_ref?.id}/edit`}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
          >
            Edit Question
          </Link>
          <button
            onClick={() => deleteQuestion(notification.question_ref?.id ?? 0)}
            className="p-2 rounded-full bg-red-500 hover:bg-red-700 text-white"
          >
            Delete Question
          </button>
        </div>
        <p className="mt-2">
          <span className="font-bold">Question:</span>{" "}
          {notification.question_ref?.question}
        </p>
      </div>
    );
  } else if (notification?.event == "add_project") {
    if (projectDeleted) {
      return (
        <div className="flex flex-col items-start justify-start p-1.5 w-full overflow-y-auto">
          <p className="my-2 flex items-center text-red-600">
            This project has been deleted.
          </p>
          <Link
            href={`/users/${notification.project_ref?.owner?.auth_id}`}
            className="flex flex-row items-center justify-between w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
          >
            <span>Create a new project</span>
            <LuExternalLink className="text-blue-500" />
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-start justify-start p-1.5 w-full overflow-y-auto">
        <Link
          href={`/users/${notification.project_ref?.owner?.auth_id}`}
          className="flex flex-row items-center justify-between w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View your project at your user page</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        <div className="flex flex-row items-center justify-between w-full mt-2">
          <Link
            href={`/projects/${notification.project_ref?.id}/edit`}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
          >
            Edit Project
          </Link>
          <button
            onClick={() => deleteProject(notification.project_ref?.id ?? 0)}
            className="p-2 rounded-full bg-red-500 hover:bg-red-700 text-white"
          >
            Delete Project
          </button>
        </div>
        <p className="mt-2">
          <span className="font-bold">Project:</span>{" "}
          {notification.project_ref?.name}
        </p>
        <p className="mt-2">
          <span className="font-bold">Description:</span>{" "}
          {notification.project_ref?.description}
        </p>
      </div>
    );
  } else if (notification?.event == "schedule_meet") {
    return (
      <div className="w-full p-1.5">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View the referenced question</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        {!notification.scheduling_ref?.status && (
          <>
            <div className="flex flex-row justify-between items-center">
              <div className="flex justify-start items-center gap-3">
                {notification.scheduling_ref?.scheduler_id?.profile_image ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${notification.scheduling_ref?.scheduler_id?.auth_id}`}
                    alt="profile picture"
                    className="h-[15%] w-[15%] rounded-full border border-solid border-black"
                    height={30}
                    width={30}
                  />
                ) : (
                  <Avatar size={30}>
                    {notification.scheduling_ref?.scheduler_id?.first_name
                      ? notification.scheduling_ref?.scheduler_id.first_name[0]
                      : ""}
                    {notification.scheduling_ref?.scheduler_id?.last_name
                      ? notification.scheduling_ref?.scheduler_id.last_name[0]
                      : ""}
                  </Avatar>
                )}
                <Link
                  href={`/users/${notification.scheduling_ref?.scheduler_id?.auth_id}`}
                  target="_blank"
                  className="text-lg hover:underline hover:text-blue-600"
                >
                  {notification.scheduling_ref?.scheduler_id?.first_name}{" "}
                  {notification.scheduling_ref?.scheduler_id?.last_name}
                </Link>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Tooltip title="Accept" color="#4ade80" placement="left">
                  <div
                    onClick={() =>
                      handleSchedulingAccept(
                        notification.scheduling_ref?.id ?? 0
                      )
                    }
                    className="p-2 rounded-full border border-solid border-black hover:bg-green-100 cursor-pointer"
                  >
                    <FaCheck className="text-green-500" />
                  </div>
                </Tooltip>
                <Tooltip title="Reject" color="#f87171" placement="top">
                  <div
                    onClick={() =>
                      handleSchedulingReject(
                        notification.scheduling_ref?.id ?? 0
                      )
                    }
                    className="p-2 rounded-full border border-solid border-black hover:bg-red-100 cursor-pointer"
                  >
                    <FaXmark className="text-red-500" />
                  </div>
                </Tooltip>
                <Tooltip title="Reschedule" color="#38bdf8" placement="bottom">
                  <div
                    onClick={() =>
                      handleReschedule(
                        notification.scheduling_ref?.id ?? 0,
                        receiverNote
                      )
                    }
                    className="p-2 rounded-full border border-solid border-black hover:bg-blue-100 cursor-pointer"
                  >
                    <FaCalendar className="text-blue-500" />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="mt-2 text-xs">
              Requested session on{" "}
              <span className="text-blue-400 font-bold text-sm">
                {/* {MM/DD/YYYY} */}
                {new Date(
                  new Date(
                    notification.scheduling_ref?.scheduled_time ?? ""
                  ).toLocaleString("en-US", {
                    timeZone:
                      notification.scheduling_ref?.receiver_id?.timezone,
                  })
                ).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </span>{" "}
              @{" "}
              <span className="text-blue-400 font-bold text-sm">
                {/* {HH:MM AP} */}
                {new Date(
                  new Date(
                    notification.scheduling_ref?.scheduled_time ?? ""
                  ).toLocaleString("en-US", {
                    timeZone:
                      notification.scheduling_ref?.receiver_id?.timezone,
                  })
                ).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
              {notification.scheduling_ref?.sender_note && (
                <div className="p-2 bg-gray-200 rounded-md text-sm">
                  {notification.scheduling_ref?.sender_note}
                </div>
              )}
              <div className="mt-2">
                <textarea
                  placeholder={`Respond to the request here. If you want to reschedule, include the date and time you want. Reminder: ${notification.scheduling_ref?.scheduler_id?.first_name} ${notification.scheduling_ref?.scheduler_id?.last_name} lives in the ${notification.scheduling_ref?.scheduler_id?.timezone} timezone.`}
                  className="placeholder:text-sm text-sm w-full h-24 rounded-lg"
                  value={receiverNote}
                  onChange={(e) => setReceiverNote(e.target.value)}
                ></textarea>
              </div>
            </div>
          </>
        )}
        {notification.scheduling_ref?.status &&
          renderStatus(notification.scheduling_ref.status)}
      </div>
    );
  } else if (notification?.event == "accept_meet") {
    return (
      <div className="w-full p-1.5">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View the referenced question</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        <div className="flex flex-row items-center justify-between p-2 rounded-lg bg-gray-200">
          <div className="flex flex-col items-start justify-center">
            <p className="font-bold">
              {new Date(
                new Date(
                  notification.scheduling_ref?.scheduled_time ?? ""
                ).toLocaleString("en-US", {
                  timeZone: notification.scheduling_ref?.scheduler_id?.timezone,
                })
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="font-bold">
              {new Date(
                new Date(
                  notification.scheduling_ref?.scheduled_time ?? ""
                ).toLocaleString("en-US", {
                  timeZone: notification.scheduling_ref?.scheduler_id?.timezone,
                })
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </div>
          <Link
            href="/"
            className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg bg-blue-400 hover:bg-blue-600 text-white hover:text-white"
          >
            <FaVideo /> Join Meeting
          </Link>
        </div>
      </div>
    );
  } else if (notification?.event == "reject_meet") {
    return (
      <>
        {contextHolder}
        <div className="w-full p-1.5">
          <Link
            href={`/questions/${notification.question_ref?.id}`}
            className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
          >
            <span>View the referenced question</span>
            <LuExternalLink className="text-blue-500" />
          </Link>
          {!schedulingSent ? (
            <div className="p-2 w-full bg-gray-200 rounded-lg">
              <p className="font-bold">
                Would you like to schedule another meeting?
              </p>
              <span className="text-xs">
                Reminder: {notification.question_ref?.asker?.first_name}{" "}
                {notification.question_ref?.asker?.last_name} lives in the{" "}
                {notification.question_ref?.asker?.timezone} timezone.
              </span>

              <div className="mt-[2px] flex flex-row items-center justify-between">
                <DatePicker
                  onChange={(date, dateString) => {
                    console.log(dateString);
                    setDateString(dateString as string);
                  }}
                  format="MM/DD/YYYY"
                  className="w-[48%] h-100"
                />
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  onChange={(time, timeString) => {
                    console.log(timeString);
                    setTimeString(timeString as string);
                  }}
                  className="w-[48%] h-100"
                />
              </div>

              <div>
                <textarea
                  placeholder="Explain why you want to help and what you offer"
                  className="mt-2 w-full rounded-lg placeholder:text-sm text-sm"
                  value={scheduleMessage}
                  onChange={(e) => setScheduleMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-1 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-yellow-100 px-4 py-2 text-base font-medium text-yellow-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                  onClick={handleSchedule}
                >
                  Schedule <MdOutlineScheduleSend />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-green-600">
                Your meeting request has been sent to{" "}
                {notification.question_ref?.asker?.first_name}{" "}
                {notification.question_ref?.asker?.last_name}
              </p>
              <p>
                <span className="font-bold">Details:</span> Meeting scheduled at{" "}
                <span className="font-bold">{timeString}</span> on{" "}
                <span className="font-bold">{dateString}</span>
              </p>
            </div>
          )}
        </div>
      </>
    );
  } else if (notification?.event == "reschedule_meet") {
    return (
      <>
        {contextHolder}
        <div className="w-full p-1.5">
          <Link
            href={`/questions/${notification.question_ref?.id}`}
            className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
          >
            <span>View the referenced question</span>
            <LuExternalLink className="text-blue-500" />
          </Link>
          {!reschedulingSent ||
          notification.scheduling_ref?.status != "reschedule" ? (
            <div className="p-2 w-full bg-gray-200 rounded-lg">
              <div className="flex flex-col mb-2">
                <p className="p-1 text-sm">
                  <span className="font-bold">
                    {notification.question_ref?.asker?.first_name}{" "}
                    {notification.question_ref?.asker?.last_name} {"("}
                    {notification.question_ref?.asker?.timezone}
                    {")"}
                  </span>{" "}
                  responded:
                </p>
                <p className="p-1 rounded-lg bg-sky-200">
                  {notification.scheduling_ref?.receiver_note}
                </p>
              </div>

              <div className="mt-[2px] flex flex-row items-center justify-between">
                <DatePicker
                  value={dayjs(dateString, "MM/DD/YYYY")}
                  onChange={(date, dateString) => {
                    console.log(dateString);
                    setDateString(dateString as string);
                  }}
                  format="MM/DD/YYYY"
                  className="w-[48%] h-100"
                />
                <TimePicker
                  use12Hours
                  defaultValue={dayjs(timeString, "h:mm a")}
                  format="h:mm a"
                  onChange={(time, timeString) => {
                    console.log(timeString);
                    setTimeString(timeString as string);
                  }}
                  className="w-[48%] h-100"
                />
              </div>

              <div>
                <textarea
                  placeholder="Explain why you want to help and what you offer"
                  className="mt-2 w-full rounded-lg placeholder:text-sm text-sm"
                  value={scheduleMessage}
                  onChange={(e) => setScheduleMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-1 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-yellow-100 px-4 py-2 text-base font-medium text-yellow-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                  onClick={handleScheduleEdit}
                >
                  Schedule <MdOutlineScheduleSend />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-green-600">
                Your meeting request has been sent to{" "}
                {notification.question_ref?.asker?.first_name}{" "}
                {notification.question_ref?.asker?.last_name}
              </p>
              <p>
                <span className="font-bold">Details:</span> Meeting scheduled at{" "}
                <span className="font-bold">{timeString}</span> on{" "}
                <span className="font-bold">{dateString}</span>
              </p>
            </div>
          )}
        </div>
      </>
    );
  } else if (notification?.event == "new_comment") {
    return (
      <div className="w-full p-1.5">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>Check out the new comment!</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
      </div>
    );
  } else if (notification?.event == "cancel_meet") {
    return (
      <div className="w-full p-1.5">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View the referenced question</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        <p className="mt-2">
          <span className="font-bold">Question:</span>{" "}
          {notification.question_ref?.question}
        </p>
      </div>
    );
  } else if (notification?.event == "question_answered") {
    return (
      <div className="w-full p-1.5">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View the referenced question</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        <p className="mt-2">
          <span className="font-bold">Question:</span>{" "}
          {notification.question_ref?.question}
        </p>
      </div>
    );
  } else if (notification?.event == "finish_meet") {
    if (
      notification.scheduling_ref?.receiver_id?.id == notification.coder_ref?.id
    ) {
      return (
        <div className="w-full p-1.5">
          <Link
            href={`/questions/${notification.scheduling_ref?.question_id?.id}`}
            className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
          >
            <span>View the referenced question</span>
            <LuExternalLink className="text-blue-500" />
          </Link>
          <p>
            Did your meeting with{" "}
            {notification.scheduling_ref?.scheduler_id?.first_name} go well?
            Were you able to find an answer to your problem? Feel free to add an
            answer using the link above.
          </p>
          <p className="mt-2">
            <span className="font-bold">Question:</span>{" "}
            {notification.scheduling_ref?.question_id?.question}
          </p>
        </div>
      );
    } else {
      return (
        <div className="w-full p-1.5">
          <Link
            href={`/questions/${notification.scheduling_ref?.question_id?.id}`}
            className="flex flex-row items-center justify-between mb-2 w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
          >
            <span>View the referenced question</span>
            <LuExternalLink className="text-blue-500" />
          </Link>
          <p>
            Did your meeting with{" "}
            {notification.scheduling_ref?.receiver_id?.first_name} go well? Were
            you able to find an answer to{" "}
            {notification.scheduling_ref?.receiver_id?.first_name}'s problem?
            Feel free to add a comment using the link above.
          </p>
          <p className="mt-2">
            <span className="font-bold">Question:</span>{" "}
            {notification.scheduling_ref?.question_id?.question}
          </p>
        </div>
      );
    }
  } else {
    return (
      <>
        <p className="p-1.5 w-full">No actions to be taken.</p>
      </>
    );
  }
};

const RenderScheduling = ({
  s,
  user,
}: {
  s: Scheduling;
  user: { id: string; [key: string]: any };
}) => {
  const scheduledTime = s.scheduled_time ? new Date(s.scheduled_time) : null;
  const timeZone =
    user.id === s.scheduler_id?.auth_id
      ? s.scheduler_id?.timezone
      : s.receiver_id?.timezone;

  const formattedDate = scheduledTime
    ? new Date(
        scheduledTime.toLocaleString("en-US", { timeZone })
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })
    : "Invalid Date";

  const formattedTime = scheduledTime
    ? new Date(
        scheduledTime.toLocaleString("en-US", { timeZone })
      ).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "Invalid Time";

  if (user.id === s.scheduler_id?.auth_id) {
    return (
      <div className="flex flex-col w-5/6 border border-gray-600 rounded-lg mb-3">
        <div className="flex flex-row items-center justify-between rounded-t-lg p-2 bg-gray-200">
          <div>
            Meeting with{" "}
            <Link
              href={`/users/${s.receiver_id?.auth_id}`}
              className="font-semibold text-blue-600 hover:text-blue-600 hover:underline"
            >
              {s.receiver_id?.first_name} {s.receiver_id?.last_name}
            </Link>{" "}
            at{" "}
            <span className="font-semibold text-blue-600">{formattedTime}</span>{" "}
            on{" "}
            <span className="font-semibold text-blue-600">{formattedDate}</span>
          </div>
          <Link
            href="/"
            className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg bg-blue-400 hover:bg-blue-600 text-white hover:text-white"
          >
            <FaVideo /> Join Meeting
          </Link>
        </div>
        <div className="flex flex-row items-end justify-between p-2">
          <p>
            <span className="font-semibold">Question:</span>{" "}
            {s.question_id?.question ?? "No question available"}
          </p>
          <Link
            href={`/questions/${s.question_id?.id ?? "#"}`}
            className="hover:scale-125"
          >
            <LuExternalLink className="text-blue-500" />
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col w-5/6 border border-gray-600 rounded-lg mb-3">
        <div className="flex flex-row items-center justify-between rounded-t-lg p-2 bg-gray-200">
          <div>
            Meeting with{" "}
            <Link
              href={`/users/${s.scheduler_id?.auth_id}`}
              className="font-semibold text-blue-600 hover:text-blue-600 hover:underline"
            >
              {s.scheduler_id?.first_name} {s.scheduler_id?.last_name}
            </Link>{" "}
            at{" "}
            <span className="font-semibold text-blue-600">{formattedTime}</span>{" "}
            on{" "}
            <span className="font-semibold text-blue-600">{formattedDate}</span>
          </div>
          <Link
            href={`/meetings/${s.meeting_id}`}
            className="flex flex-row items-center justify-center gap-2 p-3 rounded-lg bg-blue-400 hover:bg-blue-600 text-white hover:text-white"
          >
            <FaVideo /> Join Meeting
          </Link>
        </div>
        <div className="flex flex-row items-end justify-between p-2">
          <p>
            <span className="font-semibold">Question:</span>{" "}
            {s.question_id?.question ?? "No question available"}
          </p>
          <Link
            href={`/questions/${s.question_id?.id ?? "#"}`}
            className="hover:scale-125"
          >
            <LuExternalLink className="text-blue-500" />
          </Link>
        </div>
      </div>
    );
  }
};

const Inbox = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const supabase = createClient();
  const [user, setUser] = useState<{ id: string; [key: string]: any }>();
  const [inboxType, setInboxType] = useState<string>("notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [spotlightNotification, setSpotlightNotification] =
    useState<Notification>({});
  const [schedulings, setSchedulings] = useState<Scheduling[]>([]);
  const [filteredSchedulings, setFilteredSchedulings] = useState<Scheduling[]>(
    []
  );
  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const fetchNotifications = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: coderData, error: coderError } = await supabase
          .from("coders")
          .select("id")
          .eq("auth_id", user.id)
          .single();
        if (coderData) {
          const { data: notificationsData, error: notificationsError } =
            await supabase
              .from("notifications")
              .select(
                `id, created_at, event, read, coder_ref (id, first_name, last_name, position, stack, profile_image, auth_id), question_ref (id, asker (id, first_name, last_name, profile_image, timezone, auth_id), question, tags, answer_preference, answer), comment_ref (id, parent_comment (id, commenter (id, first_name, last_name, profile_image, auth_id), is_answer, likes), commenter (id, first_name, last_name, profile_image, auth_id), is_answer, likes), project_ref (id, owner (first_name, last_name, auth_id), name, description, status, github, stack, skills, application), scheduling_ref (id, scheduler_id (id, first_name, last_name, profile_image, auth_id, timezone), receiver_id (id, first_name, last_name, profile_image, auth_id, timezone), question_id (id, question), scheduled_time, sender_note, status, receiver_note, is_done, is_confirmed)`
              )
              .eq("coder_ref", coderData.id)
              .order("created_at", { ascending: false });
          if (notificationsData) {
            const newNotifications = notificationsData.map((notification) => {
              const {
                coder_ref,
                question_ref,
                comment_ref,
                project_ref,
                scheduling_ref,
              } = notification;

              const updatedCoder: Coder = {
                id: coder_ref.id as number,
                first_name: coder_ref.first_name as string,
                last_name: coder_ref.last_name as string,
                position: coder_ref.position as string,
                stack: coder_ref.stack as string[],
                profile_image: coder_ref.profile_image as boolean,
                auth_id: coder_ref.auth_id as string,
              };

              const updatedQuestion: Question = question_ref
                ? {
                    id: question_ref.id as number,
                    asker: {
                      id: question_ref.asker.id as number,
                      first_name: question_ref.asker.first_name as string,
                      last_name: question_ref.asker.last_name as string,
                      profile_image: question_ref.asker
                        .profile_image as boolean,
                      timezone: question_ref.asker.timezone as string,
                      auth_id: question_ref.asker.auth_id as string,
                    },
                    question: question_ref.question as string,
                    tags: question_ref.tags as string[],
                    answer_preference: question_ref.answer_preference as string,
                    answer: question_ref.answer as boolean,
                  }
                : question_ref;

              const updatedComment: Comment = comment_ref
                ? {
                    id: comment_ref.id as number,
                    parent_comment: comment_ref.parent_comment && {
                      id: comment_ref.parent_comment.id as number,
                      commenter: {
                        id: comment_ref.parent_comment.commenter.id as number,
                        first_name: comment_ref.parent_comment.commenter
                          .first_name as string,
                        last_name: comment_ref.parent_comment.commenter
                          .last_name as string,
                        profile_image: comment_ref.parent_comment.commenter
                          .profile_image as boolean,
                        auth_id: comment_ref.parent_comment.commenter
                          .auth_id as string,
                      },
                      is_answer: comment_ref.parent_comment
                        .is_answer as boolean,
                      likes: comment_ref.parent_comment.likes as number,
                    },
                    commenter: {
                      id: comment_ref.commenter.id as number,
                      first_name: comment_ref.commenter.first_name as string,
                      last_name: comment_ref.commenter.last_name as string,
                      profile_image: comment_ref.commenter
                        .profile_image as boolean,
                      auth_id: comment_ref.commenter.auth_id as string,
                    },
                    is_answer: comment_ref.is_answer as boolean,
                    likes: comment_ref.likes as number,
                  }
                : comment_ref;

              const updatedProject: Project = project_ref
                ? {
                    id: project_ref.id as number,
                    owner: {
                      first_name: project_ref.owner.first_name as string,
                      last_name: project_ref.owner.last_name as string,
                      auth_id: project_ref.owner.auth_id as string,
                    },
                    name: project_ref.name as string,
                    description: project_ref.description as string,
                    status: project_ref.status as string,
                    github: project_ref.github as string,
                    stack: project_ref.stack as string[],
                    skills: project_ref.skills as string[],
                    application: project_ref.application as string,
                  }
                : project_ref;

              const updatedScheduling: Scheduling = scheduling_ref
                ? {
                    id: scheduling_ref.id as number,
                    scheduler_id: {
                      id: scheduling_ref.scheduler_id.id as number,
                      first_name: scheduling_ref.scheduler_id
                        .first_name as string,
                      last_name: scheduling_ref.scheduler_id
                        .last_name as string,
                      profile_image: scheduling_ref.scheduler_id
                        .profile_image as boolean,
                      auth_id: scheduling_ref.scheduler_id.auth_id as string,
                      timezone: scheduling_ref.scheduler_id.timezone as string,
                    },
                    receiver_id: {
                      id: scheduling_ref.receiver_id.id as number,
                      first_name: scheduling_ref.receiver_id
                        .first_name as string,
                      last_name: scheduling_ref.receiver_id.last_name as string,
                      profile_image: scheduling_ref.receiver_id
                        .profile_image as boolean,
                      auth_id: scheduling_ref.receiver_id.auth_id as string,
                      timezone: scheduling_ref.receiver_id.timezone as string,
                    },
                    question_id: {
                      id: scheduling_ref.question_id.id as number,
                      question: scheduling_ref.question_id.question as string,
                    },
                    scheduled_time: scheduling_ref.scheduled_time as string,
                    sender_note: scheduling_ref.sender_note as string,
                    status: scheduling_ref.status as string,
                    receiver_note: scheduling_ref.receiver_note as string,
                    is_done: scheduling_ref.is_done as boolean,
                    is_confirmed: scheduling_ref.is_confirmed as boolean,
                  }
                : scheduling_ref;

              return {
                id: notification.id as number,
                created_at: notification.created_at as string,
                event: notification.event as string,
                read: notification.read as boolean,
                coder_ref: updatedCoder,
                question_ref: updatedQuestion,
                comment_ref: updatedComment,
                project_ref: updatedProject,
                scheduling_ref: updatedScheduling,
              };
            });
            setNotifications(newNotifications);
            setSpotlightNotification(newNotifications[0]);
          } else {
            console.error(notificationsError);
          }
        }
      }
    };
    const fetchSchedulings = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (user) {
        const { data: coderData, error: coderError } = await supabase
          .from("coders")
          .select("id")
          .eq("auth_id", user.id)
          .single();
        if (coderData) {
          const { data: schedulingsData, error: schedulingsError } =
            await supabase
              .from("schedulings")
              .select(
                `
                id,
                scheduler_id (
                  id,
                  first_name,
                  last_name,
                  profile_image,
                  auth_id,
                  timezone
                ),
                receiver_id (
                  id,
                  first_name,
                  last_name,
                  profile_image,
                  auth_id,
                  timezone
                ),
                question_id (
                  id,
                  question
                ),
                scheduled_time,
                status,
                meeting_id
              `
              )
              .eq("is_confirmed", true)
              .eq("is_done", false)
              .eq("status", "accept")
              .or(
                `scheduler_id.eq.${coderData.id},receiver_id.eq.${coderData.id}`
              )
              .gte("scheduled_time", new Date().toISOString())
              .order("scheduled_time", { ascending: true });
          if (schedulingsData) {
            const newSchedulings = schedulingsData.map((scheduling) => {
              const {
                id,
                scheduler_id,
                receiver_id,
                question_id,
                scheduled_time,
                status,
                meeting_id,
              } = scheduling;
              return {
                id: id as number,
                scheduler_id: {
                  id: scheduler_id.id as number,
                  first_name: scheduler_id.first_name as string,
                  last_name: scheduler_id.last_name as string,
                  profile_pic: scheduler_id.profile_image
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${scheduler_id.auth_id}`
                    : "",
                  auth_id: scheduler_id.auth_id as string,
                  timezone: scheduler_id.timezone as string,
                },
                receiver_id: {
                  id: receiver_id.id as number,
                  first_name: receiver_id.first_name as string,
                  last_name: receiver_id.last_name as string,
                  profile_pic: receiver_id.profile_image
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${receiver_id.auth_id}`
                    : "",
                  auth_id: receiver_id.auth_id as string,
                  timezone: receiver_id.timezone as string,
                },
                question_id: {
                  id: question_id.id as number,
                  question: question_id.question as string,
                },
                scheduled_time: scheduled_time as string,
                status: status ? status : "null",
                meeting_id,
              };
            });
            console.log(newSchedulings);
            setSchedulings(newSchedulings);
          } else {
            console.error(schedulingsError);
          }
        }
      }
    };
    fetchNotifications();
    fetchSchedulings();

    const notificationsSubscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `coder_ref=eq.${user?.id}`,
        },
        (payload) => {
          console.log(payload);
          const newNotification = payload.new;
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
        }
      )
      .subscribe();

    const schedulingsSubscription = supabase
      .channel("schedulings-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "schedulings",
          filter: `id=in.(${schedulings.map((s) => s.id).join(",")})`,
        },
        (payload) => {
          console.log("Scheduling payload:", payload);
          const updatedScheduling = payload.new;
          setSchedulings((prevSchedulings) =>
            prevSchedulings.map((scheduling) =>
              scheduling.id === updatedScheduling.id
                ? updatedScheduling
                : scheduling
            )
          );
          setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
              notification.scheduling_ref?.id === updatedScheduling.id
                ? {
                    ...notification,
                    scheduling_ref: updatedScheduling,
                  }
                : notification
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeAllChannels();
    };
  }, [supabase]);

  function formatTimestamp(timestamptz: string) {
    const now = new Date();
    const timestamp = new Date(timestamptz);

    const monthsShort = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (
      now.getFullYear() === timestamp.getFullYear() &&
      now.getMonth() === timestamp.getMonth() &&
      now.getDate() === timestamp.getDate()
    ) {
      // Same day, format as "h:mm A"
      const hours = timestamp.getHours();
      const minutes = timestamp.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12;
      return `${formattedHours}:${minutes} ${ampm}`;
    } else if (now.getFullYear() === timestamp.getFullYear()) {
      // Different day but same year, format as "MMM DD"
      const month = monthsShort[timestamp.getMonth()];
      const day = timestamp.getDate().toString().padStart(2, "0");
      return `${month} ${day}`;
    } else {
      // Different year, format as "YYYY"
      return timestamp.getFullYear().toString();
    }
  }

  const notifMessages = notifications?.map((notification) => {
    if (notification.event == "signup") {
      return {
        notification: notification,
        message: (
          <p>
            Welcome to <span className="font-bold text-blue-700">CodingOH</span>
            ,{" "}
            <span className="font-bold">
              {notification.coder_ref?.first_name}{" "}
              {notification.coder_ref?.last_name}
            </span>
            !
          </p>
        ),
      };
    } else if (notification.event == "add_question") {
      return {
        notification: notification,
        message: (
          <span>
            Thanks for adding your question! Stay tuned for meeting requests,
            comments, and answers!
          </span>
        ),
      };
    } else if (notification.event == "delete_question") {
      return {
        notification: notification,
        message: <span>A question you contributed to has been deleted.</span>,
      };
    } else if (notification.event == "schedule_meet") {
      return {
        notification: notification,
        message: (
          <p>
            <span className="font-bold">
              {notification.scheduling_ref?.scheduler_id?.first_name}{" "}
              {notification.scheduling_ref?.scheduler_id?.last_name}
            </span>{" "}
            has requested a meeting with you at{" "}
            <span className="font-bold">
              {new Date(
                new Date(
                  notification.scheduling_ref?.scheduled_time ?? ""
                ).toLocaleString("en-US", {
                  timeZone: notification.scheduling_ref?.receiver_id?.timezone,
                })
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>{" "}
            on{" "}
            <span className="font-bold">
              {new Date(
                new Date(
                  notification.scheduling_ref?.scheduled_time ?? ""
                ).toLocaleString("en-US", {
                  timeZone: notification.scheduling_ref?.receiver_id?.timezone,
                })
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
            .
          </p>
        ),
      };
    } else if (notification.event == "accept_meet") {
      return {
        notification: notification,
        message: (
          <p>
            <span className="font-bold">
              {notification.scheduling_ref?.receiver_id?.first_name}{" "}
              {notification.scheduling_ref?.receiver_id?.last_name}
            </span>{" "}
            has accepted your meeting request with you at{" "}
            <span className="font-bold">
              {new Date(
                new Date(
                  notification.scheduling_ref?.scheduled_time ?? ""
                ).toLocaleString("en-US", {
                  timeZone: notification.scheduling_ref?.scheduler_id?.timezone,
                })
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </span>{" "}
            on{" "}
            <span className="font-bold">
              {new Date(
                new Date(
                  notification.scheduling_ref?.scheduled_time ?? ""
                ).toLocaleString("en-US", {
                  timeZone: notification.scheduling_ref?.scheduler_id?.timezone,
                })
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
            .
          </p>
        ),
      };
    } else if (notification.event == "reject_meet") {
      return {
        notification: notification,
        message: (
          <p>
            <span className="font-bold">
              {notification.scheduling_ref?.receiver_id?.first_name}{" "}
              {notification.scheduling_ref?.receiver_id?.last_name}
            </span>{" "}
            has unfortunately rejected your meeting request.
          </p>
        ),
      };
    } else if (notification.event == "reschedule_meet") {
      return {
        notification: notification,
        message: (
          <p>
            <span className="font-bold">
              {notification.scheduling_ref?.receiver_id?.first_name}{" "}
              {notification.scheduling_ref?.receiver_id?.last_name}
            </span>{" "}
            has requested to reschedule your meeting.
          </p>
        ),
      };
    } else if (notification.event == "cancel_meet") {
      return {
        notification: notification,
        message: (
          <p>
            <span className="font-bold">
              {notification.scheduling_ref?.scheduler_id?.first_name}{" "}
              {notification.scheduling_ref?.scheduler_id?.last_name}
            </span>{" "}
            has unfortunately chosen to cancel their meeting with you.
          </p>
        ),
      };
    } else if (notification.event == "add_project") {
      const projectMessage =
        notification.project_ref?.status == "completed" ? (
          <p>
            Congratulations on completing{" "}
            <span className="font-bold text-green-500">
              {notification.project_ref.name}
            </span>
            !
          </p>
        ) : (
          <p>
            Good luck on{" "}
            <span className="font-bold">{notification.project_ref?.name}</span>!
          </p>
        );

      return {
        notification: notification,
        message: projectMessage,
      };
    } else if (notification.event == "new_comment") {
      return {
        notification: notification,
        message: (
          <p>
            <span className="font-bold">
              {notification.comment_ref?.commenter?.first_name}{" "}
              {notification.comment_ref?.commenter?.last_name}
            </span>{" "}
            has commented on your question.
          </p>
        ),
      };
    } else if (notification.event == "question_answered") {
      const notifMessage =
        notification.comment_ref?.commenter?.id ==
        notification.coder_ref?.id ? (
          <p>
            Your comment has been marked as an answer to a question you
            contributed to!
          </p>
        ) : (
          <p>
            <span className="font-bold">
              {notification.comment_ref?.commenter?.first_name}{" "}
              {notification.comment_ref?.commenter?.last_name}
            </span>{" "}
            has provided an answer to a question you contributed to.
          </p>
        );

      return {
        notification: notification,
        message: notifMessage,
      };
    } else if (notification.event == "finish_meet") {
      return {
        notification: notification,
        message: <p>Congratulations on completing your meeting!</p>,
      };
    } else {
      return { notification: notification, message: notification.event };
    }
  });

  const handleRead = async (id: number, value: boolean) => {
    setNotifications((prevNotifications) =>
      prevNotifications?.map((notification) =>
        notification.id === id ? { ...notification, read: value } : notification
      )
    );

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: value })
      .eq("id", id);
    if (data) {
      console.log(data);
    } else {
      console.error(error);
    }
  };

  const handleAllRead = async () => {
    setNotifications((prevNotifications) =>
      prevNotifications?.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", notifications?.map((notification) => notification.id) ?? []);
    if (data) {
      console.log(data);
    } else {
      console.error(error);
    }
  };

  const onDateSelect = (value: Dayjs) => {
    setCalendarDate(value);
    console.log(value.format("MM/DD/YYYY"));
  };

  useEffect(() => {
    const filtered = schedulings.filter((s) =>
      dayjs(s.scheduled_time).isSameOrAfter(calendarDate)
    );
    setFilteredSchedulings(filtered);
  }, [calendarDate, schedulings]);

  return (
    <Drawer
      placement="bottom"
      onClose={onClose}
      open={open}
      className="font-sans"
      styles={{ header: { display: "none" } }}
    >
      <div className="flex flex-row h-full font-sans">
        <div className="basis-1/12 flex flex-col">
          <h1
            onClick={() => setInboxType("notifications")}
            className={`font-bold cursor-pointer ${inboxType == "notifications" ? "text-blue-500" : "hover:text-blue-500"}`}
          >
            {inboxType == "notifications" && "> "}Notifications
          </h1>
          <h1
            onClick={() => setInboxType("messages")}
            className={`font-bold cursor-pointer ${inboxType == "messages" ? "text-blue-500" : "hover:text-blue-500"}`}
          >
            {inboxType == "messages" && "> "}Messages
          </h1>
          <h1
            onClick={() => setInboxType("calendar")}
            className={`font-bold cursor-pointer ${inboxType == "calendar" ? "text-blue-500" : "hover:text-blue-500"}`}
          >
            {inboxType == "calendar" && "> "}Calendar
          </h1>
        </div>
        <div className="basis-11/12">
          {inboxType == "notifications" && (
            <div className="flex flex-row w-full h-full">
              <div className="basis-3/5 flex flex-col items-center">
                <div className="flex flex-row items-center justify-between w-full">
                  <h1 className="ml-1.5 font-bold text-lg">Notifications</h1>
                  <div
                    onClick={handleAllRead}
                    className="flex flex-row items-center justify-center gap-1 p-1 text-emerald-500 cursor-pointer rounded-xl text-sm hover:underline"
                  >
                    Mark all as read <FaCheck color="green" />
                  </div>
                </div>
                <div className="w-full overflow-y-auto">
                  {notifMessages?.map((notification) => (
                    <div
                      onClick={() =>
                        setSpotlightNotification(notification.notification)
                      }
                      className={`w-full flex flex-row items-center justify-between p-2 hover:bg-blue-400/50 rounded-xl cursor-pointer ${spotlightNotification?.id === notification.notification?.id && "bg-blue-400/50"}`}
                    >
                      <div className="flex flex-row items-center justify-center gap-2">
                        {!notification.notification.read ? (
                          <FaCircleDot
                            color="red"
                            className="text-xs"
                            onClick={() =>
                              handleRead(
                                notification.notification.id ?? 0,
                                true
                              )
                            }
                          />
                        ) : (
                          <FaCheck
                            color="green"
                            onClick={() =>
                              handleRead(
                                notification.notification.id ?? 0,
                                false
                              )
                            }
                          />
                        )}
                        <div>{notification.message}</div>
                      </div>

                      <div className="text-sm">
                        {formatTimestamp(
                          notification.notification.created_at ?? ""
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="basis-2/5 flex flex-col items-start">
                <h1 className="ml-1.5 font-bold text-lg">Actions</h1>
                <SpotlightAction notification={spotlightNotification} />
              </div>
            </div>
          )}
          {inboxType == "messages" && (
            <div className="flex flex-col items-center justify-start w-full h-full">
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm">Messages coming soon 😉</p>
            </div>
          )}
          {inboxType == "calendar" && (
            <div className="flex flex-row items-start justify-between mx-auto">
              <div className="flex w-2/5 border border-solid border-gray-300 shadow-lg rounded-lg">
                <Calendar fullscreen={false} onSelect={onDateSelect} />
              </div>
              <div className="flex flex-col items-center justify-start w-full h-full overflow-y-auto">
                {filteredSchedulings.length === 0 ? (
                  <>
                    <h1 className="text-2xl font-bold">Calendar</h1>
                    <p className="text-sm">No meetings scheduled.</p>
                  </>
                ) : (
                  filteredSchedulings.map((s) => (
                    <RenderScheduling s={s} user={user ?? { id: "" }} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

// signup, add_question, schedule_meet, accept_meet, reject_meet, reschedule_meet, cancel_meet, finish_meet, new_comment, question_answered, new_message, message_react, delete_question, add_project

export default Inbox;
