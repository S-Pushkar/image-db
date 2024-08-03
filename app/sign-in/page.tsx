"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
    // Example: send data to an API endpoint
    const data = { email, password };
    // You can use fetch or axios to send the data to your API
  };

  return (
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-black rounded-2xl p-4 flex flex-col items-center">
        <h1 className="font-semibold text-xl">Sign In</h1>
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
          </label>
          <label className="md:w-1/2 grid grid-rows-2">
            <div>Password</div>
            <input
              className="rounded w-full p-1 text-black"
              type="password"
              name="password"
              placeholder="****"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="rounded-lg border-2 border-white px-4 md:px-6 py-2 hover:bg-white hover:text-black active:bg-black active:text-white"
          >
            Sign In
          </button>
        </form>
        <p>Or Sign In With</p>
        <button className="rounded-full m-4">
          <Image src="/assets/google.svg" width={50} height={50} alt="Google" />
        </button>
      </div>
      <p>
        <span className="text-red-400">Don't have an account? &nbsp;</span>
        <Link className="text-blue-400" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
