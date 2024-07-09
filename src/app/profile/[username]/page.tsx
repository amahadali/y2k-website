"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "../../components/Nav/Navigation";
import Feed from "../../components/Feed/Feed";
import LibraryFeed from "../../components/Feed/LibraryFeed";
import EditProfilePopup from "../components/EditProfilePopup";

interface User {
  username: string;
  email: string;
  profileImage?: string;
  dateJoined: string;
}

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const params = useParams();
  const username = params?.username;
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [view, setView] = useState<"posts" | "libraries">("posts");
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`, {
          method: "POST", // Use POST method
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }), // Send username in the body
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

  const handleProfileUpdated = (
    newUsername: string,
    newProfileImage?: string
  ) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        username: newUsername,
        profileImage: newProfileImage || prevUser.profileImage,
      };
    });
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="rounded-full"
              />
            ) : (
              <span className="text-white text-2xl">
                {user.username.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl">{user.username}</h1>
            <p className="text-gray-400">
              Joined on {new Date(user.dateJoined).toLocaleDateString()}
            </p>
            {session?.user?.username === user.username && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setView("posts")}
            className={`px-4 py-2 ${
              view === "posts" ? "bg-gray-800" : "bg-gray-700"
            } rounded-md`}
          >
            Posts
          </button>
          <button
            onClick={() => setView("libraries")}
            className={`px-4 py-2 ${
              view === "libraries" ? "bg-gray-800" : "bg-gray-700"
            } rounded-md`}
          >
            Libraries
          </button>
        </div>
        {view === "posts" ? (
          <Feed username={user.username} />
        ) : (
          <LibraryFeed username={user.username} />
        )}
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
