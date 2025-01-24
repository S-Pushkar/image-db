"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const {
    session,
    isSignedIn,
    setIsSignedIn,
    emailGlobal,
    setEmailGlobal,
    nameGlobal,
    setNameGlobal,
  } = useAuth();
  const [token, setToken] = useState("");

  function handleSignOut() {
    if (session) {
      signOut({ redirect: false });
    } else {
      deleteCookie("token");
      deleteCookie("userName");
      deleteCookie("userEmail");
      setToken("");
      setEmailGlobal("");
      setNameGlobal("");
    }
    setIsSignedIn(false);
  }
  return (
    <nav className="bg-gray-800 p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <p className="text-2xl font-bold text-teal-400">TagMyPic</p>
        </Link>
        <div className="space-x-4">
          {isSignedIn ? (
            <Link href="/dashboard">
              <p className="text-lg active:text-teal-500 text-teal-400">
                Dashboard
              </p>
            </Link>
          ) : (
            <Link href="/sign-in">
              <p className="text-lg active:text-teal-500 text-teal-400">
                Sign In
              </p>
            </Link>
          )}
          {isSignedIn ? (
            <button
              className="text-lg active:text-teal-500 text-teal-400"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
}
