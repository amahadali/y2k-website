import React from "react";

interface FileUploadProps {
  label: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith("audio/")) {
      alert("Please upload a valid audio file.");
      e.target.value = ""; // Clear the input
      return;
    }
    onFileChange(e);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      <input
        type="file"
        accept="audio/*"
        className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
