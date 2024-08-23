"use client";

import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getCookie } from "cookies-next";

export default function EnterOtpComponent() {
  const { data: session } = useSession();
  const Router = useRouter();
  if (session || getCookie("token")) {
    Router.push("/");
  }
  if (!getCookie("userEmail")) {
    Router.push("/enter-email");
  }
  const [otp, setOtp] = useState("");
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [otpLimitExceeded, setOtpLimitExceeded] = useState(false);
  const [otpResent, setOtpResent] = useState(false);
  const [otpDoesNotExist, setOtpDoesNotExist] = useState(false);
  const [otpDoesNotExistForEmail, setOtpDoesNotExistForEmail] = useState(false);
  const [otpAlreadyVerified, setOtpAlreadyVerified] = useState(false);
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
    const response = await fetch(
      process.env.NEXT_PUBLIC_SPRING_API_URL + "/forgot-password/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: getCookie("userEmail"), otp }),
      }
    );
    const responseData = await response.json();
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
    const response = await fetch(
      process.env.NEXT_PUBLIC_SPRING_API_URL + "/forgot-password/resend-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: getCookie("userEmail") }),
      }
    );
    const responseData = await response.json();
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
    <div className="flex flex-col items-center">
      <div className="md:w-2/5 m-4 h-2/5 bg-black rounded-3xl p-4 flex flex-col items-center">
        <h1 className="font-semibold text-xl">Enter OTP</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-8 p-8 w-full items-center"
        >
          <label className="md:w-1/2 flex flex-col items-center text-black">
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => <input {...props} />}
              renderSeparator={<span className="text-white mx-1">-</span>}
              containerStyle="flex flex-row justify-center w-full"
              inputStyle="text-center rounded px-1 w-8 h-8 m-1"
              shouldAutoFocus={true}
              skipDefaultStyles={true}
            />
          </label>
          {invalidOtp && (
            <div className="text-red-500">Invalid OTP. Please try again.</div>
          )}
          {otpDoesNotExistForEmail && (
            <div className="text-red-500">
              OTP does not exist. OTP may have expired. Please try again.
            </div>
          )}
            {otpAlreadyVerified && (
                <div className="text-red-500">
                User already verified with correct OTP.
                </div>
            )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded active:bg-blue-500"
          >
            Submit
          </button>
        </form>
        <p>Didn't receive the OTP?</p>
        <p>
          Click{" "}
          <button className="text-blue-400" onClick={handleResend}>
            here
          </button>{" "}
          to resend.
        </p>
        {otpResent && <p className="text-green-500">OTP resent successfully</p>}
        {otpLimitExceeded && (
          <div className="text-red-500">
            OTP limit exceeded. Please try again later.
          </div>
        )}
        {otpDoesNotExist && (
          <div className="text-red-500">
            OTP does not exist. OTP may have expired. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}
