"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpComponent() {
  const {
    session,
    isSignedIn,
    setIsSignedIn,
    emailGlobal,
    setEmailGlobal,
    nameGlobal,
    setNameGlobal,
  } = useAuth();
  const Router = useRouter();
  useEffect(() => {
    if (session || getCookie("token")) {
      setIsSignedIn(true);
      Router.push("/dashboard");
    }
  }, [session, Router]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [passwordNotMatch, setPasswordNotMatch] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailTaken(false);
    setPasswordNotMatch(false);
    setInvalidEmail(false);
    setInvalidName(false);
    setInvalidPassword(false);
    if (name === "") {
      setInvalidName(true);
      return;
    }
    if (email === "") {
      setInvalidEmail(true);
      return;
    }
    if (password === "") {
      setInvalidPassword(true);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordNotMatch(true);
      setPassword("");
      setConfirmPassword("");
      return;
    }
    const data = { name, email, password };
    setLoading(true);
    const response = await fetch(
      (process.env.NEXT_PUBLIC_IS_DOCKER
        ? process.env.NEXT_PUBLIC_SPRING_API_URL_DOCKER
        : process.env.NEXT_PUBLIC_SPRING_API_URL) + "/auth/sign-up",
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
      setCookie("token", token, {
        secure: true,
        sameSite: "strict",
        path: "/",
      });
      setIsSignedIn(true);
      Router.push("/dashboard");
    } else if (responseData.message === "User already exists") {
      setEmailTaken(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else if (responseData.message === "Invalid email") {
      setInvalidEmail(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } else if (responseData.message === "Invalid password") {
      setInvalidPassword(true);
      setPassword("");
      setConfirmPassword("");
    } else {
      setInvalidName(true);
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-gray-800 rounded-3xl p-4 flex flex-col items-center">
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
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
            {invalidName && <p className="text-red-500">Invalid Name</p>}
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
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailTaken && (
              <p className="text-red-500">Account already exists</p>
            )}
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
            {invalidPassword && (
              <p className="text-red-500">Invalid password</p>
            )}
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
              disabled={loading}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordNotMatch && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:bg-blue-500 disabled:opacity-50"
            onClick={(e) => {
              setEmailTaken(false);
              setPasswordNotMatch(false);
              setInvalidEmail(false);
              setInvalidName(false);
              setInvalidPassword(false);
            }}
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
          <Image
            src="/assets/google_old.svg"
            width={50}
            height={50}
            alt="google"
          />
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
