"use client";

import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";
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
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";

const SocialLinks = () => {
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
    { name: "twitter", link: "" },
    { name: "youtube", link: "" },
    { name: "personal", link: "" },
  ]);

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
      name: "twitter",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaTwitter className="text-4xl text-blue-400" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.twitter.com"
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
      name: "personal",
      node: (
        <>
          <div className="flex flex-row items-center gap-4 mt-3">
            <FaLink className="text-4xl text-black" />
            <input
              className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 placeholder:text-gray-400 placeholder:italic shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
              placeholder="www.mywebsite.com"
              value={socialLinks[13].link}
              onChange={(e) =>
                updateSocialLink(socialLinks[13].name, e.target.value)
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
  };

  return (
    <>
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
          <FaTwitter
            onClick={() => setSocials([...socials, "twitter"])}
            className={`text-blue-400 text-4xl
              ${
                socials.includes("twitter")
                  ? "text-opacity-20 cursor-text"
                  : "hover:text-blue-600 hover:cursor-pointer"
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
    </>
  );
};

export default SocialLinks;
