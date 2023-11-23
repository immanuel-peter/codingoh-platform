import { Metadata } from "next";

import { questions } from "@/dummy/questions";
import { Question } from "@/types";

const getQuestion = (userId: string): Question | undefined => {
  return questions.find((question) => question.id === Number(userId));
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const question = getQuestion(params.id);

  return {
    title: question?.question,
    description: question?.description,
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
