"use client";

import React, { useState } from "react";
import { Divider, Input, message, Alert } from "antd";
import { FaCode, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const SignUp = () => {
  const supabase = createClient();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  var fieldsCheck = false;
  var emailCheck = false;
  var passwordCheck = false;

  const handleSignUp = async () => {
    if (email.trim() === "" || password === "" || confirmPassword === "") {
      console.log("Please fill in all fields");
      messageApi.open({
        type: "error",
        content: "Please fill in all fields",
        duration: 3,
      });
    } else {
      fieldsCheck = true;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      console.log("Please enter a valid email address");
      messageApi.open({
        type: "error",
        content: "Please enter a valid email address",
        duration: 3,
      });
    } else {
      emailCheck = true;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      messageApi.open({
        type: "error",
        content: "Passwords do not match",
        duration: 3,
      });
    } else {
      passwordCheck = true;
    }

    if (fieldsCheck && emailCheck && passwordCheck) {
      const { data, error } = await supabase.auth.updateUser({
        email,
        password,
      });
      if (data) {
        console.log(data);

        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email: email,
            password: password,
          });

        if (authData) {
          messageApi.open({
            type: "success",
            content: (
              <span>
                Go to your profile{" "}
                <a
                  href={`/users/${authData.user?.id}`}
                  className="text-blue-500 hover:underline"
                >
                  here
                </a>
              </span>
            ),
            duration: 3,
          });
          router.push(`/users/${authData.user?.id}`);
        } else {
          console.log(authError);
          messageApi.open({
            type: "error",
            content: authError?.message,
            duration: 3,
          });
        }
      } else {
        console.log(error);
      }
    }
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
            <div className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-blue-200">
              <FcGoogle size={30} /> Sign Up Using Google &rarr;
            </div>
            <div className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-gray-400">
              <FaGithub size={30} /> Sign Up Using GitHub &rarr;
            </div>
          </div>

          <Divider>or</Divider> */}

          <div className="px-4 py-2 flex flex-col">
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

          <div className="flex justify-center mt-1 mb-2">
            <button
              onClick={handleSignUp}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Confirm Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
