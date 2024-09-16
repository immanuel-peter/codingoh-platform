import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createClient();

  const { data: question, error } = await supabase
    .from("questions")
    .select("question, description")
    .eq("id", params.id)
    .single();

  if (error || !question) {
    return {
      title: "Question not found",
      description: "The question you are looking for does not exist.",
    };
  }

  return {
    title: question?.question,
    description: question?.description,
  };
}

export default async function PageLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const supabase = createClient();

  // Fetch question data here for page layout logic
  const { data: question, error } = await supabase
    .from("questions")
    .select("id")
    .eq("id", params.id)
    .single();

  // Redirect to not-found page if no question is found
  if (error || !question) {
    notFound();
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
