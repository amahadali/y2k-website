// src/app/HomePage/components/ElementPopup.tsx

import React from "react";

interface ElementPopupProps {
  closeElementPopup: () => void;
  category: string;
  setCategory: (category: string) => void;
}

const ElementPopup: React.FC<ElementPopupProps> = ({
  closeElementPopup,
  category,
  setCategory,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Create Element</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Select Category
          </label>
          <select
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="song">Song</option>
            <option value="ringtone">Ringtone</option>
            <option value="wallpaper">Wallpaper</option>
            <option value="game">Game</option>
          </select>
        </div>
        {category && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder={`Enter ${category} name...`}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
          </div>
        )}
        {category === "song" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Artist Name
            </label>
            <input
              type="text"
              placeholder="Enter artist name..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
          </div>
        )}
        {category === "ringtone" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Ringtone
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
          </div>
        )}
        {category === "wallpaper" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Upload Wallpaper
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
          </div>
        )}
        {category === "game" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Developer Name
            </label>
            <input
              type="text"
              placeholder="Enter developer name..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            />
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={closeElementPopup}
          >
            Close
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementPopup;
