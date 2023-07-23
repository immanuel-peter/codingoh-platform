import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "@next/font/google";

const dmsans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "Coding OH",
  description: "Coding Office Hours: Stack Overflow in real time",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmsans.className}>{children}</body>
    </html>
  );
}
