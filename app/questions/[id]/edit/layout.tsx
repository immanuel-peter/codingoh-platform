import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Project - CodingOH",
};

export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const { data: question, error: projectError } = await supabase
    .from("questions")
    .select("*")
    .eq("id", params.id)
    .single();
  const { data: coder, error: coderError } = await supabase
    .from("coders")
    .select("*")
    .eq("id", question.asker)
    .single();

  if (userError || !user) {
    redirect("/login");
  }

  if (projectError || !question || coder.auth_id != user.id) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
