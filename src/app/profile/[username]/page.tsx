"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "../../components/Nav/Navigation";
import Feed from "../../components/Feed/Feed";
import LibraryFeed from "../../components/Feed/LibraryFeed";
import EditProfilePopup from "../components/EditProfilePopup";

// Define the structure of user data
interface User {
  username: string;
  email: string;
  profileImage?: string;
  dateJoined: string;
}

const ProfilePage: React.FC = () => {
  // Get the session data (for authentication) and URL parameters
  const { data: session } = useSession();
  const params = useParams();
  const username = params?.username;

  // State variables for user data, loading state, view mode, and edit profile state
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [view, setView] = useState<"posts" | "libraries">("posts");
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Fetch user data when the component mounts or the username changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  // Function to handle profile updates
  const handleProfileUpdated = (
    newUsername: string,
    newProfileImage?: string
  ) => {
    setUser((prevUser) => ({
      ...prevUser!,
      username: newUsername,
      profileImage: newProfileImage || prevUser?.profileImage,
    }));
  };

  // Show loading indicator while user data is being fetched
  if (loadingUser) {
    return <div>Loading...</div>;
  }

  // Show error message if user data is not found
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 text-center">
        <div className="flex flex-col items-center">
          {/* Display user's profile image or initials */}
          <div className="w-32 h-32 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center shadow-lg">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-4xl">
                {user.username.charAt(0)}
              </span>
            )}
          </div>
          <h1 className="text-3xl mt-4 font-bold">{user.username}</h1>
          <p className="text-gray-400">
            Joined on {new Date(user.dateJoined).toLocaleDateString()}
          </p>
          {/* Show edit profile button if the logged-in user matches the profile being viewed */}
          {session?.user?.username === user.username && (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="mt-4 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-md shadow-sm hover:bg-gray-500 transition-colors duration-300"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Tabs for switching between posts and libraries */}
        <div className="relative flex justify-center mt-4">
          <div className="flex space-x-4 relative">
            <button
              onClick={() => setView("posts")}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                view === "posts"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Posts
              {view === "posts" && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-md transition-transform duration-300 ease-in-out" />
              )}
            </button>
            <button
              onClick={() => setView("libraries")}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                view === "libraries"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Libraries
              {view === "libraries" && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white rounded-t-md transition-transform duration-300 ease-in-out" />
              )}
            </button>
          </div>
        </div>

        {/* Render either the Feed or LibraryFeed component based on the selected view */}
        <div className="mt-8">
          {view === "posts" ? (
            <Feed username={user.username} />
          ) : (
            <LibraryFeed username={user.username} />
          )}
        </div>

        {/* Show profile edit popup if the editing state is true */}
        {isEditingProfile && (
          <EditProfilePopup
            user={user}
            onClose={() => setIsEditingProfile(false)}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
