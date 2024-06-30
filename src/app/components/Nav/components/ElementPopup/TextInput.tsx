import React from "react";

interface TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-400 mb-2">
      {label}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
      value={value}
      onChange={onChange}
    />
  </div>
);

export default TextInput;
