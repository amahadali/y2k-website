"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  imageUrl: string;
  postType: string;
  contentId: string;
  content: {
    artistName?: string;
    developerName?: string;
    mp3Url?: string;
  };
  datePosted: string;
}

interface FeedProps {
  username?: string;
}

const Feed: React.FC<FeedProps> = ({ username }) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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

  const handleMouseEnter = (mp3Url?: string) => {
    if (audioRef.current && mp3Url) {
      audioRef.current.src = mp3Url;
      audioRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4">{error}</p>;
  if (!posts.length) return <p className="p-4">No posts available</p>;

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      <audio ref={audioRef} />
      {posts.map((post) => (
        <Link
          key={post._id}
          href={`/posts/${post.postType}s/${post.contentId}`}
        >
          <div
            className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onMouseEnter={() => handleMouseEnter(post.content.mp3Url)}
            onMouseLeave={handleMouseLeave}
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
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
};

export default Feed;
