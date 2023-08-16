"use client";

import React, { useState } from "react";
import Image from "next/image";

const AddUserProfileImageInput = ({
  currUserImgUrl,
}: {
  currUserImgUrl: string | undefined;
}) => {
  const [image, setImage] = useState("");

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(URL.createObjectURL(img));
    }
  };

  return (
    <>
      <Image
        src={image === "" ? `${currUserImgUrl}` : image}
        width={64}
        height={64}
        alt="User Profile Picture"
        className="rounded-full"
      />
      <label
        htmlFor="img-upload"
        className="inline-block rounded-md text-sm font-semibold text-gray-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 ring-1 ring-inset ring-slate-300 shadow-sm cursor-pointer"
      >
        Change
      </label>
      <input
        type="file"
        id="img-upload"
        name="profileImage"
        onChange={onImageChange}
        className="hidden"
      />
    </>
  );
};

export default AddUserProfileImageInput;

// rounded-md bg-white hover:bg-gray-50 px-2.5 py-1.5 ring-1 ring-inset ring-gray-300 shadow-sm border-0
// className="hidden w-fit text-sm font-semibold text-gray-900"
