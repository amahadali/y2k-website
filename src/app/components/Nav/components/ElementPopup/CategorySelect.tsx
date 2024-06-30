import React from "react";

interface CategorySelectProps {
  category: string;
  setCategory: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  category,
  setCategory,
}) => (
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
);

export default CategorySelect;
