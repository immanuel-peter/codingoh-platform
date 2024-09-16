"use client";

import React, { use, useState } from "react";
import { FaShapes } from "react-icons/fa6";

import sortedIcons from "@/utils/icons";

const Codebot = () => {
  const [selectedLang, setSelectedLang] = useState<string>("");

  return (
    <>
      <div className="flex h-auto">
        {/* Sidebar */}
        <div className="basis-1/5 divide-y divide-black max-h-screen overflow-y-auto">
          <div
            onClick={() => setSelectedLang("misc")}
            className={`flex flex-row items-center justify-start gap-4 p-5 ${
              selectedLang !== "misc"
                ? "bg-gradient-to-l from-gray-200 to-transparent via-gray-200 hover:bg-gray-100 cursor-pointer"
                : "bg-gradient-to-l from-blue-300 to-transparent via-blue-300"
            } `}
          >
            <FaShapes className="w-6 h-6" />
            <div>Miscellaneous</div>
          </div>
          {Object.keys(sortedIcons).map((icon) => (
            <div
              onClick={() => setSelectedLang(icon)}
              className={`flex flex-row items-center justify-start gap-4 p-5 ${
                selectedLang !== icon
                  ? "bg-gradient-to-l from-gray-200 to-transparent via-gray-200 hover:bg-gray-100 cursor-pointer"
                  : "bg-gradient-to-l from-blue-300 to-transparent via-blue-300"
              } `}
            >
              <div>{sortedIcons[icon]}</div>
              <div>{icon}</div>
            </div>
          ))}
        </div>

        {/* Chatbot */}
        <div className="basis-4/5"></div>
      </div>
    </>
  );
};

export default Codebot;
