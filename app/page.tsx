"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Home</h1>
      {session ? (
        <div>
          <p>
            Signed in as {session.user?.email}, {session.user?.name}
          </p>
          <button onClick={() => signOut()}>Sign out</button>
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
