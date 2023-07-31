"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaVideo, FaCheck } from "react-icons/fa6";

import { daysBetweenDateAndToday } from "@/utils";
import Avatar from "../public/avatar.png";
import { Contributor } from "@/types";

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
  return (
    <>
      <div
        className={`flex gap-x-4 basis-1/2 justify-items-center ${
          extraStyles ? extraStyles[0] : null
        }`}
      >
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {question}
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
        <div className="flex -space-x-1 overflow-hidden">
          {contributors.map((contributor) => (
            <Image
              key={contributor.user.id}
              src={Avatar}
              alt="contributor"
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
            />
          ))}
        </div>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          {`${contributors.length} ${
            contributors.length === 1 ? "contributor" : "contributors"
          }`}
        </p>
      </div>
      {!answered ? (
        <div
          className={`flex flex-col basis-2/12 items-center justify-center ${
            extraStyles ? extraStyles[0] : null
          }`}
        >
          <Link href="/">
            <button className="text-base font-medium p-3 items-center justify-between flex flex-row border-solid border-blue-600 border-[1px] bg-blue-500 rounded-md">
              <FaVideo className="bg-blue-500 text-slate-200 mr-3" />
              <p className="bg-blue-500 text-slate-200">Schedule</p>
            </button>
          </Link>
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
      )}
    </>
  );
};

export default Question;
