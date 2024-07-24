import React from "react";

interface ImageUploadProps {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      e.target.value = ""; // Clear the input
      return;
    }
    onImageChange(e);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Upload Image
      </label>
      <input
        type="file"
        accept="image/*"
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ImageUpload;
