"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { getCookie, setCookie } from "cookies-next";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Home</h1>
      {session || getCookie("token") ? (
        <div>
          <p>
            Signed in as {session && session.user?.email},{" "}
            {session && session.user?.name}
          </p>
          <button
            onClick={
              session
                ? () => signOut()
                : () => {
                    setCookie("token", "");
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
