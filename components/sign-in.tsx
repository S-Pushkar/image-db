"use client";

import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next";

export default function SignInComponent() {
  const { data: session } = useSession();
  const Router = useRouter();
  useEffect(() => {
    if (session || getCookie("token")) {
      Router.push("/");
    }
  }, [session, Router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [passwordIncorrect, setPasswordIncorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailNotFound(false);
    setInvalidEmail(false);
    setPasswordIncorrect(false);
    const data = { email, password };
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_SPRING_API_URL + "/auth/sign-in",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    setLoading(false);
    if (response.ok) {
      const token = responseData.token;
      const userName = responseData.userName;
      const userEmail = responseData.userEmail;
      setCookie("token", token, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      setCookie("userName", userName, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      setCookie("userEmail", userEmail, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      Router.push("/");
    } else if (responseData.message === "User not found") {
      setEmailNotFound(true);
      setEmail("");
      setPassword("");
    } else if (responseData.message === "Invalid email") {
      setInvalidEmail(true);
      setEmail("");
      setPassword("");
    } else {
      setPasswordIncorrect(true);
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-black rounded-3xl p-4 flex flex-col items-center">
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
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailNotFound && <p className="text-red-500">Email not found</p>}
            {invalidEmail && <p className="text-red-500">Invalid email</p>}
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
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordIncorrect && (
              <p className="text-red-500">Incorrect password</p>
            )}
            <Link className="text-blue-400 text-right" href="/enter-email">
              Forgot Password?
            </Link>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:bg-blue-500"
            onClick={(e) => {
              setInvalidEmail(false);
              setEmailNotFound(false);
              setPasswordIncorrect(false);
            }}
          >
            Sign In
          </button>
        </form>
        <p>Or Sign In With</p>
        <button
          className="rounded-full m-4"
          onClick={() =>
            signIn("google", { callbackUrl: "http://localhost:3000" })
          }
        >
          <Image src="/assets/google.svg" width={50} height={50} alt="Google" />
        </button>
      </div>
      <p>
        <span>Don't have an account? &nbsp;</span>
        <Link className="text-blue-400" href="/sign-up">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
