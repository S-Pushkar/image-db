"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { deleteCookie, getCookie } from "cookies-next";

export default function HomeComponent() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    if (session) {
      setEmail(session.user?.email || "");
      setName(session.user?.name || "");
    } else {
      setToken(getCookie("token") || "");
      setEmail(getCookie("userEmail") || "");
      setName(getCookie("userName") || "");
    }
  }, [session]);
  return (
    <div>
      <h1>Home</h1>
      {session || token ? (
        <div>
          <p>
            Signed in as {email}, {name}
          </p>
          <button
            onClick={
              session
                ? () => signOut()
                : () => {
                    deleteCookie("token");
                    deleteCookie("userName");
                    deleteCookie("userEmail");
                    window.location.reload();
                  }
            }
          >
            Sign out
          </button>
        </div>
      ) : (
        <div>
          <p>Not signed in</p>
          <Link href="/sign-in">Sign in</Link>
        </div>
      )}
    </div>
  );
}
