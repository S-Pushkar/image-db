"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut } from "lucide-react";

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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              Tag<span className="text-blue-800">My</span>Pic
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {isSignedIn ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link href="/sign-in" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
