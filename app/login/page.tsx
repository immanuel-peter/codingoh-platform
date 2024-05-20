"use client";

import React, { useState } from "react";
import { Divider, Input, message, Form } from "antd";
import { FaCode, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Login = () => {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const verify = searchParams.get("verify");

  const [messageApi, contextHolder] = message.useMessage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  var fieldsCheck = false;

  const handleLogin = async () => {
    if (email.trim() === "" || password === "") {
      console.log("Please fill in all fields");
      messageApi.open({
        type: "error",
        content: "Please fill in all fields",
        duration: 3,
      });
    } else {
      fieldsCheck = true;
    }

    if (fieldsCheck) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (data) {
        console.log(data);
        if (verify) {
          router.push("/users/add");
        } else {
          router.push(`/users/${data.user?.id}`);
        }
      } else {
        console.log(error);
      }
    }
  };

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
    }
    console.log(data.url);
    return data.url;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.log(error);
    }
    console.log(data.url);
    return data.url;
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center items-center min-h-screen bg-gray-300/75">
        <div className="h-fit w-1/4 bg-slate-50 shadow-sm rounded-md">
          <div className="mt-3 flex flex-row justify-between items-center">
            <div className="px-4 py-2 flex flex-row justify-start items-center">
              <FaCode className="text-3xl" />
              <span className="text-2xl text-blue-700 font-bold ml-2">
                CodingOH
              </span>
            </div>
            <h1 className="px-4 py-2 font-semibold text-lg">Login</h1>
          </div>

          <div className="px-4 pt-2 flex flex-col justify-center items-center gap-4">
            <div
              onClick={signInWithGoogle}
              className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-blue-200"
            >
              <FcGoogle size={30} /> Login Using Google &rarr;
            </div>
            <div
              onClick={signInWithGithub}
              className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-gray-400"
            >
              <FaGithub size={30} /> Login Using GitHub &rarr;
            </div>
          </div>

          <Divider>or</Divider>

          <div className="px-4 py-2 flex flex-col">
            <label className="text-blue-500">Email</label>
            <Input
              name="email"
              placeholder="Enter your email"
              className="rounded-md shadow-sm h-8 border-none mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-blue-500">Password</label>
            <Input.Password
              name="password"
              placeholder="Generate a password"
              className="mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-1">
            <button
              onClick={handleLogin}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign Up
            </button>
          </div>

          <Link
            href="/signup"
            className="px-4 py-2 flex justify-center items-center text-violet-500 hover:cursor-pointer hover:underline"
          >
            New user? Sign up here &rarr;
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
