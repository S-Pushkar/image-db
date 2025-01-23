"use client";

import React from "react";

export default function HomeComponent() {
  return (
    <div className="bg-gray-900 text-gray-200">
      <main className="container mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-teal-400">Welcome to TagMyPic</h1>
          <p className="mt-4 text-lg text-gray-300">
            Organize your images effortlessly with our easy to use and secure application!
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">How It Works</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>TagMyPic uses Optical Character Recognition (OCR) to extract text from your images and stores them securely.</li>
              <li>Simply upload an image and query for that image in natural language and our system will use Sentiment Analysis to search for your required image.</li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-teal-400 mb-4">Features</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Extract text from images using advanced OCR technology.</li>
              <li>Store images securely.</li>
              <li>Search and retrieve images with ease.</li>
              <li>Supports multiple image formats including JPEG, PNG, and more.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
