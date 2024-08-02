import React from "react";
import Link from "next/link";
import { FaCode } from "react-icons/fa6";
import { parseISO, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const MeetingRequest = (props: {
  receiver_name: string;
  scheduler_id: number;
  scheduler_name: string;
  scheduled_time: string;
  scheduler_tz: string;
  question_title: string;
  question_id: number;
  sender_note: string;
}) => {
  const {
    receiver_name,
    scheduler_id,
    scheduler_name,
    scheduled_time,
    scheduler_tz,
    question_title,
    question_id,
    sender_note,
  } = props;

  const date = parseISO(scheduled_time);
  const zonedDate = toZonedTime(date, scheduler_tz);
  const formattedDate = format(zonedDate, "MMMM dd, yyyy 'at' h:mm a");

  return (
    <main className="flex flex-col items-center justify-center bg-slate-200">
      <div className="flex items-center justify-center w-full py-2 bg-slate-300">
        <Link
          href="https://codingoh.com"
          className="flex flex-row items-center ml-[10px]"
        >
          <FaCode className="text-3xl" />
          <div className="flex flex-col">
            <span className="text-2xl text-blue-700 font-bold ml-2">
              CodingOH
            </span>
            <span className="text-[10.5px] ml-2">
              Stack Overflow in Real Time
            </span>
          </div>
        </Link>
      </div>
      <div className="flex flex-col gap-2 w-full p-2 bg-white text-sm">
        <p>Hi {receiver_name},</p>
        <p>
          <Link
            href={`https://codingoh.com/users/${scheduler_id}`}
            className="text-blue-500 hover:underline"
          >
            {scheduler_name}
          </Link>{" "}
          has requested a meeting with you on{" "}
          <span className="font-bold underline">{formattedDate}</span>.
          Specically, {scheduler_name.split(" ")[0]} wants to help you out with
          this question:{" "}
          <Link
            href={`https://codingoh.com/questions/${question_id}`}
            className="text-blue-500 hover:underline"
          >
            {question_title}
          </Link>
          .
        </p>
        {sender_note && (
          <div className="bg-slate-300 p-2 rounded-md">
            <p className="font-semibold">Sender Note</p>
            <p>{sender_note}</p>
          </div>
        )}
        <p>
          You can choose to <span className="text-green-500">accept</span>,{" "}
          <span className="text-red-500">reject</span>, or{" "}
          <span className="text-blue-500">reschedule</span> the meeting. If you
          plan on rescheduling the meeting to another time, let{" "}
          {scheduler_name.split(" ")[0]} know what time you would like it
          scheduled at. Make sure to include your time zone to avert confusion
          about the starting time.
        </p>
        <div className="flex items-center justify-center w-full">
          <Link
            href={`https://codingoh.com/questions/${question_id}`}
            className="p-2 bg-blue-600 text-white rounded-md"
          >
            Check Out the Meeting Request
          </Link>
        </div>
        <div>
          <p>Best,</p>
          <p className="flex flex-row items-center gap-1 text-blue-700 font-bold">
            CodingOH <FaCode />
          </p>
        </div>
      </div>
    </main>
  );
};
