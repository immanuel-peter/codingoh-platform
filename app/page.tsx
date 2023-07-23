import React from "react";
import Image from "next/image";

import { Navbar } from "@/components";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex-">
        <h1>Home</h1>
      </div>
    </main>
  );
}
