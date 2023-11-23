import { Metadata } from "next";

import { users } from "@/dummy/questions";
import { User } from "@/types";

const getUser = (userId: string): User | undefined => {
  return users.find((user) => user.id === Number(userId));
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const user = getUser(params.id);

  return {
    title: `${user?.name} | CodingOH`,
  };
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
