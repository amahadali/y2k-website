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
      <div className="bg-white p-4 rounded-md shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700">Profile Image</label>
            <input type="file" onChange={handleFileChange} />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;
