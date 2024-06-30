import React from "react";

interface ImageUploadProps {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-2">
      Upload Image
    </label>
    <input
      type="file"
      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
      onChange={onImageChange}
    />
  </div>
);

export default ImageUpload;
