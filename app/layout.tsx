import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Progress from "./progress";
import { useUserPresence } from "@/hooks/useUserPresence";
import { UserPresence } from "@/components/UserPresence";

const dmsans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"] });

export const metadata: Metadata = {
  title: "CodingOH",
  description: "Coding Office Hours: Stack Overflow in real time",
};

// https://www.google.com/s2/favicons?sz=256&domain_url={}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={dmsans.className}>
        <UserPresence />
        <Progress>{children}</Progress>
      </body>
    </html>
  );
}
