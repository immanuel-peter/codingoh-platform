import React from "react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-inherit text-inherit">
        <SignUp />
      </div>
    </>
  );
};

export default SignUpPage;
