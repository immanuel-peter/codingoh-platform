"use client";

import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { Autocomplete } from "@mui/joy";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

import { Navbar, Card, FAB } from "@/components";
import { Coder } from "@/types";
import sortedIcons from "@/utils/icons";

// const langOptions = Object.keys(sortedIcons).map((key) => ({ value: key }));

const allUsers = () => {
  const supabase = createClient();
  const [coders, setCoders] = useState<Coder[]>();

  useEffect(() => {
    const fetchCoders = async () => {
      const { data: coders, error } = await supabase
        .from("coders")
        .select("id, first_name, last_name, about, position, stack, auth_id");
      if (coders) {
        setCoders(coders);
        setDisplayedUsers(coders);
      } else {
        console.error(error);
      }
    };
    fetchCoders();
  }, []);

  const [displayedUsers, setDisplayedUsers] = useState(coders);
  const [userQuery, setUserQuery] = useState<string>("");
  const [langQuery, setLangQuery] = useState<string>("");

  const handleUserQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "") {
      setDisplayedUsers(coders);
    }

    setUserQuery(value);

    const filteredCoders = coders?.filter((coder) => {
      const updatedCoder = {
        ...coder,
        full_name: `${coder.first_name} ${coder.last_name}`,
      };
      return (
        updatedCoder.full_name.toLowerCase().includes(value.toLowerCase()) ||
        updatedCoder.about?.toLowerCase().includes(value.toLowerCase()) ||
        updatedCoder.position?.toLowerCase().includes(value.toLowerCase())
      );
    });

    // const filteredUsers = users.filter((user) =>
    //   user.name.toLowerCase().includes(value.toLowerCase())
    // );
    setDisplayedUsers(filteredCoders);
  };

  const handleLangQueryChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    const matchingLanguages = Object.keys(sortedIcons).filter((language) =>
      language.toLowerCase().includes(value.toLowerCase())
    );

    if (value === "") {
      setDisplayedUsers(coders);
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

    const filteredCoders = coders?.filter((coder) =>
      coder.stack?.some((lang) =>
        lang.language?.toLowerCase().includes(langQuery.toLowerCase())
      )
    );

    // const filteredUsers = users.filter(
    //   (user) =>
    //     user.codingLanguages?.some((lang) =>
    //       lang.language.toLowerCase().includes(langQuery.toLowerCase())
    //     )
    // );
    setDisplayedUsers(filteredCoders);
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
          options={Object.keys(sortedIcons)}
          sx={{ width: 300 }}
        />
      </div>
      <div
        className={`${
          displayedUsers?.length ?? 0 > 0
            ? "p-2 m-2 grid grid-cols-4 gap-4"
            : "flex flex-col gap-2 items-center justify-center h-[85vh]"
        }`}
      >
        {displayedUsers?.length ?? 0 > 0 ? (
          displayedUsers?.map((coder, index) => (
            <Link href={`/users/${coder.auth_id}`}>
              <Card
                id={coder.id ?? 0}
                key={index}
                name={`${coder.first_name} ${coder.last_name}`}
                position={coder.position || "Undefined"}
                isOnline={Math.random() > 0.5}
                languages={coder.stack || []}
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
      <FAB />
    </>
  );
};

export default allUsers;

// users.some((user) =>
//   user.codingLanguages.some(
//     (lang) => lang.language.toLowerCase() === value.toLowerCase()
//   )
// )
