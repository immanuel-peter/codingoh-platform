"use client";

import React, { useState, useEffect, SyntheticEvent } from "react";
import {
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
  FaYoutube,
  FaXTwitter,
  FaThreads,
  FaUserCheck,
  FaBell,
  FaCheck,
} from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { BsPlusCircleFill } from "react-icons/bs";
import {
  Select,
  Tooltip,
  message,
  notification,
  Badge,
  Avatar,
  Slider,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import Navbar from "@/components/Navbar";
import backgrounds from "@/public/backgrounds";
import { Coder, Proficiency } from "@/types";
import sortedIcons from "@/utils/icons";
import { techSkills as inDemandSkills } from "@/dummy/questions";
import { uniqueArray, labelValues, finalProfsByLangs } from "@/utils";

const timezones: string[] = [
  "UTC",
  "Pacific/Midway",
  "Pacific/Pago_Pago",
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Vancouver",
  "America/Los_Angeles",
  "America/Tijuana",
  "America/Edmonton",
  "America/Denver",
  "America/Phoenix",
  "America/Mazatlan",
  "America/Winnipeg",
  "America/Regina",
  "America/Chicago",
  "America/Mexico_City",
  "America/Guatemala",
  "America/El_Salvador",
  "America/Managua",
  "America/Costa_Rica",
  "America/Montreal",
  "America/New_York",
  "America/Indianapolis",
  "America/Panama",
  "America/Bogota",
  "America/Lima",
  "America/Halifax",
  "America/Puerto_Rico",
  "America/Caracas",
  "America/Santiago",
  "America/St_Johns",
  "America/Montevideo",
  "America/Araguaina",
  "America/Argentina/Buenos_Aires",
  "America/Godthab",
  "America/Sao_Paulo",
  "Atlantic/Azores",
  "Canada/Atlantic",
  "Atlantic/Cape_Verde",
  "Etc/Greenwich",
  "Europe/Belgrade",
  "CET",
  "Atlantic/Reykjavik",
  "Europe/Dublin",
  "Europe/London",
  "Europe/Lisbon",
  "Africa/Casablanca",
  "Africa/Nouakchott",
  "Europe/Oslo",
  "Europe/Copenhagen",
  "Europe/Brussels",
  "Europe/Berlin",
  "Europe/Helsinki",
  "Europe/Amsterdam",
  "Europe/Rome",
  "Europe/Stockholm",
  "Europe/Vienna",
  "Europe/Luxembourg",
  "Europe/Paris",
  "Europe/Zurich",
  "Europe/Madrid",
  "Africa/Bangui",
  "Africa/Algiers",
  "Africa/Tunis",
  "Africa/Harare",
  "Africa/Nairobi",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Budapest",
  "Europe/Sofia",
  "Europe/Istanbul",
  "Europe/Athens",
  "Europe/Bucharest",
  "Asia/Nicosia",
  "Asia/Beirut",
  "Asia/Damascus",
  "Asia/Jerusalem",
  "Asia/Amman",
  "Africa/Tripoli",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Europe/Moscow",
  "Asia/Baghdad",
  "Asia/Kuwait",
  "Asia/Riyadh",
  "Asia/Bahrain",
  "Asia/Qatar",
  "Asia/Aden",
  "Asia/Tehran",
  "Africa/Khartoum",
  "Africa/Djibouti",
  "Africa/Mogadishu",
  "Asia/Dubai",
  "Asia/Muscat",
  "Asia/Baku",
  "Asia/Kabul",
  "Asia/Yekaterinburg",
  "Asia/Tashkent",
  "Asia/Calcutta",
  "Asia/Kathmandu",
  "Asia/Novosibirsk",
  "Asia/Almaty",
  "Asia/Dacca",
  "Asia/Krasnoyarsk",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Saigon",
  "Asia/Jakarta",
  "Asia/Irkutsk",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Taipei",
  "Asia/Kuala_Lumpur",
  "Asia/Singapore",
  "Australia/Perth",
  "Asia/Yakutsk",
  "Asia/Seoul",
  "Asia/Tokyo",
  "Australia/Darwin",
  "Australia/Adelaide",
  "Asia/Vladivostok",
  "Pacific/Port_Moresby",
  "Australia/Brisbane",
  "Australia/Sydney",
  "Australia/Hobart",
  "Asia/Magadan",
  "SST",
  "Pacific/Noumea",
  "Asia/Kamchatka",
  "Pacific/Fiji",
  "Pacific/Auckland",
  "Asia/Kolkata",
  "Europe/Kiev",
  "America/Tegucigalpa",
  "Pacific/Apia",
];

const countryList: string[] = [
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
const genderOptions: string[] = [
  "Male",
  "Female",
  "Non-binary",
  "Prefer not to say",
  "Other",
];

const EditUser = ({ params }: { params: { id: string } }) => {
  const router = useRouter();

  const supabase = createClient();
  const [supabaseUser, setSupabaseUser] = useState<{
    id: string;
    [key: string]: any;
  }>();
  const [coder, setCoder] = useState<Coder>();
  const [coderPic, setCoderPic] = useState<string>("");

  // Personal Info
  const [firstName, setFirstName] = useState<string>(
    coder?.first_name ? coder.first_name : ""
  );
  const [lastName, setLastName] = useState<string>(
    coder?.last_name ? coder.last_name : ""
  );
  const [gender, setGender] = useState<string>(
    coder?.gender ? coder.gender : ""
  );
  const [dob, setDob] = useState<Date | string | undefined>(
    coder?.birthday ? new Date(coder.birthday) : undefined
  );
  const [timezone, setTimezone] = useState<string>(
    coder?.timezone
      ? coder.timezone
      : Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [email, setEmail] = useState<string>(
    coder?.email_address ? coder.email_address : ""
  );
  const [education, setEducation] = useState<string>(
    coder?.education ? coder.education : ""
  );
  const [company, setCompany] = useState<string>(
    coder?.company ? coder.company : ""
  );
  const [position, setPosition] = useState<string>(
    coder?.position ? coder.position : ""
  );
  const [city, setCity] = useState<string>(coder?.city ? coder.city : "");
  const [usState, setUsState] = useState<string>(
    coder?.us_state ? coder.us_state : ""
  );
  const [country, setCountry] = useState<string>(
    coder?.country ? coder.country : ""
  );
  const [newProfileImg, setNewProfileImg] = useState<File | null>(null);
  const [about, setAbout] = useState<string>(coder?.about ? coder.about : "");

  // Background Banner
  const [selectedBackgroundImage, setSelectedBackgroundImage] =
    useState<number>(coder?.background_image ? coder.background_image : 0);

  // Proficient Languages
  const [inputValue, setInputValue] = useState<string>("");
  const [langOptions, setLangOptions] = useState<string[]>(
    Object.keys(sortedIcons)
  );
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [userLangs, setUserLangs] = useState<string[]>(
    coder?.stack ? coder?.stack.map((lang) => lang.language ?? "") : []
  );
  const [newLangs, setNewLangs] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [userProfs, setUserProfs] = useState<Proficiency[]>([]);
  const [newProfs, setNewProfs] = useState<Proficiency[]>([]);
  const [finalProfs, setFinalProfs] = useState<{ [lang: string]: number }>(
    coder?.stack ? finalProfsByLangs(coder?.stack) : {}
  );
  console.log(finalProfs);
  const [newFinalProfs, setNewFinalProfs] = useState<{
    [lang: string]: number;
  }>({});
  const [allProfs, setAllProfs] = useState<{ [lang: string]: number }>({
    ...finalProfs,
    ...newFinalProfs,
  });
  console.log(allProfs);
  const ultimateProfs: Proficiency[] = Object.entries(allProfs).map(
    ([key, value]) => {
      return { language: key, proficiency: value };
    }
  );
  console.log(ultimateProfs);

  // Skills
  const [skills, setSkills] = useState<string[]>([]);

  // Social Links
  const defaultSocialLinks = [
    { social: "discord", link: "" },
    { social: "dropbox", link: "" },
    { social: "facebook", link: "" },
    { social: "github", link: "" },
    { social: "instagram", link: "" },
    { social: "linkedin", link: "" },
    { social: "medium", link: "" },
    { social: "reddit", link: "" },
    { social: "stackoverflow", link: "" },
    { social: "tiktok", link: "" },
    { social: "twitch", link: "" },
    { social: "x", link: "" },
    { social: "youtube", link: "" },
    { social: "threads", link: "" },
    { social: "personal", link: "" },
  ];
  const [socials, setSocials] = useState<string[]>(
    coder?.socials
      ? coder?.socials.map(
          (p) => p.social?.toLowerCase().replace(/\s/g, "") ?? ""
        )
      : []
  );
  const [socialLinks, setSocialLinks] =
    useState<{ social: string; link: string }[]>(defaultSocialLinks);
  const [finalSocialLinks, setFinalSocialLinks] = useState<
    { social: string; link: string }[]
  >([]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) {
        setSupabaseUser(user);
      } else {
        console.error(error);
      }
    };
    const fetchCoder = async () => {
      const { data, error } = await supabase
        .from("coders")
        .select("*")
        .eq("auth_id", params.id)
        .single();
      if (data) {
        setCoder(data);
        data.profile_image
          ? setCoderPic(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/profileImg-${params.id}`
            )
          : setCoderPic("");
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setGender(data.gender);
        setDob(new Date(data.birthday));
        setTimezone(data.timezone);
        setEmail(data.email_address);
        setEducation(data.education);
        setCompany(data.company);
        setPosition(data.position);
        setCity(data.city);
        setUsState(data.us_state);
        setCountry(data.country);
        setAbout(data.about);
        setSelectedBackgroundImage(data.background_image);
        setLangOptions(
          Object.keys(sortedIcons).filter(
            (lang) =>
              !data.stack
                .map((item: { language: string; proficiency: number }) =>
                  item.language.toLowerCase()
                )
                .includes(lang.toLowerCase())
          )
        );
        setUserProfs(data.stack);
        setFinalProfs(finalProfsByLangs(data.stack));
        setAllProfs(finalProfsByLangs(data.stack));
        setSkills(data.skills);

        const updatedSocialLinks = defaultSocialLinks.map((defaultLink) => {
          const fetchedLink = data.socials.find(
            (link: { social: string; link: string }) =>
              link.social === defaultLink.social
          );
          return fetchedLink ? fetchedLink : defaultLink;
        });
        setSocialLinks(updatedSocialLinks);
        setFinalSocialLinks(
          updatedSocialLinks.filter((link) => link.link !== "")
        );
        setSocials(
          data.socials.map((p: { social: string; link: string }) =>
            p.social.toLowerCase().replace(/\s/g, "")
          )
        );
      } else {
        console.error(error);
      }
    };
    fetchUser();
    fetchCoder();
  }, []);

  const formattedDob: string = dob
    ? new Date(dob).toISOString().split("T")[0]
    : "";

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setNewProfileImg(img);
    }
  };

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
    setLangOptions(langOptions.filter((lang) => lang !== option));
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

  const handleAddNewLang = (lang: string) => {
    // setUserLangs([...userLangs, lang]);
    setNewLangs([...newLangs, lang]);
    setInputValue("");
    setFilteredOptions([]);
    setShowOptions(false);
    setSelectedOption("");
  };

  const handleAddProf = (value: number | number[], language: string) => {
    if (typeof value === "number") {
      setUserProfs([
        ...userProfs,
        {
          language: language,
          proficiency: value,
        },
      ]);
    } else {
      setUserProfs([
        ...userProfs,
        {
          language: language,
          proficiency: value[0],
        },
      ]);
    }
    setFinalProfs(finalProfsByLangs(userProfs));
  };

  const handleAddNewProf = (value: number | number[], language: string) => {
    if (typeof value === "number") {
      setNewProfs([
        ...newProfs,
        {
          language: language,
          proficiency: value,
        },
      ]);
    } else {
      setNewProfs([
        ...newProfs,
        {
          language: language,
          proficiency: value[0],
        },
      ]);
    }
    setNewFinalProfs(finalProfsByLangs(newProfs));
    setAllProfs({ ...finalProfs, ...newFinalProfs });
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

  const handleSkillChange = (value: string) => {
    const newSkills = [...skills, value];
    setSkills(newSkills);
  };

  const handleSkillDeselect = (value: string) => {
    const newSkills = skills.filter((skill) => skill !== value);
    setSkills(newSkills);
  };

  const socialIcons = [
    {
      social: "discord",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaDiscord className="text-4xl text-violet-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.discord.com"
              value={socialLinks[0].link}
              onChange={(e) => updateSocialLink("discord", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "dropbox",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaDropbox className="text-4xl text-blue-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.dropbox.com"
              value={socialLinks[1].link}
              onChange={(e) => updateSocialLink("dropbox", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "facebook",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaFacebook className="text-4xl text-blue-600" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.facebook.com"
              value={socialLinks[2].link}
              onChange={(e) => updateSocialLink("facebook", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "github",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaGithub className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.github.com"
              value={socialLinks[3].link}
              onChange={(e) => updateSocialLink("github", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "instagram",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaInstagram className="text-4xl text-pink-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.instagram.com"
              value={socialLinks[4].link}
              onChange={(e) => updateSocialLink("instagram", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "linkedin",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaLinkedin className="text-4xl text-blue-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.linkedin.com"
              value={socialLinks[5].link}
              onChange={(e) => updateSocialLink("linkedin", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "medium",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaMedium className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.medium.com"
              value={socialLinks[6].link}
              onChange={(e) => updateSocialLink("medium", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "reddit",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaReddit className="text-4xl text-orange-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.reddit.com"
              value={socialLinks[7].link}
              onChange={(e) => updateSocialLink("reddit", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "stackoverflow",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaStackOverflow className="text-4xl text-orange-400" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.stackoverflow.com"
              value={socialLinks[8].link}
              onChange={(e) =>
                updateSocialLink("stackoverflow", e.target.value)
              }
            />
          </div>
        </>
      ),
    },
    {
      social: "tiktok",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaTiktok className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.tiktok.com"
              value={socialLinks[9].link}
              onChange={(e) => updateSocialLink("tiktok", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "twitch",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaTwitch className="text-4xl text-purple-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.twitch.com"
              value={socialLinks[10].link}
              onChange={(e) => updateSocialLink("twitch", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "x",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaXTwitter className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.x.com"
              value={socialLinks[11].link}
              onChange={(e) => updateSocialLink("x", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "youtube",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaYoutube className="text-4xl text-red-500" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.youtube.com"
              value={socialLinks[12].link}
              onChange={(e) => updateSocialLink("youtube", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "threads",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaThreads className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.threads.net"
              value={socialLinks[13].link}
              onChange={(e) => updateSocialLink("threads", e.target.value)}
            />
          </div>
        </>
      ),
    },
    {
      social: "personal",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaLink className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="https://www.mywebsite.com"
              value={socialLinks[14].link}
              onChange={(e) => updateSocialLink("personal", e.target.value)}
            />
          </div>
        </>
      ),
    },
  ];

  const userSocials = socialIcons.filter((icon) =>
    socials.includes(icon.social)
  );

  const updateSocialLink = (network: string, updatedLink: string) => {
    const updatedLinks = socialLinks.map((link) => {
      if (link.social === network) {
        return { ...link, link: updatedLink };
      }
      return link;
    });

    setSocialLinks(updatedLinks);
    setFinalSocialLinks(socialLinks.filter((item) => item.link !== ""));
  };

  const possibleData = {
    first_name: firstName,
    last_name: lastName,
    gender: gender ?? "Male",
    birthday: dob,
    timezone: timezone,
    email_address: email,
    education: education,
    company: company,
    position: position,
    city: city,
    us_state: usState,
    country: !country ? "United States of America" : country,
    profile_image: coderPic || newProfileImg ? true : false,
    about: about,
    background_image: selectedBackgroundImage,
    stack: ultimateProfs,
    skills: skills,
    socials: finalSocialLinks,
  };
  console.log(possibleData);
  console.log(newProfileImg);

  // Form Actions
  const [messageApi, contextHolder] = message.useMessage();
  const [api] = notification.useNotification();

  const openSubmitNotification = () => {
    api.success({
      message: "User Profile Updated!",
      description: (
        <span>
          Check out your updated profile{" "}
          <a href={`/users/${params.id}`}>here</a>
        </span>
      ),
      icon: <FaUserCheck className="text-green-600" />,
      placement: "bottomLeft",
    });
  };

  const handleFormSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const userData = {
      first_name: firstName,
      last_name: lastName,
      gender: !gender ? "Male" : gender,
      birthday: dob,
      timezone: timezone,
      email_address: email,
      education: education,
      company: company,
      position: position,
      city: city,
      us_state: usState,
      country: !country ? "United States of America" : country,
      profile_image: coderPic || newProfileImg ? true : false,
      about: about,
      background_image: selectedBackgroundImage,
      stack: ultimateProfs,
      skills: skills,
      socials: finalSocialLinks,
    };

    if (
      userData.first_name.trim() === "" ||
      userData.last_name.trim() === "" ||
      userData.timezone === "" ||
      userData.email_address.trim() === ""
    ) {
      messageApi.open({
        type: "error",
        content: "Please fill in all required fields",
        duration: 3,
      });
      return;
    }

    try {
      // First, upload user data
      const { data: userDataResponse, error: userDataError } = await supabase
        .from("coders")
        .update(userData)
        .eq("auth_id", params.id)
        .select();

      if (userDataError) {
        console.log("Faulty data:", userData);
        console.log("Error uploading user data:", userDataError);
        return;
      }

      console.log("User data uploaded:", userDataResponse);

      // Then, upload the profile image if provided
      if (newProfileImg) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("avatars")
          .upload(`profileImg-${params.id}`, newProfileImg, { upsert: true });

        if (imageError) {
          console.log("Error uploading profile image:", imageError);
          return;
        }

        console.log("Profile image uploaded:", imageData);
      }

      // Redirect to user's profile page if everything is successful
      if (userDataResponse) {
        router.push(`/users/${params.id}`);
        // openSubmitNotification();
      }
    } catch (error) {
      console.log("Error during submission:", error);
    }
  };

  const handleFormCancel = () => {
    setFirstName("");
    setLastName("");
    setGender("");
    setDob("");
    setTimezone("");
    setEmail("");
    setEducation("");
    setCompany("");
    setPosition("");
    setCity("");
    setUsState("");
    setCountry("");
    setNewProfileImg(null);
    setAbout("");
    setSelectedBackgroundImage(0);
    setInputValue("");
    setFilteredOptions([]);
    setShowOptions(false);
    setUserLangs([]);
    setUserProfs([]);
    setFinalProfs({});
    setSkills([]);
    setSocials([]);
  };

  return (
    <>
      {contextHolder}
      <Navbar />

      <div className="flex items-center justify-center">
        <form
          className="mt-5 mb-5 w-full px-4 max-w-7xl"
          onSubmit={handleFormSubmit}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-3 text-gray-900">
                Update User
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
                    {/* <select
                    value={timezone}
                    onChange={handleTzChange}
                    id="timezone"
                    name="gender"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option></option>
                    {options.map((option) => (
                      <option key={option.value}>{option.label}</option>
                    ))}
                  </select> */}
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      id="timezone"
                      name="timezone"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
                    >
                      {timezones.map((timezone, index) => (
                        <option key={index}>{timezone}</option>
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
                    htmlFor="avatar"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Avatar
                  </label>
                  <div className="mt-2 flex flex-row justify-start gap-3 items-center">
                    <Avatar
                      size="large"
                      src={
                        newProfileImg
                          ? URL.createObjectURL(newProfileImg)
                          : coderPic
                            ? coderPic
                            : undefined
                      }
                    >
                      {!coderPic &&
                      !newProfileImg &&
                      firstName !== "" &&
                      lastName !== ""
                        ? `${firstName[0]}${lastName[0]}`
                        : null}
                    </Avatar>
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
                          color="green"
                          count={
                            selectedBackgroundImage == index ? (
                              <FaCheck className="h-4 w-4 text-black p-1 rounded-full border border-solid border-slate-400 bg-green-400" />
                            ) : (
                              0
                            )
                          }
                        >
                          <Image
                            src={img}
                            alt={`Background ${index + 1}`}
                            height={128}
                            width={256}
                            className="rounded-lg cursor-pointer"
                            onClick={() => setSelectedBackgroundImage(index)}
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
                Tech Stack
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
                    onClick={() => handleAddNewLang(inputValue)}
                  />
                </div>

                <div className="flex flex-col ml-20">
                  {Object.keys(finalProfs).length > 0 && (
                    <>
                      <div className="flex flex-row items-center justify-between font-bold">
                        <h3>Language</h3>
                        <h3>Proficiency</h3>
                      </div>
                      <span className="text-sm text-gray-500 text-center mb-7">
                        If you want to delete a language, rate your skill level
                        as <span className="font-bold text-red-400">-1</span>
                      </span>
                    </>
                  )}

                  {Object.keys(finalProfs).length > 0 &&
                    Object.keys(finalProfs).map((userlang, index) => (
                      <div className="grid grid-cols-6 justify-between m-2">
                        <div key={index} className="col-span-1 mr-20">
                          <Tooltip
                            title={userlang}
                            arrow={false}
                            placement="right"
                          >
                            {sortedIcons[userlang]}
                          </Tooltip>
                        </div>
                        <Slider
                          min={-1}
                          max={100}
                          step={1}
                          className="col-span-5"
                          defaultValue={0}
                          value={finalProfs[userlang]}
                          onChange={(v) => handleAddProf(v, userlang)}
                        />
                      </div>
                    ))}

                  {newLangs.length > 0 &&
                    newLangs.map((userlang, index) => (
                      <div className="grid grid-cols-6 justify-between m-2">
                        <div key={index} className="col-span-1 mr-20">
                          <Tooltip
                            title={userlang}
                            arrow={false}
                            placement="right"
                          >
                            {sortedIcons[userlang]}
                          </Tooltip>
                        </div>
                        <Slider
                          min={-1}
                          max={100}
                          step={1}
                          className="col-span-5"
                          defaultValue={0}
                          onChange={(v) => handleAddNewProf(v, userlang)}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-between border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 mb-7 text-gray-900">
                Skills
              </h2>
              <Select
                className="w-11/12 grow-0"
                mode="tags"
                placeholder="Project Management, Kanban, Cloud Computing..."
                options={labelValues(uniqueArray(inDemandSkills))}
                allowClear
                value={skills}
                onDeselect={handleSkillDeselect}
                onSelect={handleSkillChange}
              />
            </div>

            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Links
                  </h2>
                  {socials && (
                    <span className="flex flex-row gap-1 items-center text-xs">
                      <FaBell className="text-green-500" size={10} />{" "}
                      Recommended to add '/' at the end of each link
                    </span>
                  )}
                </div>
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
                onClick={handleFormCancel}
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
      </div>
    </>
  );
};

export default EditUser;
