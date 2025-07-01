import React from "react";
import { Download, Trash2 } from "lucide-react";

export default function PhotoGrid() {
  const handleDownload = (index: number) => {
    console.log(`Downloading photo ${index + 1}`);
  };

  const handleDelete = (index: number) => {
    console.log(`Deleting photo ${index + 1}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            {/* Image Preview */}
            <div className="aspect-square bg-gray-100 relative group">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Photo {index + 1}</span>
              </div>
              
              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(index)}
                    className="bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-50 transition-colors duration-200"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
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
              <p className="text-sm text-gray-600 text-center">Image {index + 1}</p>
            </div>
          </div>
        ))}
    </div>
  );
}
