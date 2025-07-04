"use client";

import React, { useState, useEffect } from "react";
import PhotoGrid from "./photo-grid";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { getCookie } from "cookies-next";

const endpoint =
  process.env.NEXT_PUBLIC_SPRING_API_URL || "http://localhost:8080/api";

export default function Dashboard() {
  const { isSignedIn, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [photos, setPhotos] = useState<
    Array<{ imageName: string; imageContent: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchAllImages(currentPage);
    }
  }, [isSignedIn, currentPage]);

  function getToken() {
    return getCookie("token")?.toString() || "";
  }

  async function fetchAllImages(page: number = 1) {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint + `/fetch-all-images/${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: getToken(),
        }),
      });
      const data = await response.json();

      setPhotos(data.images);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("token", getToken());
    formData.append("image", file);

    try {
      const response = await fetch(endpoint + "/gateway/upload-image", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        // Reset to first page after upload to see the new image
        setCurrentPage(1);
        fetchAllImages(1);
      } else {
        console.error("Upload failed:", result);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setCurrentPage(1);
      fetchAllImages(1);
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    try {
      const response = await fetch(endpoint + "/gateway/query-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: getToken(),
          query: searchQuery,
        }),
      });
      const data = await response.json();
      if (data.message === "Image found") {
        setPhotos([
          {
            imageName: `search-result-${Date.now()}`,
            imageContent: data.imageContent,
          },
        ]);
      } else {
        setPhotos([]); // No results found
      }
    } catch (error) {
      console.error("Error searching images:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteImage(imageName: string) {
    try {
      const response = await fetch(endpoint + "/delete-image", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: getToken(),
          imageName: imageName,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        fetchAllImages(1);
      } else {
        console.error("Delete failed:", result);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchAllImages(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return <div className="bg-white min-h-screen"></div>;
  }

  if (!isSignedIn) {
    return (
      <div className="bg-white text-gray-800 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-blue-50 p-8 rounded-xl shadow-lg text-center">
          <h1 className="md:text-4xl text-2xl font-bold text-blue-600 mb-4">
            Access Denied
          </h1>
          <p className="md:text-lg text-gray-600">
            Please sign in to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">My Photos</h1>

          {/* Search and Upload Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search your photos..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value.trim() && isSearching) {
                      resetSearch();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </form>

            {/* Upload Button */}
            <div>
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                className="hidden"
                onChange={handleUpload}
              />
              <button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <Upload className="w-5 h-5" />
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <PhotoGrid
          photos={photos}
          onDelete={handleDeleteImage}
          isSearching={isSearching}
          onResetSearch={resetSearch}
          isLoading={isLoading}
        />

        {/* Pagination Controls - Only show when not searching and have multiple pages */}
        {!isSearching && totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && handlePageChange(page)
                  }
                  disabled={page === "..."}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : page === "..."
                      ? "text-gray-400 cursor-default"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page Info */}
        {!isSearching && totalPages > 1 && (
          <div className="text-center mt-4 text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>
    </div>
  );
}
