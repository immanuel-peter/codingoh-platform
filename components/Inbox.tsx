"use client";

import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import { FaCircleDot, FaCheck, FaArrowTurnDown } from "react-icons/fa6";
import { LuExternalLink } from "react-icons/lu";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

import {
  Coder,
  Question,
  Notification,
  Comment,
  Project,
  Scheduling,
} from "@/types";
import { Card } from "@/components";

const SpotlightAction = ({ notification }: { notification: Notification }) => {
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
  } else if (notification.event == "add_question") {
    return (
      <div className="flex flex-col items-start justify-start p-1.5 w-full overflow-y-auto">
        <Link
          href={`/questions/${notification.question_ref?.id}`}
          className="flex flex-row items-center justify-between w-full cursor-pointer hover:bg-slate-200/50 hover:py-1 hover:px-2 rounded-lg"
        >
          <span>View your question</span>
          <LuExternalLink className="text-blue-500" />
        </Link>
        <p className="mt-2">
          <span className="font-bold">Question:</span>{" "}
          {notification.question_ref?.question}
        </p>
      </div>
    );
  } else {
    return (
      <>
        <p className="p-1.5 text-sm">No actions to be taken.</p>
      </>
    );
  }
};

const Inbox = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [spotlightNotification, setSpotlightNotification] =
    useState<Notification>({});
  const [inboxType, setInboxType] = useState<string>("notifications");

  useEffect(() => {
    const fetchNotifications = async () => {
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
          const { data: notificationsData, error: notificationsError } =
            await supabase
              .from("notifications")
              .select(
                `id, created_at, event, read, coder_ref (id, first_name, last_name, position, stack, profile_image, auth_id), question_ref (id, asker (id, first_name, last_name, profile_image, auth_id), question, description, tags, answer_preference, answer), comment_ref (id, parent_comment (id, commenter (id, first_name, last_name, profile_image, auth_id), is_answer, likes, text), commenter (id, first_name, last_name, profile_image, auth_id), is_answer, likes, text), project_ref (name, status), scheduling_ref (id, scheduler_id (id, first_name, last_name, profile_image, auth_id, timezone), receiver_id (id, first_name, last_name, profile_image, auth_id, timezone), scheduled_time, sender_note, status, receiver_note, is_done, is_confirmed)`
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
                      auth_id: question_ref.asker.auth_id as string,
                    },
                    question: question_ref.question as string,
                    description: question_ref.description as string,
                    tags: question_ref.tags as string[],
                    answer_preference: question_ref.answer_preference as string,
                    answer: question_ref.answer as boolean,
                  }
                : question_ref;

              const updatedComment: Comment = comment_ref
                ? {
                    id: comment_ref.id as number,
                    parent_comment: {
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
                      text: comment_ref.parent_comment.text as string,
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
                    text: comment_ref.text as string,
                  }
                : comment_ref;

              const updatedProject: Project = project_ref
                ? {
                    name: project_ref.name as string,
                    status: project_ref.status as string,
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
    fetchNotifications();
  }, []);

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
                            handleRead(notification.notification.id ?? 0, true)
                          }
                        />
                      ) : (
                        <FaCheck
                          color="green"
                          onClick={() =>
                            handleRead(notification.notification.id ?? 0, false)
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
              <div className="basis-2/5 flex flex-col items-start">
                <h1 className="ml-1.5 font-bold text-lg">Actions</h1>
                <SpotlightAction notification={spotlightNotification} />
              </div>
            </div>
          )}
          {inboxType == "messages" && (
            <div className="flex flex-col items-center justify-start w-full h-full">
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm">No messages yet.</p>
            </div>
          )}
          {inboxType == "calendar" && (
            <div className="flex flex-col items-center justify-start w-full h-full">
              <h1 className="text-2xl font-bold">Calendar</h1>
              <p className="text-sm">No events scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

// signup, add_question, schedule_meet, accept_meet, reject_meet, reschedule_meet, cancel_meet, finish_meet, new_comment, question_answered, new_message, message_react, delete_question, add_project

export default Inbox;
