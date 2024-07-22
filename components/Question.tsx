"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar } from "antd";

import { daysBetweenDateAndToday } from "@/utils";
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

// id, first_name, last_name, profile_image, auth_id

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
        className={`flex gap-x-4 basis-3/5 justify-items-center pl-3 ${answered && "bg-green-300"} ${
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
        className={`flex flex-col items-end basis-4/12 ${answered && "bg-green-300"} ${
          extraStyles ? extraStyles[0] : null
        }`}
      >
        {/* <p className="text-sm leading-6 text-gray-900">
          
        </p> */}
        <div
          className={`flex -space-x-1 overflow-hidden pr-3 ${answered && "bg-green-300"}`}
        >
          {contributors.length < 5 ? (
            contributors.map((contributor) =>
              contributor.user_id?.profile_image ? (
                <Image
                  key={contributor.user_id?.id}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                  alt="contributor"
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                  height={24}
                  width={24}
                />
              ) : (
                <Avatar size={24}>
                  {contributor.user_id?.first_name
                    ? contributor.user_id.first_name[0]
                    : "</>"}
                  {contributor.user_id?.last_name
                    ? contributor.user_id.last_name[0]
                    : ""}
                </Avatar>
              )
            )
          ) : (
            <div className="flex items-center">
              {contributors.slice(0, 4).map((contributor) =>
                contributor.user_id?.profile_image ? (
                  <Image
                    key={contributor.user_id?.id}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${contributor.user_id.auth_id}`}
                    alt="contributor"
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                    height={24}
                    width={24}
                  />
                ) : (
                  <Avatar size={24}>
                    {contributor.user_id?.first_name
                      ? contributor.user_id.first_name[0]
                      : "</>"}
                    {contributor.user_id?.last_name
                      ? contributor.user_id.last_name[0]
                      : ""}
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
        <p
          className={`mt-1 text-xs leading-5 text-gray-500 pr-3 ${answered && "bg-green-300"}`}
        >
          {`${contributors.length} ${
            contributors.length === 1 ? "contributor" : "contributors"
          }`}
        </p>
      </div>
    </>
  );
};

export default Question;
