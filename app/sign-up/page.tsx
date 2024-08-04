"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function SignUp() {
  const { data: session } = useSession();
  const Router = useRouter();
  if (session) {
    Router.push("/");
  }
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Add your form submission logic here
    // Example: send data to an API endpoint
    const data = { name, email, password, confirmPassword };
    // You can use fetch or axios to send the data to your API
  };

  return (
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-black rounded-3xl p-4 flex flex-col items-center">
        <h1 className="font-semibold text-xl">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-8 p-8 w-full items-center"
        >
          <label className="md:w-1/2 grid grid-rows-2">
            <div>Name</div>
            <input
              className="rounded w-full p-1 text-black"
              type="text"
              name="name"
              placeholder="John Doe"
              autoFocus
              autoComplete="email"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="md:w-1/2 grid grid-rows-2">
            <div>Email</div>
            <input
              className="rounded w-full p-1 text-black"
              type="email"
              name="email"
              placeholder="abc@def.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailTaken && (
              <p className="text-red-500">Account already exists</p>
            )}
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
          <label className="md:w-1/2 grid grid-rows-2">
            <div>Confirm Password</div>
            <input
              className="rounded w-full p-1 text-black"
              type="password"
              name="password"
              placeholder="****"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordNotMatch && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </label>
          <button
            type="submit"
            className="rounded-lg border-2 border-white px-4 md:px-6 py-2 hover:bg-white hover:text-black active:bg-black active:text-white"
          >
            Sign Up
          </button>
        </form>
        <p>Or Sign Up With</p>
        <button
          className="rounded-full m-4"
          onClick={() =>
            signIn("google", { callbackUrl: "http://localhost:3000" })
          }
        >
          <Image src="/assets/google.svg" width={50} height={50} alt="Google" />
        </button>
      </div>
      <p className="mb-8">
        <span className="">Already have an account? &nbsp;</span>
        <Link className="text-blue-400" href="/sign-in">
          Sign In
        </Link>
      </p>
    </div>
  );
}
