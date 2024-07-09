"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";

interface EditProfilePopupProps {
  user: {
    username: string;
    profileImage?: string;
  };
  onClose: () => void;
  onProfileUpdated: (newUsername: string, newProfileImage?: string) => void;
}

const EditProfilePopup: React.FC<EditProfilePopupProps> = ({
  user,
  onClose,
  onProfileUpdated,
}) => {
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { update } = useSession();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", newUsername);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const response = await fetch("/api/users/updateProfile", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      // Update the session with new data
      await update({
        username: newUsername,
        profileImage: data.data.profileImage,
      });
      // Call the parent component's callback to update the state
      onProfileUpdated(newUsername, data.data.profileImage);
      // Close the popup
      onClose();
    } else {
      console.error("Failed to update profile", data.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-white mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 font-medium">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-300 font-medium">
              Profile Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {profileImage && (
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(profileImage)}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-600"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
