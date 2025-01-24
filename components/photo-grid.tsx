export default function PhotoGrid() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array(8)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center hover:bg-gray-600 transition"
          >
            <div className="w-full h-32 bg-gray-500 rounded-lg mb-4"></div>
            <p className="text-gray-300">Photo {index + 1}</p>
            <div className="mt-2 space-x-2 flex">
              <button className="bg-teal-500 text-sm px-4 py-2 rounded hover:bg-teal-600 w-24 text-center font-semibold">
                Download
              </button>
              <button className="bg-red-500 text-sm px-4 py-2 rounded hover:bg-red-600 w-24 text-center font-semibold">
                Delete
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
