import React from "react";
import Link from "next/link";
import { FaCode } from "react-icons/fa6";
import { parseISO, format, addMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const createMeetingICS = (props: {
  receiver_name: string;
  receiver_tz: string;
  scheduler_name: string;
  scheduled_time: string;
  question_title: string;
}) => {
  const {
    receiver_name,
    receiver_tz,
    scheduler_name,
    scheduled_time,
    question_title,
  } = props;

  // Parse and format the date
  const date = parseISO(scheduled_time);
  const zonedDate = toZonedTime(date, receiver_tz);
  const endZonedDate = addMinutes(zonedDate, 30);
  const formattedDate = format(zonedDate, "yyyyMMdd'T'HHmmss'Z'");
  const formattedEndDate = format(endZonedDate, "yyyyMMdd'T'HHmmss'Z'"); // Assuming a 1-hour meeting

  const icsData = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CodingOH//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${new Date().getTime()}@codingoh.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${formattedDate}
DTEND:${formattedEndDate}
SUMMARY:Meeting with ${receiver_name}
DESCRIPTION:Meeting to discuss the question "${question_title}" on CodingOH.
ORGANIZER;CN=${scheduler_name}:MAILTO:no-reply@codingoh.com
ATTENDEE;CN=${receiver_name};RSVP=TRUE:MAILTO:no-reply@codingoh.com
LOCATION:Online
END:VEVENT
END:VCALENDAR
  `.trim();

  // Create a File object from the ICS data
  return new File([icsData], "meeting.ics", { type: "text/calendar" });
};

export const AcceptMeeting = (props: {
  receiver_id: string;
  receiver_name: string;
  receiver_tz: string;
  scheduler_name: string;
  scheduled_time: string;
  question_title: string;
  question_id: number;
}) => {
  const {
    receiver_id,
    receiver_name,
    receiver_tz,
    scheduler_name,
    scheduled_time,
    question_title,
    question_id,
  } = props;

  const date = parseISO(scheduled_time);
  const zonedDate = toZonedTime(date, receiver_tz);
  const formattedDate = format(zonedDate, "MMMM dd, yyyy 'at' h:mm a");

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
          has accepted your meeting request. You will meet with{" "}
          {receiver_name.split(" ")[0]} on{" "}
          <span className="font-bold underline">{formattedDate}</span>.
          Remember, you chose to help you out with this question:{" "}
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
          If you want to <span className="text-purple-500">edit</span> the
          meeting time, click the button below. Once you select the time you
          want to reschedule to, your meeting request will be sent back to
          reconsideration.
        </p>
        <div className="flex items-center justify-center w-full">
          <Link
            href={`https://codingoh.com/questions/${question_id}`}
            target="_blank"
            className="p-2 bg-purple-600 text-white rounded-md"
          >
            Edit Your Meeting
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
