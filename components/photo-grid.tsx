import React from "react";
import { Download, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";

interface PhotoGridProps {
  photos: Array<{imageName: string, imageContent: string}>;
  onDelete: (imageName: string) => void;
  isSearching: boolean;
  onResetSearch: () => void;
  isLoading?: boolean;
}

export default function PhotoGrid({ photos, onDelete, isSearching, onResetSearch, isLoading = false }: PhotoGridProps) {
  const handleDownload = (imageContent: string, imageName: string) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${imageContent}`;
    link.download = imageName || 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Loading photos...</p>
      </div>
    );
  }

  // Empty state
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4 text-lg">
            {isSearching ? "No images found matching your search" : "You haven't uploaded any photos yet"}
          </p>
          {isSearching && (
            <button
              onClick={onResetSearch}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mx-auto transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all photos
            </button>
          )}
          {!isSearching && (
            <p className="text-gray-400 text-sm">
              Click "Upload Photo" to add your first image
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search Results Header */}
      {isSearching && (
        <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-blue-700 font-medium">
              {photos.length} search result{photos.length !== 1 ? 's' : ''} found
            </span>
          </div>
          <button
            onClick={onResetSearch}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all photos
          </button>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {photos.map((photo, index) => (
          <div
            key={`${photo.imageName}-${index}`}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative group">
              <div className="w-full h-full flex items-center justify-center">
                <Image 
                  src={`data:image/jpeg;base64,${photo.imageContent}`}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
              </div>
              
              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(photo.imageContent, photo.imageName)}
                    className="bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-200"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {/* Only show delete button if not in search mode or if it's a real image */}
                  {!photo.imageName.startsWith('search-result-') && (
                    <button
                      onClick={() => onDelete(photo.imageName)}
                      className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Card Footer */}
            <div className="p-3">
              <p className="text-sm text-gray-600 truncate" title={photo.imageName}>
                {photo.imageName.startsWith('search-result-') ? 'Search Result' : photo.imageName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
