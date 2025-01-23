"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCookie } from "cookies-next";

export default function EnterPasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [passwordsDoNotMatch, setPasswordsDoNotMatch] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [userHasNoPassword, setUserHasNoPassword] = useState(false);
  const [noSuchUser, setNoSuchUser] = useState(false);
  const [otpNotVerified, setOtpNotVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const Router = useRouter();
  useEffect(() => {
    if (session || getCookie("token")) {
      Router.push("/");
    }
    if (!getCookie("userEmail")) {
      Router.push("/enter-email");
    }
  }, [session, Router]);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInvalidPassword(false);
    setPasswordsDoNotMatch(false);
    if (password.length === 0) {
      setInvalidPassword(true);
      setPassword("");
      setConfirmPassword("");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordsDoNotMatch(true);
      setConfirmPassword("");
      return;
    }
    setLoading(true);
    const response = await fetch(
      (process.env.NEXT_PUBLIC_IS_DOCKER ? process.env.NEXT_PUBLIC_SPRING_API_URL_DOCKER : process.env.NEXT_PUBLIC_SPRING_API_URL) +
        "/forgot-password/reset-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: getCookie("userEmail") || "", password }),
      }
    );
    const responseData = await response.json();
    setLoading(false);
    if (response.ok) {
      Router.push("/sign-in");
    } else if (response.status === 400) {
      if (responseData.message === "Invalid password") {
        setInvalidPassword(true);
        setPassword("");
        setConfirmPassword("");
      } else if (responseData.message === "Invalid email") {
        setInvalidEmail(true);
        setPassword("");
        setConfirmPassword("");
      } else if (responseData.message === "User has no password") {
        setUserHasNoPassword(true);
        setPassword("");
        setConfirmPassword("");
      } else if (responseData.message === "OTP not verified") {
        setOtpNotVerified(true);
        setPassword("");
        setConfirmPassword("");
      }
    } else if (response.status === 404) {
      setNoSuchUser(true);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-gray-800 rounded-3xl p-4 flex flex-col items-center">
        <h1 className="font-semibold text-xl">Ener New Password</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-8 p-8 w-full items-center"
        >
          <label className="md:w-1/2 grid grid-rows-2">
            <div>New Password</div>
            <input
              className="rounded w-full p-1 text-black"
              type="password"
              name="password"
              placeholder="****"
              autoFocus
              autoComplete="password"
              required
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
            {invalidPassword && (
              <p className="text-red-500">Invalid Password</p>
            )}
          </label>
          <label className="md:w-1/2 grid grid-rows-2">
            <div>Confirm New Password</div>
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
            {passwordsDoNotMatch && (
              <p className="text-red-500">Passwords do not match</p>
            )}
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:bg-blue-500 disabled:opacity-50"
            onClick={(e) => {
              setInvalidPassword(false);
              setPasswordsDoNotMatch(false);
            }}
          >
            Set Password
          </button>
        </form>
        {invalidEmail && <p className="text-red-500">Invalid email</p>}
        {userHasNoPassword && (
          <p className="text-red-500">Please sign in through Gmail</p>
        )}
        {noSuchUser && <p className="text-red-500">No such user</p>}
        {otpNotVerified && (
          <p className="text-red-500">Please verify your OTP</p>
        )}
      </div>
    </div>
  );
}
