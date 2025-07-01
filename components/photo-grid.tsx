import React from "react";
import { Download, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface PhotoGridProps {
  photos: Array<{imageName: string, imageContent: string}>;
  onDelete: (imageName: string) => void;
  isSearching: boolean;
  onResetSearch: () => void;
}

export default function PhotoGrid({ photos, onDelete, isSearching, onResetSearch }: PhotoGridProps) {
  const handleDownload = (imageContent: string, imageName: string) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${imageContent}`;
    link.download = imageName || 'download.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 mb-4">
          {isSearching ? "No images found matching your search" : "You haven't uploaded any photos yet"}
        </p>
        {isSearching && (
          <button
            onClick={onResetSearch}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all photos
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {photos.map((photo, index) => (
        <div
          key={index}
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
                <button
                  onClick={() => onDelete(photo.imageName)}
                  className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Card Footer */}
          <div className="p-3">
            <p className="text-sm text-gray-600 truncate">{photo.imageName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
