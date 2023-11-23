import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Question - CodingOH",
  description:
    "Add any question you want to CodingOH. A developer will connect with you to resolve your question.",
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
