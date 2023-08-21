"use client";

import React, { useState, useEffect } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuMinusCircle } from "react-icons/lu";
import { Tooltip, Progress } from "antd";
import { Slider } from "@mui/joy";

import { allIcons } from "@/utils/icons";

const Autocomplete = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [userLangs, setUserLangs] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = Object.keys(allIcons);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
  };

  const filterOptions = (inputValue: string) => {
    const filtered = options.filter(
      (option) =>
        option.toLowerCase().includes(inputValue.toLowerCase()) &&
        option !== selectedOption
    );
    setFilteredOptions(filtered);
  };

  const handleOptionClick = (option: string) => {
    setInputValue(option);
    setSelectedOption(option);
    setFilteredOptions([]);
    setShowOptions(false);
  };

  const handleAddLang = (lang: string) => {
    setUserLangs([...userLangs, lang]);
    setInputValue("");
    setFilteredOptions([]);
    setShowOptions(false);
    setSelectedOption("");
  };

  const handleDocClick = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest("#autocomplete-wrapper")) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocClick);
    return () => {
      document.removeEventListener("click", handleDocClick);
    };
  }, []);

  useEffect(() => {
    filterOptions(inputValue);
    setShowOptions(true);
  }, [inputValue]);

  return (
    <>
      <h2 className="text-base font-semibold leading-7 mb-7l text-gray-900">
        Frameworks
      </h2>

      <div className="flex flex-row mt-10 items-start justify-between">
        <div className="flex flex-row items-center gap-6 mb-6">
          <div id="autocomplete-wrapper" className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Ex: Python"
              className="border rounded-lg p-2 w-64 h-8"
            />
            {showOptions && filteredOptions.length > 0 && (
              <ul className="absolute bg-white border rounded w-48 mt-1 max-h-40 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <li
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <BsPlusCircleFill
            className={`text-2xl ${
              inputValue === ""
                ? "disabled text-gray-500"
                : "cursor-pointer text-blue-400 hover:text-blue-600"
            }
        `}
            onClick={() => handleAddLang(inputValue)}
          />
        </div>

        <div className="flex flex-col ml-20">
          {userLangs.length > 0 && (
            <>
              <div className="flex flex-row items-center justify-between font-bold">
                <h3>Language</h3>
                <h3>Proficiency</h3>
              </div>
              <span className="text-sm text-gray-500 text-center mb-7">
                If you want to delete a language, rate your skill level as{" "}
                <span className="font-bold text-red-400">0</span>
              </span>
            </>
          )}

          {userLangs.length > 0 &&
            userLangs.map((lang, index) => (
              <ShowSkill key={index} skill={lang} />
            ))}
        </div>
      </div>
    </>
  );
};

const ShowSkill = ({ skill }: { skill: string }) => {
  return (
    <div className="grid grid-cols-6 justify-between m-2">
      <div key={skill} className="col-span-1 mr-20">
        <Tooltip title={skill} arrow={false} placement="right">
          {allIcons[skill]}
        </Tooltip>
      </div>
      <Slider
        size="md"
        color="neutral"
        valueLabelDisplay="on"
        min={0}
        max={100}
        step={1}
        className="col-span-5"
      />
    </div>
  );
};

export default Autocomplete;
