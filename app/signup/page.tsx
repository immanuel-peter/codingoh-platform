"use client";

import React from "react";
import { Divider, Input } from "antd";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FaCode, FaGithub } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

const SignUp = () => {
  return (
    <>
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

          <div className="px-4 pt-2 flex flex-col justify-center items-center gap-4">
            <div className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-blue-200">
              <FcGoogle size={30} /> Sign Up Using Google &rarr;
            </div>
            <div className="px-4 py-2 flex flex-row justify-center items-center gap-2 border border-solid border-black rounded-md hover:cursor-pointer hover:bg-gray-400">
              <FaGithub size={30} /> Sign Up Using GitHub &rarr;
            </div>
          </div>

          <Divider>or</Divider>

          <div className="px-4 py-2 flex flex-col">
            <label className="text-blue-500">Name</label>
            <Input
              placeholder="Enter your name"
              className="rounded-md shadow-sm h-8 border border-solid border-slate-300 mb-3"
            />
            <label className="text-blue-500">Email</label>
            <Input
              placeholder="Enter your email"
              className="rounded-md shadow-sm h-8 border border-solid border-slate-300 mb-3"
            />
            <label className="text-blue-500">Password</label>
            <Input.Password
              placeholder="Generate a password"
              className="mb-3"
            />
            <label className="text-blue-500">Confirm Password</label>
            <Input.Password placeholder="Confirm new password" />
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
