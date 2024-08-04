"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <Link href="/">
      <h1 className="font-bold m-4 text-center text-3xl md:text-5xl">
        Image DB
      </h1>
    </Link>
  );
}
