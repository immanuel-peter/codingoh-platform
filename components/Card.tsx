import React from "react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import { palette } from "@mui/system";

import Avatar from "../public/avatar.png";
import Banner from "../public/banner.png";
import { getTopLanguages } from "@/utils";
import { Proficiency } from "@/types";

interface CardProps {
  name: string;
  position: string;
  isOnline: boolean;
  languages?: Proficiency[];
  extraStyles?: string;
}

const Card = ({
  name,
  position,
  isOnline,
  languages,
  extraStyles,
}: CardProps) => {
  let filteredLanguages: Proficiency[];

  if (languages && languages.length !== 0) {
    filteredLanguages = getTopLanguages(languages, 3);
  } else {
    return [];
  }

  return (
    <>
      <div
        className={`flex flex-col justify-center items-center mt-2 ${extraStyles}`}
      >
        <div className="relative flex flex-col items-center rounded-[20px] w-[300px] mx-auto p-4 border-2 border-slate-300 border-solid bg-white bg-clip-border shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
          <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover">
            <Image
              src={Banner}
              alt="background cover"
              className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
            />
            <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
              <Image
                src={Avatar}
                alt="profile picture"
                className="h-full w-full rounded-full"
              />
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center bg-white">
            <h4 className="text-xl font-bold text-navy-700 bg-white dark:text-white">
              {name}
            </h4>
            <p className="text-base font-normal bg-white text-gray-600">
              {position}
            </p>
            <div className="mt-1 flex items-center bg-white gap-x-1.5">
              {isOnline ? (
                <>
                  <div className="flex-none rounded-full bg-white bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500 bg-white">
                    Online
                  </p>
                </>
              ) : (
                <>
                  <div className="flex-none rounded-full bg-white bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500 bg-white">
                    Offline
                  </p>
                </>
              )}
            </div>
          </div>
          {filteredLanguages && filteredLanguages.length > 0 ? (
            <div className="mt-6 mb-3 flex gap-14 bg-white md:!gap-14">
              <div className="flex flex-col items-center justify-center bg-white">
                <p className="text-2xl font-bold text-navy-700 bg-inherit">
                  <CircularProgress
                    variant="determinate"
                    value={filteredLanguages[0].proficiency}
                  />
                </p>
                <p className="text-sm font-normal bg-inherit text-gray-600">
                  {filteredLanguages[0].language}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-inherit">
                <p className="text-2xl font-bold text-navy-700 bg-inherit">
                  <CircularProgress
                    variant="determinate"
                    value={filteredLanguages[1].proficiency}
                  />
                </p>
                <p className="text-sm font-normal text-gray-600 bg-inherit">
                  {filteredLanguages[1].language}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-inherit">
                <p className="text-2xl font-bold text-navy-700 bg-inherit dark:text-white">
                  <CircularProgress
                    variant="determinate"
                    value={filteredLanguages[2].proficiency}
                  />
                </p>
                <p className="text-sm font-normal text-gray-600 bg-inherit">
                  {filteredLanguages[2].language}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-green-500">Still Learning...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
