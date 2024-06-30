// src/app/HomePage/components/ClusterPopup.tsx

import React from "react";

interface ClusterPopupProps {
  closeClusterPopup: () => void;
}

const ClusterPopup: React.FC<ClusterPopupProps> = ({ closeClusterPopup }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl mb-4">Personal Library</h2>
        <input
          type="text"
          placeholder="Enter Library title..."
          className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded-md focus:outline-none"
        />
        <div className="flex items-center mb-4">
          <input type="checkbox" id="make-private" className="mr-2" />
          <label htmlFor="make-private" className="text-gray-400">
            Make Private
          </label>
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={closeClusterPopup}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2">
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClusterPopup;
