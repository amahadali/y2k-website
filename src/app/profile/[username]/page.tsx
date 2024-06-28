// src/app/profile/[username]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "../../components/Navigation";
import Feed from "../../HomePage/components/Feed";

interface User {
  username: string;
  email: string;
  profileImage?: string;
  dateJoined: string;
}

const ProfilePage: React.FC = () => {
  const params = useParams();
  const username = Array.isArray(params?.username)
    ? params.username[0]
    : params?.username;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${username}`);
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  if (loading) {
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
          </div>
        </div>
        <Feed username={user.username} />
      </div>
    </Layout>
  );
};

export default ProfilePage;
