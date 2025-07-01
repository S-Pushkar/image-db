"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCookie } from "cookies-next";
import { Shield, ArrowLeft, RefreshCw } from "lucide-react";

export default function EnterOtpComponent() {
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
  
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [otpLimitExceeded, setOtpLimitExceeded] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [otpDoesNotExist, setOtpDoesNotExist] = useState(false);
  const [otpDoesNotExistForEmail, setOtpDoesNotExistForEmail] = useState(false);
  const [otpAlreadyVerified, setOtpAlreadyVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInvalidOtp(false);
    setOtpLimitExceeded(false);
    setOtpDoesNotExist(false);
    setOtpDoesNotExistForEmail(false);
    
    if (otp.length !== 6) {
      setInvalidOtp(true);
      return;
    }
    
    setLoading(true);
    const response = await fetch(
      (process.env.NEXT_PUBLIC_IS_DOCKER ? process.env.NEXT_PUBLIC_SPRING_API_URL_DOCKER : process.env.NEXT_PUBLIC_SPRING_API_URL) + "/forgot-password/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: getCookie("userEmail"), otp }),
      }
    );
    const responseData = await response.json();
    setLoading(false);
    
    if (response.status === 400) {
      if (responseData.message === "Invalid OTP") {
        setInvalidOtp(true);
      } else if (responseData.message === "Invalid email") {
        Router.push("/enter-email");
      }
    } else if (response.status === 404) {
      setOtpDoesNotExistForEmail(true);
    } else {
      Router.push("/enter-password");
    }
  }
  
  async function handleResend() {
    setOtpResent(false);
    setOtpLimitExceeded(false);
    setOtpDoesNotExist(false);
    setOtpAlreadyVerified(false);
    setResending(true);
    
    if (otpDoesNotExist || otpDoesNotExistForEmail) {
      Router.push("/enter-email");
      return;
    }
    
    const response = await fetch(
      (process.env.NEXT_PUBLIC_IS_DOCKER ? process.env.NEXT_PUBLIC_SPRING_API_URL_DOCKER : process.env.NEXT_PUBLIC_SPRING_API_URL) + "/forgot-password/resend-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: getCookie("userEmail") }),
      }
    );
    const responseData = await response.json();
    setResending(false);
    
    if (response.status === 400) {
      if (responseData.message === "Invalid email") {
        Router.push("/enter-email");
      } else if (responseData.message === "OTP limit exceeded") {
        setOtpLimitExceeded(true);
      } else if (responseData.message === "OTP already verified") {
        setOtpAlreadyVerified(true);
      }
    } else if (response.status === 404) {
      setOtpDoesNotExist(true);
    } else {
      setOtpResent(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Enter Verification Code</h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to {getCookie("userEmail")}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderInput={(props) => <input {...props} />}
                  renderSeparator={<span className="mx-1"></span>}
                  containerStyle="flex flex-row justify-center"
                  inputStyle="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-black mx-1"
                  shouldAutoFocus={true}
                  skipDefaultStyles={true}
                />
              </div>
              
              {/* Error Messages */}
              {invalidOtp && (
                <p className="text-red-500 text-sm mt-2 text-center">Invalid OTP. Please try again.</p>
              )}
              {otpDoesNotExistForEmail && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  OTP does not exist. OTP may have expired. Please try again.
                </p>
              )}
              {otpAlreadyVerified && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  User already verified with correct OTP.
                </p>
              )}
              {otpLimitExceeded && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  OTP limit exceeded. Please try again later.
                </p>
              )}
              {otpDoesNotExist && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  OTP does not exist. OTP may have expired. Please try again.
                </p>
              )}
              
              {/* Success Message */}
              {otpResent && (
                <p className="text-green-500 text-sm mt-2 text-center">OTP resent successfully</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <p className="text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${resending ? 'animate-spin' : ''}`} />
              {resending ? "Resending..." : "Resend Code"}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium" 
            href="/enter-email"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Email
          </Link>
        </div>
      </div>
    </div>
  );
}
