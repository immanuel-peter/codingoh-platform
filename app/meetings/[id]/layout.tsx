import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Coder Meeting on CodingOH",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user },
    error: e,
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("schedulings")
    .select(
      `...scheduler_id (scheduler_auth: auth_id), ...receiver_id (receiver_auth: auth_id), is_done`
    )
    .eq("meeting_id", params.id)
    .single();

  if (e || error || !data || data.is_done) {
    console.log(data, error);
    redirect("/");
  }

  if (user?.id !== data?.receiver_auth && user?.id !== data?.scheduler_auth) {
    console.log(data, error);
    redirect("/");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
