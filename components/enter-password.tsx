"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCookie } from "cookies-next";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function EnterPasswordComponent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setInvalidEmail(false);
    setUserHasNoPassword(false);
    setNoSuchUser(false);
    setOtpNotVerified(false);

    if (password.length === 0) {
      setInvalidPassword(true);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordsDoNotMatch(true);
      setPassword("");
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
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your new password"
                  autoFocus
                  autoComplete="new-password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {invalidPassword && <p className="text-red-500 text-sm mt-1">Invalid password</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  disabled={loading}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordsDoNotMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>

          {/* Error messages */}
          {invalidEmail && <p className="text-red-500 text-sm mt-4 text-center">Invalid email</p>}
          {userHasNoPassword && <p className="text-red-500 text-sm mt-4 text-center">Please sign in through Gmail</p>}
          {noSuchUser && <p className="text-red-500 text-sm mt-4 text-center">No such user</p>}
          {otpNotVerified && <p className="text-red-500 text-sm mt-4 text-center">Please verify your OTP</p>}
        </div>
      </div>
    </div>
  );
}
