import React, { useState } from "react";

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
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const fileUrl = URL.createObjectURL(file); // Temporary URL for local testing

    let additionalFields: { [key: string]: string } = {};

    if (category === "song") {
      additionalFields = { artistName };
    } else if (category === "game") {
      additionalFields = { developerName };
    }

    const data = {
      postType: category,
      title,
      additionalFields,
      fileUrl,
    };

    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      console.log("Token included in request:", token); // Log token to verify

      const response = await fetch("/api/upload/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to upload content");
      }

      const responseData = await response.json();
      console.log("Content uploaded successfully:", responseData.message);
      closeElementPopup();
    } catch (error) {
      console.error("Error uploading content:", error);
    }
  };

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
              onChange={handleFileChange}
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
              onChange={handleFileChange}
            />
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
              onChange={handleFileChange}
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
              onChange={handleFileChange}
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
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
            />
            <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
              Upload Image
            </label>
            <input
              type="file"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
              onChange={handleFileChange}
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
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2"
            onClick={handleUpload}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementPopup;
