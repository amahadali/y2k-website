import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface ClusterPopupProps {
  closeClusterPopup: () => void;
}

const ClusterPopup: React.FC<ClusterPopupProps> = ({ closeClusterPopup }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const { data: session } = useSession();

  // Function to handle creating a new library
  const handleCreate = async () => {
    // Validate that a name has been provided
    if (!name) return;

    const newLibrary = {
      name,
      description,
      isPrivate,
      user: session?.user.id, // Assuming the user object has an id property
    };

    try {
      const response = await fetch("/api/libraries", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLibrary),
      });

      if (!response.ok) {
        throw new Error("Failed to create library");
      }

      const responseData = await response.json();
      console.log("Library created successfully:", responseData.message);
      closeClusterPopup(); // Close the popup on success
    } catch (error) {
      console.error("Error creating library:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Create Library</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Library Name
          </label>
          <input
            type="text"
            placeholder="Enter Library title..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter Library description..."
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={closeClusterPopup}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClusterPopup;
