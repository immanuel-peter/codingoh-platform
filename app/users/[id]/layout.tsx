import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // read route params
  const supabase = createClient();

  const { data: dev, error } = await supabase
    .from("coders")
    .select("first_name, last_name")
    .eq("auth_id", params.id)
    .single();

  if (dev) {
    return {
      title: `${dev?.first_name} ${dev?.last_name} | CodingOH`,
    };
  } else {
    return {
      title: "User | CodingOH",
    };
  }
}

export default async function PageLayout({
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
