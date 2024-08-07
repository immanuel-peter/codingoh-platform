import React from "react";
import Link from "next/link";
import { FaCode } from "react-icons/fa6";

export const RescheduleMeeting = (props: {
  receiver_id: string;
  receiver_name: string;
  receiver_tz: string;
  receiver_note: string;
  scheduler_name: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    receiver_id,
    receiver_name,
    receiver_tz,
    receiver_note,
    scheduler_name,
    question_title,
    question_id,
  } = props;

  return (
    <main className="flex flex-col items-center justify-center bg-slate-200">
      <div className="flex items-center justify-center w-full py-2 bg-slate-300">
        <Link
          href="https://codingoh.com"
          target="_blank"
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
        <p>Hi {scheduler_name},</p>
        <p>
          <Link
            href={`https://codingoh.com/users/${receiver_id}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {receiver_name}
          </Link>{" "}
          has asked that you reschedule your meeting. Check the note to identify
          what time {receiver_name.split(" ")[0]} would like the meeting to be
          at. Remember, {receiver_name.split(" ")[0]}
          lives in the {receiver_tz} timezone.
        </p>
        <p>
          Question:{" "}
          <Link
            href={`https://codingoh.com/questions/${question_id}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {question_title}
          </Link>
        </p>
        {receiver_note && (
          <div className="bg-slate-300 p-2 rounded-md">
            <p className="font-semibold">Sender Note</p>
            <p>{receiver_note}</p>
          </div>
        )}
        <div className="flex items-center justify-center w-full">
          <Link
            href={`https://codingoh.com/questions/${question_id}`}
            target="_blank"
            className="p-2 bg-blue-600 text-white rounded-md"
          >
            Reschedule Your Meeting
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
