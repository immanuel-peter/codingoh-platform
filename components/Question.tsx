"use client";

import React from "react";
import Link from "next/link";
import { FaVideo } from "react-icons/fa6";

import { daysBetweenDateAndToday } from "@/utils";

interface QuestionProps {
  question: string;
  asker: string;
  contributors: number;
  date: string;
}

const Question = ({ question, asker, contributors, date }: QuestionProps) => {
  return (
    <>
      <div className="flex gap-x-4 basis-1/2">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {question}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {asker}
          </p>
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-col sm:items-end basis-4/12">
        <p className="text-sm leading-6 text-gray-900">
          {`${contributors} ${
            contributors === 1 ? "contributor" : "contributors"
          }`}
        </p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          <span>
            {daysBetweenDateAndToday(date) === 0
              ? "Today"
              : `${daysBetweenDateAndToday(date)} days`}
          </span>
        </p>
      </div>
      <div className="flex flex-col basis-2/12 items-center justify-center">
        <Link href="/">
          <div className="text-base font-medium p-3 items-center justify-between flex flex-row border-solid border-blue-600 border-2 bg-blue-500 rounded-md">
            <FaVideo className="bg-blue-500 mr-3" />
            <p className="bg-blue-500">Join</p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Question;
