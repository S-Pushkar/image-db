"use client";

import React, { useState } from "react";
import PhotoGrid from "./photo-grid";
import QueryInterface from "./query-interface";

export default function Dashboard() {
  const [queryMode, setQueryMode] = useState(true);

  return (
    <div className="bg-gray-900 text-gray-200 flex">
      <div className="flex-1 flex flex-col">
        <div className="p-6 flex justify-end items-center">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded mx-1">
            Upload Pic
          </button>
          <button
            onClick={() => setQueryMode(!queryMode)}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded mx-1"
          >
            {queryMode ? "Manage Pics" : "Query Pics"}
          </button>
        </div>
        <main className="p-6 flex-1 min-h-screen px-28">
          {queryMode ? <QueryInterface /> : <PhotoGrid />}
        </main>
      </div>
    </div>
  );
}
