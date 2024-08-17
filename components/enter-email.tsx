"use client";

import React, { useState } from "react";

export default function EnterEmailComponent() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your code here
  };
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  return (
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-black rounded-3xl p-4 flex flex-col items-center">
        <h1 className="font-semibold text-xl">Enter your email</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-8 p-8 w-full items-center"
        >
          <label className="md:w-1/2 grid grid-rows-2">
            <div>Email</div>
            <input
              className="rounded w-full p-1 text-black"
              type="email"
              name="email"
              placeholder="abc@def.com"
              autoFocus
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailNotFound && <p className="text-red-500">Email not found</p>}
            {invalidEmail && <p className="text-red-500">Invalid email</p>}
          </label>
          <button
            type="submit"
            className="rounded-lg border-2 border-white px-4 md:px-6 py-2 hover:bg-white hover:text-black active:bg-black active:text-white"
            onClick={(e) => {
              setInvalidEmail(false);
              setEmailNotFound(false);
            }}
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}
