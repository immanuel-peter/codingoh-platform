"use client";

import React, { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaVideo, FaCheck } from "react-icons/fa6";
import { MdOutlineScheduleSend } from "react-icons/md";
import { Transition, Dialog } from "@headlessui/react";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { DateTimePicker, renderTimeViewClock } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Avatar, AvatarGroup } from "@mui/joy";

import { daysBetweenDateAndToday } from "@/utils";
import avatar from "../public/avatar.png";
import { Coder, Contributor, Question as QuestionType } from "@/types";
import { ellipsis } from "@/utils";

interface Response {
  id: number;
  created_at?: Date | string;
  question_id: QuestionType;
  user_id: Coder;
}

interface QuestionProps {
  question: string;
  asker: string;
  contributors: Contributor[];
  date: string;
  answered?: boolean;
  extraStyles?: string[];
}

const Question = ({
  question,
  asker,
  contributors,
  date,
  answered,
  extraStyles,
}: QuestionProps) => {
  const [isScheduleMeetOpen, setIsScheduleMeetOpen] = useState<boolean>(false);
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [didSchedule, setDidSchedule] = useState<boolean>(false);

  const handleSchedule = () => {
    setDidSchedule(true);
    setIsScheduleMeetOpen(false);
  };

  return (
    <>
      <div
        className={`flex gap-x-4 basis-3/5 justify-items-center pl-3 ${
          extraStyles ? extraStyles[0] : null
        }`}
      >
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {ellipsis(question, 120)}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {asker} · {daysBetweenDateAndToday(date)}
          </p>
        </div>
      </div>
      <div
        className={`flex flex-col items-end basis-4/12 ${
          extraStyles ? extraStyles[0] : null
        }`}
      >
        {/* <p className="text-sm leading-6 text-gray-900">
          
        </p> */}
        <div className="flex -space-x-1 overflow-hidden pr-3">
          {contributors.length < 5 ? (
            contributors.map((contributor) =>
              contributor.user_id.profile_image ? (
                <Image
                  key={contributor.user_id?.id}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                  alt="contributor"
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  height={24}
                  width={24}
                />
              ) : (
                <Avatar sx={{ "--Avatar-size": "24px" }}>
                  {contributor.user_id.first_name[0]}
                  {contributor.user_id.last_name[0]}
                </Avatar>
              )
            )
          ) : (
            <div className="flex items-center">
              {contributors.slice(0, 4).map((contributor) =>
                contributor.user_id.profile_image ? (
                  <Image
                    key={contributor.user_id?.id}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                    alt="contributor"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                    height={24}
                    width={24}
                  />
                ) : (
                  <Avatar sx={{ "--Avatar-size": "24px" }}>
                    {contributor.user_id.first_name[0]}
                    {contributor.user_id.last_name[0]}
                  </Avatar>
                )
              )}
              <div
                key={5}
                className="flex h-7 w-7 rounded-full bg-slate-200 ring-2 ring-white items-center justify-center text-center text-xs"
              >
                +{contributors.length - 4}
              </div>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs leading-5 text-gray-500 pr-3">
          {`${contributors.length} ${
            contributors.length === 1 ? "contributor" : "contributors"
          }`}
        </p>
      </div>
      {/* {!answered ? (
        <div
          className={`flex flex-col basis-2/12 items-center justify-center ${
            extraStyles ? extraStyles[0] : null
          }`}
        >
          <button
            onClick={() => setIsScheduleMeetOpen(true)}
            className={`text-base font-medium p-3 items-center justify-between flex flex-row border-solid border-[1px] ${
              !didSchedule
                ? "border-blue-600 hover:border-blue-800 bg-blue-500 hover:bg-blue-700"
                : "border-yellow-500 hover:border-yellow-700 bg-yellow-400 hover:bg-yellow-600"
            } rounded-md`}
          >
            <FaVideo className="bg-inherit text-slate-200 mr-3" />
            <p className="bg-inherit text-slate-200">
              {!didSchedule ? "Schedule" : "Scheduled"}
            </p>
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col basis-2/12 items-center justify-center ${
            extraStyles ? extraStyles[0] : null
          }`}
        >
          <div className="text-base font-medium p-3 items-center justify-between flex flex-row border-solid border-green-600 border-[1px] bg-green-500 rounded-md">
            <FaCheck className="bg-green-500 text-slate-200 mr-3" />
            <p className="bg-green-500 text-slate-200">Answered</p>
          </div>
        </div>
      )} */}

      <Transition appear show={isScheduleMeetOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsScheduleMeetOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-blue-600 inline-flex items-center gap-2"
                  >
                    Schedule Your Meeting <FaVideo />
                  </Dialog.Title>
                  <div className="py-4 my-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Choose Date and Time"
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                        sx={{ width: "100%", height: "100%" }}
                        value={dateTime}
                        onChange={(newValue) => setDateTime(newValue)}
                        format="lll"
                      />
                    </LocalizationProvider>
                  </div>

                  <div className="mt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-yellow-100 px-4 py-2 text-base font-medium text-yellow-900 hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
                      onClick={handleSchedule}
                    >
                      Schedule <MdOutlineScheduleSend />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Question;
