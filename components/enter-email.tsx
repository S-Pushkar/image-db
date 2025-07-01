"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next";
import { Mail, ArrowLeft } from "lucide-react";

export default function EnterEmailComponent() {
  const { data: session } = useSession();
  const Router = useRouter();
  
  if (session || getCookie("token")) {
    Router.push("/");
  }
  
  const [email, setEmail] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [noPassword, setNoPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInvalidEmail(false);
    setEmailNotFound(false);
    setOtpSent(false);
    setNoPassword(false);
    setLoading(true);
    
    const response = await fetch(
      (process.env.NEXT_PUBLIC_IS_DOCKER ? process.env.NEXT_PUBLIC_SPRING_API_URL_DOCKER : process.env.NEXT_PUBLIC_SPRING_API_URL) + "/forgot-password/enter-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    const responseJson = await response.json();
    const message = responseJson.message;
    setLoading(false);
    
    if (message === "Invalid email") {
      setInvalidEmail(true);
    } else if (message === "User not found") {
      setEmailNotFound(true);
    } else if (message === "OTP already sent") {
      setOtpSent(true);
      Router.push("/enter-otp");
    } else if (message === "User has no password") {
      setNoPassword(true);
    } else if (message === "OTP already verified") {
      setCookie("userEmail", email, {
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 5 * 60,
      });
      Router.push("/enter-password");
    } else {
      setCookie("userEmail", email, {
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 5 * 60,
      });
      Router.push("/enter-otp");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a reset code</p>
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
              {otpSent && <p className="text-red-500 text-sm mt-1">OTP already sent</p>}
              {noPassword && <p className="text-red-500 text-sm mt-1">Please sign in with Google</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <Link 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium" 
            href="/sign-in"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
