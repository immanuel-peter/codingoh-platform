import React from "react";
import { FaShapes } from "react-icons/fa6";

import Navbar from "@/components/Navbar";
import Codebot from "@/components/Codebot";
import { allIcons } from "@/utils/icons";

const CodeBot = () => {
  return (
    <>
      <Navbar />
      <Codebot />
    </>
  );
};

export default CodeBot;
