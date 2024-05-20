import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const supabase = createClient();

  const { data: user, error } = await supabase
    .from("coders")
    .select("first_name, last_name")
    .eq("auth_id", params.id)
    .single();

  if (user) {
    return {
      title: `${user?.first_name} ${user?.last_name} | CodingOH`,
    };
  } else {
    return {
      title: "User | CodingOH",
    };
  }
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
