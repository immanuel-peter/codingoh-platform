import React from "react";
import Image from "next/image";

import { Navbar, Card } from "@/components";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex">
        <div className="basis-3/4 border-r border-gray-900">
          <h1>Home</h1>
        </div>
        <div className="basis-1/4 items-center justify-center">
          <Card />
          <Card />
        </div>
      </div>
    </main>
  );
}
