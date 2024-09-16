import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Question - CodingOH",
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

  if (userError || !user) {
    redirect("/login");
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("asker")
    .eq("id", params.id)
    .single();
  const { data: coder, error: coderError } = await supabase
    .from("coders")
    .select("auth_id")
    .eq("id", question?.asker)
    .single();

  if (questionError || !question || coder?.auth_id != user.id) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
