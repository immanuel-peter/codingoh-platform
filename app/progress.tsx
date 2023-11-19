"use client";
import React from "react";
import { Next13ProgressBar } from "next13-progressbar";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Next13ProgressBar
        color="#3b82f6"
        options={{ showSpinner: false }}
        showOnShallow
      />
    </>
  );
};

export default Providers;
