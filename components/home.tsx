"use client";

import React from "react";
import { Search, Upload, Shield, Zap } from "lucide-react";

export default function HomeComponent() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-4">
              Tag<span className="text-blue-800">My</span>Pic
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Organize your images effortlessly with AI-powered tagging and smart search. 
            Upload, search, and manage your photos like never before.
          </p>
        </header>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">Smart Search</h3>
            <p className="text-gray-600 leading-relaxed">
              Find your images instantly using natural language. Our AI understands what you're looking for and delivers accurate results.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">OCR Technology</h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced Optical Character Recognition extracts text from your images, making them searchable and organized automatically.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">Secure Storage</h3>
            <p className="text-gray-600 leading-relaxed">
              Your images are stored securely with enterprise-grade encryption. Access them anytime, anywhere with complete peace of mind.
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload</h3>
              <p className="text-gray-600">Upload your images in various formats including JPEG, PNG, and more.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Process</h3>
              <p className="text-gray-600">Our AI analyzes and extracts text content using advanced OCR technology.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Search</h3>
              <p className="text-gray-600">Search and retrieve your images using natural language queries.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-blue-600 text-white rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of users who trust TagMyPic for their image organization needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
              Sign Up Free
            </button>
            <button className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Learn More
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}