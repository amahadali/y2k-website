import React from "react";

interface FileUploadProps {
  label: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-2">
      {label}
    </label>
    <input
      type="file"
      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
      onChange={onFileChange}
    />
  </div>
);

export default FileUpload;
