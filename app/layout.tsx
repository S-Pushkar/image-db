import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/session-wrapper";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Image DB",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="bg-[rgb(25,25,25)] text-white" lang="en">
      <body className={inter.className}>
        <Navbar />
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
