import React from "react";

import { users, questions } from "@/dummy/questions";
import { User } from "@/types";
import { stringifyList } from "@/utils";
import { Navbar, Card } from "@/components";

const getUser = (userId: string): User | undefined => {
  return users.find((user) => user.id === Number(userId));
};

const UserPage = ({ params }: { params: { id: string } }) => {
  const user = getUser(params.id);

  if (!user) return false;

  return (
    <>
      <Navbar />
      <main className="p-3 m-0">
        <div className="flex justify-start ml-2">
          <Card
            name={user.name}
            position={user.position}
            languages={user.codingLanguages}
            isOnline={user.isOnline}
          />
        </div>
        {}
      </main>
    </>
  );
};

export default UserPage;

/*
{user ? (
        <div>
          <h1>ID: {user.id}</h1>
          <h1>Name: {user.name}</h1>
          <h1>About: {user.about}</h1>
          <h1>Languages: {stringifyList(user.codingLanguages)}</h1>
          <h1>Email: {user.email}</h1>
          <h1>Files: {stringifyList(user.fileAttachments)}</h1>
          <h1>Online: {user.isOnline ? "True" : "False"}</h1>
          <h1>Position: {user.position}</h1>
        </div>
      ) : (
        <h1>User Does Not Exist</h1>
      )}
*/
