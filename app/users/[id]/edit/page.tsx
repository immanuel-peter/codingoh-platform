"use client";

import React, { useState, useEffect } from "react";
import {
  FaCamera,
  FaCircleUser,
  FaDiscord,
  FaDropbox,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLink,
  FaLinkedin,
  FaMedium,
  FaReddit,
  FaStackOverflow,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaYoutube,
  FaXTwitter,
  FaThreads,
} from "react-icons/fa6";
import { HiCheckCircle } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuMinusCircle } from "react-icons/lu";
import CheckIcon from "@mui/icons-material/Check";
import { Badge, Autocomplete, Slider, Avatar } from "@mui/joy";
import { Select, Tooltip, Progress } from "antd";
import { currentUser, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import moment from "moment-timezone";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";

import Navbar from "@/components/Navbar";
import AddUserProfileImageInput from "@/components/newuser/AddUserProfileImageInput";
import BackgroundImageGrid from "@/components/newuser/BackgroundImageGrid";
import LangSelect from "@/components/newuser/LangSelect";
import SocialLinks from "@/components/newuser/SocialLinks";
import backgrounds from "@/public/backgrounds";
import { allIcons } from "@/utils/icons";
import { techSkills as inDemandSkills } from "@/dummy/questions";
import { uniqueArray, labelValues, finalProfsByLangs } from "@/utils";
import { profile } from "console";

const countryList = [
  "United States of America",
  "United Kingdom",
  "Afghanistan",
  "Albania",
  "Algeria",
  "American Samoa",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cayman Islands",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Democratic Republic of the Congo",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Curaçao",
  "Cyprus",
  "Czechia",
  "Côte d'Ivoire",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Guiana",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Greenland",
  "Grenada",
  "Guadeloupe",
  "Guam",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Holy See",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "North Korea",
  "South Korea",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macao",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Martinique",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Federated States of Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norfolk Island",
  "Northern Mariana Islands",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "North Macedonia",
  "Romania",
  "Russia",
  "Rwanda",
  "Réunion",
  "Saint Barthélemy",
  "Saint Helena",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Venezuela",
  "Vietnam",
  "Virgin Islands",
  "Western Sahara",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const labelStyle = "abbrev";

const genderOptions: string[] = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
  "Other",
];

const gatesBday = new Date("1955-10-28");

export const EditUser = () => {
  // Personal Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date | string | undefined>();
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [city, setCity] = useState("");
  const [usState, setUsState] = useState("");
  const [country, setCountry] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [about, setAbout] = useState("");

  const formattedDob =
    dob instanceof Date ? dob.toISOString().split("T")[0] : "";
  console.log(dob);

  const timezones = allTimezones;
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const handleTzChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const data = parseTimezone(e.currentTarget.value);
    setTimezone(data.value);
  };
  console.log(timezone);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setProfileImg(URL.createObjectURL(img));
    }
  };

  // Background Banner
  const [selectedBackgroundImage, setSelectedBackgroundImage] = useState(
    backgrounds[0]
  );

  // Proficient Languages
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [userLangs, setUserLangs] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [userProfs, setUserProfs] = useState<{ lang: string; prof: number }[]>(
    []
  );
  const [finalProfs, setFinalProfs] = useState<{ [lang: string]: number }>({});

  const langOptions = Object.keys(allIcons);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);
  };

  const filterOptions = (inputValue: string) => {
    const filtered = langOptions.filter(
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

  const handleAddProf = (
    event: React.SyntheticEvent<Element, Event> | Event,
    value: number | number[],
    language: string
  ) => {
    if (typeof value === "number") {
      setUserProfs([
        ...userProfs,
        {
          lang: language,
          prof: value,
        },
      ]);
    } else {
      setUserProfs([
        ...userProfs,
        {
          lang: language,
          prof: value[0],
        },
      ]);
    }
    setFinalProfs(finalProfsByLangs(userProfs));
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

  // Skills
  const [skills, setSkills] = useState<string[]>([]);

  const handleSkillChange = (value: string) => {
    setSkills([...skills, value]);
  };

  // Social Links
  const [socials, setSocials] = useState<string[]>([]);
  const [socialLinks, setSocialLinks] = useState([
    { name: "discord", link: "" },
    { name: "dropbox", link: "" },
    { name: "facebook", link: "" },
    { name: "github", link: "" },
    { name: "instagram", link: "" },
    { name: "linkedin", link: "" },
    { name: "medium", link: "" },
    { name: "reddit", link: "" },
    { name: "stackoverflow", link: "" },
    { name: "tiktok", link: "" },
    { name: "twitch", link: "" },
    { name: "x", link: "" },
    { name: "youtube", link: "" },
    { name: "threads", link: "" },
    { name: "personal", link: "" },
  ]);
  const [finalSocialLinks, setFinalSocialLinks] = useState<
    { name: string; link: string }[]
  >([]);

  const socialIcons = [
    {
      name: "discord",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaDiscord className="text-4xl text-violet-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.discord.com"
              value={socialLinks[0].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[0].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "dropbox",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaDropbox className="text-4xl text-blue-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.dropbox.com"
              value={socialLinks[1].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[1].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "facebook",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaFacebook className="text-4xl text-blue-600" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.facebook.com"
              value={socialLinks[2].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[2].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "github",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaGithub className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.github.com"
              value={socialLinks[3].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[3].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "instagram",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaInstagram className="text-4xl text-pink-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.instagram.com"
              value={socialLinks[4].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[4].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "linkedin",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaLinkedin className="text-4xl text-blue-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.linkedin.com"
              value={socialLinks[5].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[5].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "medium",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaMedium className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.medium.com"
              value={socialLinks[6].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[6].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "reddit",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaReddit className="text-4xl text-orange-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.reddit.com"
              value={socialLinks[7].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[7].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "stackoverflow",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaStackOverflow className="text-4xl text-orange-400" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.stackoverflow.com"
              value={socialLinks[8].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[8].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "tiktok",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaTiktok className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.tiktok.com"
              value={socialLinks[9].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[9].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "twitch",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaTwitch className="text-4xl text-purple-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.twitch.com"
              value={socialLinks[10].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[10].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "x",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaXTwitter className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.x.com"
              value={socialLinks[11].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[11].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "youtube",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaYoutube className="text-4xl text-red-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.youtube.com"
              value={socialLinks[12].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[12].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "threads",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaThreads className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.threads.net"
              value={socialLinks[13].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[13].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      name: "personal",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaLink className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.mywebsite.com"
              value={socialLinks[14].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[14].name, e.target.value)
              }
            />
          </div>
        </>
      ),
    },
  ];

  const userSocials = socialIcons.filter((icon) => socials.includes(icon.name));

  const updateSocialLink = (network: string, updatedLink: string) => {
    const updatedLinks = socialLinks.map((link) => {
      if (link.name === network) {
        return { ...link, link: updatedLink };
      }
      return link;
    });

    setSocialLinks(updatedLinks);
    setFinalSocialLinks(socialLinks.filter((item) => item.link !== ""));
  };

  return (
    <>
      <Navbar />

      <form className="mt-5 flex items-center justify-center max-w-7xl">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-3 text-gray-900">
              New User
            </h2>
            <span className="text-xs">
              <sup className="text-red-500">*</sup> Required fields
            </span>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name <sup className="text-red-500">*</sup>
                </label>
                <div className="mt-2">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    placeholder="Bill"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name <sup className="text-red-500">*</sup>
                </label>
                <div className="mt-2">
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    placeholder="Gates"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Gender
                </label>
                <div className="mt-2">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    id="gender"
                    name="gender"
                    autoComplete="sex"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {genderOptions.map((gender) => (
                      <option>{gender}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date of Birth
                </label>
                <div className="mt-2">
                  <input
                    value={formattedDob}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value);
                      setDob(isNaN(newDate.getTime()) ? undefined : newDate);
                    }}
                    type="date"
                    name="dob"
                    id="dob"
                    autoComplete="bday"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Timezone <sup className="text-red-500">*</sup>
                </label>
                <div className="mt-2">
                  <select
                    value={timezone}
                    onChange={handleTzChange}
                    id="timezone"
                    name="gender"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option></option>
                    {options.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address <sup className="text-red-500">*</sup>
                </label>
                <div className="mt-2">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="bill.gates@example.com"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="education"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Education
                </label>
                <div className="mt-2">
                  <input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    id="education"
                    name="education"
                    type="text"
                    placeholder="Harvard University"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Company
                </label>
                <div className="mt-2">
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Microsoft Corporation"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="position"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Position
                </label>
                <div className="mt-2">
                  <input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    id="position"
                    name="position"
                    type="text"
                    placeholder="Chief Executive Officer"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Seattle"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="text-sm font-medium leading-6 text-gray-900 flex flex-row items-center"
                >
                  State{" "}
                  <span className="block ml-2 text-sm font-thin leading-6 text-gray-400">
                    (Optional)
                  </span>
                </label>
                <div className="mt-2">
                  <input
                    value={usState}
                    onChange={(e) => setUsState(e.target.value)}
                    id="state"
                    name="state"
                    type="text"
                    placeholder="Washington"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Country
                </label>
                <div className="mt-2">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    placeholder="United States"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    {countryList.map((country) => (
                      <option>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-1">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Avatar
                </label>
                <div className="mt-2 flex flex-row justify-start gap-3 items-center">
                  {profileImg !== "" ? (
                    <Avatar size="lg" src={profileImg} />
                  ) : firstName !== "" && lastName !== "" ? (
                    <Avatar size="lg">{`${firstName[0]}${lastName[0]}`}</Avatar>
                  ) : (
                    <Avatar size="lg" />
                  )}
                  <label className="p-1 border border-solid rounded-lg cursor-pointer bg-white hover:bg-gray-50 shadow-sm font-medium">
                    Change
                    <input
                      type="file"
                      name="profile-img"
                      onChange={onImageChange} // need to work on this
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="sm:col-span-5">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                    placeholder="I'm a software engineer and philanthropist. I'm the co-founder of Microsoft, and I've been passionate about coding since I was a kid. I believe that coding is a powerful tool that can be used to solve some of the world's biggest problems. I want to learn from other programmers and share my own knowledge. I'm always looking for new ways to improve my skills, and I'm always excited to help others."
                    defaultValue={""}
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Background Image
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="grid grid-cols-4 gap-5">
                    {backgrounds.map((img, index) => (
                      <Badge
                        color="success"
                        badgeContent={<CheckIcon className="h-2 w-2" />}
                        invisible={
                          selectedBackgroundImage !== backgrounds[index]
                        }
                      >
                        <Image
                          src={img}
                          alt={`Background ${index + 1}`}
                          height={128}
                          width={256}
                          className="rounded-lg cursor-pointer"
                          onClick={() =>
                            setSelectedBackgroundImage(backgrounds[index])
                          }
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
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
                      <span className="font-bold text-red-400">-1</span>
                    </span>
                  </>
                )}

                {userLangs.length > 0 &&
                  userLangs.map((userlang, index) => (
                    <div className="grid grid-cols-6 justify-between m-2">
                      <div key={index} className="col-span-1 mr-20">
                        <Tooltip
                          title={userlang}
                          arrow={false}
                          placement="right"
                        >
                          {allIcons[userlang]}
                        </Tooltip>
                      </div>
                      <Slider
                        size="md"
                        color="neutral"
                        valueLabelDisplay="on"
                        min={-1}
                        max={100}
                        step={1}
                        className="col-span-5"
                        defaultValue={0}
                        onChange={(e, v) => handleAddProf(e, v, userlang)}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 mb-7l text-gray-900">
              Skills
            </h2>
            <Select
              className="w-11/12 grow-0"
              mode="tags"
              placeholder="Project Management, Kanban, Cloud Computing..."
              options={labelValues(uniqueArray(inDemandSkills))}
              allowClear
              clearIcon={
                <IoCloseCircleOutline className="text-red-300 hover:text-red-600" />
              }
              onChange={handleSkillChange}
            />
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Links
              </h2>
              <div className="flex flex-row items-center justify-between gap-4">
                <FaDiscord
                  onClick={() => setSocials([...socials, "discord"])}
                  className={`text-violet-500 text-4xl
              ${
                socials.includes("discord")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-violet-700 hover:cursor-pointer"
              }
                `}
                />
                <FaDropbox
                  onClick={() => setSocials([...socials, "dropbox"])}
                  className={`text-blue-500 text-4xl
              ${
                socials.includes("dropbox")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-blue-700 hover:cursor-pointer"
              }
                `}
                />
                <FaFacebook
                  onClick={() => setSocials([...socials, "facebook"])}
                  className={`text-blue-600 text-4xl
              ${
                socials.includes("facebook")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-blue-900 hover:cursor-pointer"
              }
                `}
                />
                <FaGithub
                  onClick={() => setSocials([...socials, "github"])}
                  className={`text-black text-4xl
              ${
                socials.includes("github")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-gray-600 hover:cursor-pointer"
              }
                `}
                />
                <FaInstagram
                  onClick={() => setSocials([...socials, "instagram"])}
                  className={`text-pink-500 text-4xl
              ${
                socials.includes("instagram")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-pink-800 hover:cursor-pointer"
              }
                `}
                />
                <FaLinkedin
                  onClick={() => setSocials([...socials, "linkedin"])}
                  className={`text-blue-500 text-4xl
              ${
                socials.includes("linkedin")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-blue-700 hover:cursor-pointer"
              }
                `}
                />
                <FaMedium
                  onClick={() => setSocials([...socials, "medium"])}
                  className={`text-black text-4xl
              ${
                socials.includes("medium")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-gray-600 hover:cursor-pointer"
              }
                `}
                />
                <FaReddit
                  onClick={() => setSocials([...socials, "reddit"])}
                  className={`text-orange-500 text-4xl
              ${
                socials.includes("reddit")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-orange-600 hover:cursor-pointer"
              }
                `}
                />
                <FaStackOverflow
                  onClick={() => setSocials([...socials, "stackoverflow"])}
                  className={`text-orange-400 text-4xl
              ${
                socials.includes("stackoverflow")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-orange-600 hover:cursor-pointer"
              }
                `}
                />
                <FaTiktok
                  onClick={() => setSocials([...socials, "tiktok"])}
                  className={`text-black text-4xl
              ${
                socials.includes("tiktok")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-gray-600 hover:cursor-pointer"
              }
                `}
                />
                <FaTwitch
                  onClick={() => setSocials([...socials, "twitch"])}
                  className={`text-purple-500 text-4xl
              ${
                socials.includes("twitch")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-purple-700 hover:cursor-pointer"
              }
                `}
                />
                <FaXTwitter
                  onClick={() => setSocials([...socials, "x"])}
                  className={`text-black text-4xl
              ${
                socials.includes("x")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-gray-600 hover:cursor-pointer"
              }
                `}
                />
                <FaYoutube
                  onClick={() => setSocials([...socials, "youtube"])}
                  className={`text-red-500 text-4xl
              ${
                socials.includes("youtube")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-red-700 hover:cursor-pointer"
              }
                `}
                />
                <FaThreads
                  onClick={() => setSocials([...socials, "threads"])}
                  className={`text-black text-4xl
              ${
                socials.includes("threads")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-gray-600 hover:cursor-pointer"
              }
                `}
                />
                <FaLink
                  onClick={() => setSocials([...socials, "personal"])}
                  className={`text-black text-4xl
              ${
                socials.includes("personal")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-gray-600 hover:cursor-pointer"
              }
                `}
                />
              </div>
            </div>
            {userSocials.length > 0 && (
              <div className="w-full mt-5 grid grid-cols-3 justify-between">
                {userSocials.map((icon, index) => icon.node)}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditUser;
