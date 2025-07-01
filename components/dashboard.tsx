"use client";

import React, { useState, useEffect } from "react";
import PhotoGrid from "./photo-grid";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Upload } from "lucide-react";
import { getCookie } from "cookies-next";

const endpoint = process.env.NEXT_PUBLIC_SPRING_API_URL || 'http://localhost:8080/api';

export default function Dashboard() {
  const { isSignedIn, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [photos, setPhotos] = useState<Array<{imageName: string, imageContent: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchAllImages();
    }
  }, [isSignedIn]);

  function getToken() {
    return getCookie('token')?.toString() || '';
  }

  async function fetchAllImages() {
    try {
      const response = await fetch(endpoint + '/fetch-all-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: getToken()
        })
      });
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('token', getToken());
    formData.append('image', file);

    try {
      const response = await fetch(endpoint + '/gateway/upload-image', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        fetchAllImages(); // Refresh the image list
      } else {
        console.error('Upload failed:', result);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchAllImages();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(endpoint + '/gateway/query-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: getToken(),
          query: searchQuery
        })
      });
      const data = await response.json();
      if (data.message === "Image found") {
        setPhotos([{imageName: `search-result-${Date.now()}`, imageContent: data.imageContent}]);
      } else {
        setPhotos([]); // No results found
      }
    } catch (error) {
      console.error('Error searching images:', error);
    }
  }

  async function handleDeleteImage(imageName: string) {
    try {
      const response = await fetch(endpoint + '/delete-image', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: getToken(),
          imageName: imageName
        })
      });
      const result = await response.json();
      if (response.ok) {
        fetchAllImages(); // Refresh the image list
      } else {
        console.error('Delete failed:', result);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }

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
          <p className="md:text-lg text-gray-600">Please sign in to view this page.</p>
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
                      setIsSearching(false);
                      fetchAllImages();
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
          onResetSearch={() => {
            setSearchQuery('');
            setIsSearching(false);
            fetchAllImages();
          }}
        />
      </div>
    </div>
  );
}
