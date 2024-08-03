import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="bg-[rgb(25,25,25)] text-white" lang="en">
      <body className={inter.className}>
        <h1 className="font-bold m-4 text-center text-3xl md:text-5xl">Image DB</h1>
        {children}
      </body>
    </html>
  );
}
