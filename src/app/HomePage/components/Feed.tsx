// src/app/HomePage/components/Feed.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Post {
  _id: string;
  title: string;
  imageUrl: string;
  postType: string;
  content: {
    artistName?: string;
    developerName?: string;
    mp3Url?: string;
  };
  datePosted: string;
}

interface FeedProps {
  showDeleteButton?: boolean;
  username?: string;
}

const Feed: React.FC<FeedProps> = ({ showDeleteButton = false, username }) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = username ? `?username=${username}` : "";
        const response = await fetch(`/api/posts${query}`);
        const data = await response.json();

        if (data.success) {
          setPosts(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error(error);
      alert("Error deleting post");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4">{error}</p>;
  if (!posts.length) return <p className="p-4">No posts available</p>;

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {posts.map((post) => (
        <div
          key={post._id}
          className="relative group overflow-hidden rounded-lg shadow-lg"
        >
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-lg font-bold">{post.title}</h3>
            <p className="text-gray-300 capitalize">{post.postType}</p>
            {post.postType === "song" && post.content.artistName && (
              <p className="text-gray-300">{post.content.artistName}</p>
            )}
            {post.postType === "game" && post.content.developerName && (
              <p className="text-gray-300">{post.content.developerName}</p>
            )}
            {post.postType === "ringtone" && post.content.mp3Url && (
              <button
                onClick={() => new Audio(post.content.mp3Url).play()}
                className="mt-2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-700 focus:outline-none"
              >
                ▶️
              </button>
            )}
            {showDeleteButton && session?.user?.username === username && (
              <button
                onClick={() => handleDelete(post._id)}
                className="mt-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-800 focus:outline-none"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </main>
  );
};

export default Feed;
