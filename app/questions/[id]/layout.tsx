import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const supabase = createClient();

  const { data: question, error } = await supabase
    .from("questions")
    .select("*")
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
