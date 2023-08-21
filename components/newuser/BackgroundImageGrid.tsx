"use client";

import React, { useState } from "react";
import { Badge } from "@mui/joy";
import CheckIcon from "@mui/icons-material/Check";
import Image from "next/image";

import backgrounds from "@/public/backgrounds";

const BackgroundImageGrid = () => {
  const [selectedImage, setSelectedImage] = useState(backgrounds[0]);

  return (
    <div className="grid grid-cols-4 gap-5">
      {backgrounds.map((img, index) => (
        <Badge
          color="success"
          badgeContent={<CheckIcon className="h-2 w-2" />}
          invisible={selectedImage !== backgrounds[index]}
        >
          <Image
            src={img}
            alt={`Background ${index + 1}`}
            height={128}
            width={256}
            className="rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(backgrounds[index])}
          />
        </Badge>
      ))}
    </div>
  );
};

export default BackgroundImageGrid;
