"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignInComponent() {
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
  const [showPassword, setShowPassword] = useState(false);
  
  useEffect(() => {
    if (session || getCookie("token")) {
      setIsSignedIn(true);
      Router.push("/dashboard");
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
      (process.env.NEXT_PUBLIC_IS_DOCKER
        ? process.env.NEXT_PUBLIC_SPRING_API_URL_DOCKER
        : process.env.NEXT_PUBLIC_SPRING_API_URL) + "/auth/sign-in",
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
      setIsSignedIn(true);
      Router.push("/dashboard");
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoFocus
                  autoComplete="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailNotFound && <p className="text-red-500 text-sm mt-1">Email not found</p>}
              {invalidEmail && <p className="text-red-500 text-sm mt-1">Invalid email</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
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
              {passwordIncorrect && <p className="text-red-500 text-sm mt-1">Incorrect password</p>}
              
              <div className="text-right mt-2">
                <Link className="text-blue-600 hover:text-blue-800 text-sm" href="/enter-email">
                  Forgot Password?
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link className="text-blue-600 hover:text-blue-800 font-medium" href="/sign-up">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}