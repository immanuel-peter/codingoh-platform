import React from "react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <>
      <div className="flex items-center justify-center bg-inherit text-inherit">
        <SignIn />
      </div>
    </>
  );
};

export default SignInPage;
