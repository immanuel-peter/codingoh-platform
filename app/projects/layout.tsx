import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - CodingOH",
  description: "Find developer projects to be inspired by and collaborate on.",
};

export default function RootLayout({
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
