import { Metadata } from "next";

import { projects } from "@/dummy/questions";
import { Project } from "@/types";

const getProject = (projectId: string): Project | undefined => {
  return projects.find((project) => project.id === Number(projectId));
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const project = getProject(params.id);

  return {
    title: "Edit Project | CodingOH",
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
