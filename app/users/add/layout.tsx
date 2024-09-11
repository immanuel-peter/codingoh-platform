import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "New User - CodingOH",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Make sure user is logged in
  if (!user) {
    // Redirect to login or an appropriate page if the user is not authenticated
    redirect("/login");
  }

  const { data: coder } = await supabase
    .from("coders")
    .select("id")
    .eq("auth_id", user.id)
    .single(); // Use .single() to fetch a single record or null

  // Redirect if there was an error or coder exists
  if (coder) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
