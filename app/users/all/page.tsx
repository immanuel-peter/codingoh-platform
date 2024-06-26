"use client";

import React, { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

import { Navbar, Card, FAB } from "@/components";
import { Coder } from "@/types";
import sortedIcons from "@/utils/icons";

const langOptions = Object.keys(sortedIcons).map((key) => ({
  label: key,
  value: key,
}));

const allUsers = () => {
  const supabase = createClient();
  const [coders, setCoders] = useState<Coder[]>();
  const [displayedUsers, setDisplayedUsers] = useState(coders);
  const [userQuery, setUserQuery] = useState<string>("");
  const [langQuery, setLangQuery] = useState<string>("");

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

    setDisplayedUsers(filteredCoders);
  };

  const handleLangQueryChange = (data: string) => {
    if (data === "") {
      setDisplayedUsers(coders);
    }

    setLangQuery(data);

    const filteredCoders = coders?.filter((coder) =>
      coder.stack?.some((lang) =>
        lang.language?.toLowerCase().includes(langQuery.toLowerCase())
      )
    );

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
        <Select
          showSearch
          value={langQuery}
          style={{ width: 300 }}
          options={langOptions}
          optionFilterProp="label"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Ex: Python"
          onSearch={handleLangQueryChange}
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
