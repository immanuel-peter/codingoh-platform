"use client";

import React, { useState } from "react";
import { Divider, Input, message } from "antd";
import { FaCode, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const SignUp = () => {
  const supabase = createClient();
  const [messageApi, contextHolder] = message.useMessage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    let valid = true;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      message.error("Please fill in all fields");
      valid = false;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      message.error("Please enter a valid email address", 3);
      valid = false;
    }

    if (password !== confirmPassword) {
      message.error("Passwords do not match", 3);
      valid = false;
    }

    if (valid) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verify=true`,
        },
      });

      if (data) {
        message.success("Check your email to login to your new account.", 3);
      } else {
        message.error(error?.message, 3);
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
            <h1 className="px-4 py-2 font-semibold text-lg">Sign Up</h1>
          </div>

          {/* <div className="px-4 pt-2 flex flex-col justify-center items-center gap-4">
            <div
              onClick={signInWithGoogle}
              className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-blue-200"
            >
              <FcGoogle size={30} /> Sign Up Using Google &rarr;
            </div>
            <div
              onClick={signInWithGithub}
              className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-gray-400"
            >
              <FaGithub size={30} /> Sign Up Using GitHub &rarr;
            </div>
          </div>

          <Divider>or</Divider> */}

          <div className="px-4 py-2 flex flex-col">
            <label className="text-blue-500">Name</label>
            <Input
              placeholder="Enter your name"
              className="rounded-md shadow-sm h-8 border border-solid border-slate-300 mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="text-blue-500">Email</label>
            <Input
              placeholder="Enter your email"
              className="rounded-md shadow-sm h-8 border border-solid border-slate-300 mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-blue-500">Password</label>
            <Input.Password
              placeholder="Generate a password"
              className="mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="text-blue-500">Confirm Password</label>
            <Input.Password
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center mt-1">
            <button
              onClick={handleSignUp}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign Up
            </button>
          </div>

          <Link
            href="/login"
            className="px-4 py-2 flex justify-center items-center text-violet-500 hover:cursor-pointer hover:underline"
          >
            Already a user? Login here &rarr;
          </Link>
        </div>
      </div>
    </>
  );
};

export default SignUp;
