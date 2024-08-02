import React from "react";
import Link from "next/link";
import { FaCode } from "react-icons/fa6";

export const RejectMeeting = (props: {
  receiver_id: number;
  receiver_name: string;
  scheduler_name: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    receiver_id,
    receiver_name,
    scheduler_name,
    question_title,
    question_id,
  } = props;

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
        <p>Hi {scheduler_name},</p>
        <p>
          <Link
            href={`https://codingoh.com/users/${receiver_id}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {receiver_name}
          </Link>{" "}
          has decided to reject your meeting request, regarding this question:{" "}
          <Link
            href={`https://codingoh.com/questions/${question_id}`}
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            {question_title}
          </Link>
          .
        </p>
        <p>
          We're sorry if this caused any inconvenience. If you want to ask a
          question,{" "}
          <Link
            href="https://codingoh.com/questions/add"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            click here
          </Link>
          . If you want to contribute to a question on the platform,{" "}
          <Link
            href="https://codingoh.com"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            click here
          </Link>
          .
        </p>
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
