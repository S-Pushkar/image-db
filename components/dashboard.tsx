"use client";

import React, { useState } from "react";
import PhotoGrid from "./photo-grid";
import QueryInterface from "./query-interface";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { session, isSignedIn, setIsSignedIn, emailGlobal, setEmailGlobal, nameGlobal, setNameGlobal } = useAuth();

  if (!isSignedIn) {
    return <div className="bg-gray-900 text-gray-200 flex flex-col items-center justify-center min-h-screen">
      <h1 className="md:text-4xl text-xl font-bold">You are not signed in!</h1>
      <p className="md:text-lg">Please sign in to view this page.</p>
    </div>;
  }

  const [queryMode, setQueryMode] = useState(true);

  return (
    <div className="bg-gray-900 text-gray-200 flex">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex justify-center items-center">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded mx-1 md:w-32">
            Upload
          </button>
          <button
            onClick={() => setQueryMode(!queryMode)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded mx-1 md:w-32"
          >
            {queryMode ? "Manage" : "Query"}
          </button>
        </div>
        <main className="md:p-6 sm:p-2 flex-1 min-h-screen md:px-28">
          {queryMode ? <QueryInterface /> : <PhotoGrid />}
        </main>
      </div>
    </div>
  );
}
