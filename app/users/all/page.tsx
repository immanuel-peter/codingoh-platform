"use client";

import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { Autocomplete } from "@mui/joy";
import Link from "next/link";

import { Navbar, Card } from "@/components";
import { users } from "@/dummy/questions";
import { allIcons } from "@/utils/icons";
import { User } from "@/types";

// const langOptions = Object.keys(allIcons).map((key) => ({ value: key }));

const allUsers = () => {
  const [displayedUsers, setDisplayedUsers] = useState<User[]>(users);
  const [userQuery, setUserQuery] = useState("");
  const [langQuery, setLangQuery] = useState("");

  const handleUserQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      setDisplayedUsers(users);
    }

    setUserQuery(value);

    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDisplayedUsers(filteredUsers);
  };

  const handleLangQueryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    const matchingLanguages = Object.keys(allIcons).filter((language) =>
      language.toLowerCase().includes(value.toLowerCase())
    );

    if (value === "") {
      setDisplayedUsers(users);
    }

    // const langQueryValue =
    //   matchingLanguages.length > 0 ? matchingLanguages[0] : value;
    setLangQuery(value);

    // if (
    //   users.some((user) =>
    //     user.codingLanguages.some(
    //       (lang) => lang.language.toLowerCase() === value.toLowerCase()
    //     )
    //   )
    // ) {
    //   setLangQuery(value);
    // }

    const filteredUsers = users.filter((user) =>
      user.codingLanguages.some((lang) =>
        lang.language.toLowerCase().includes(langQuery.toLowerCase())
      )
    );
    setDisplayedUsers(filteredUsers);
  };

  return (
    <>
      <Navbar />
      <div className="p-2 m-2 flex flex-row items-center justify-between">
        <Input
          value={userQuery}
          onChange={handleUserQueryChange}
          size="large"
          placeholder="Find a specific user..."
          prefix={<UserOutlined />}
          className="max-w-4xl basis-3/5"
        />
        <Autocomplete
          value={langQuery}
          onInputChange={handleLangQueryChange}
          freeSolo
          placeholder="Ex: Python"
          options={Object.keys(allIcons)}
          sx={{ width: 300 }}
        />
      </div>
      <div
        className={`${
          displayedUsers.length > 0
            ? "p-2 m-2 grid grid-cols-4 gap-4"
            : "flex flex-col gap-2 items-center justify-center h-[85vh]"
        }`}
      >
        {displayedUsers.length > 0 ? (
          displayedUsers.map((user, index) => (
            <Link href={`/users/${user.id}`}>
              <Card
                key={index}
                name={user.name}
                position={user.position}
                isOnline={user.isOnline}
                languages={user.codingLanguages}
              />
            </Link>
          ))
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold">No users found</h1>
            <p className="text-center text-slate-500">Try again</p>
          </>
        )}
      </div>
    </>
  );
};

export default allUsers;

// users.some((user) =>
//   user.codingLanguages.some(
//     (lang) => lang.language.toLowerCase() === value.toLowerCase()
//   )
// )
