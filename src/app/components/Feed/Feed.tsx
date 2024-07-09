"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface Post {
  _id: string;
  title: string;
  imageUrl: string;
  postType: string;
  contentId: string;
  content?: {
    artistName?: string;
    developerName?: string;
    mp3Url?: string;
  };
  datePosted: string;
}

interface FeedProps {
  username?: string;
  posts?: Post[];
  onDeletePost?: (postId: string) => void;
  isOwner?: boolean;
}

const Feed: React.FC<FeedProps> = ({
  username,
  posts: initialPosts,
  onDeletePost,
  isOwner,
}) => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    if (!initialPosts && status === "authenticated") {
      const fetchPosts = async () => {
        try {
          const body = username ? { username } : {};
          const response = await fetch(`/api/posts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
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
    }
  }, [username, initialPosts, status]);

  const handleMouseEnter = (mp3Url: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(mp3Url);
    audio.play();
    setCurrentAudio(audio);
  };

  const handleMouseLeave = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
  };

  const handlePostClick = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    if (onDeletePost) {
      onDeletePost(postId);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4">{error}</p>;
  if (!posts.length) return <p className="p-4">No posts available</p>;

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <main className="p-4 mt-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <div key={post._id} className="relative group">
            <Link
              href={`/posts/${post.postType}s/${post.contentId}`}
              onClick={handlePostClick}
            >
              <div
                className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer mb-4"
                onMouseEnter={() => handleMouseEnter(post.content?.mp3Url!)}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-lg font-bold">{post.title}</h3>
                  <p className="text-gray-300 capitalize">{post.postType}</p>
                  {post.postType === "songs" && post.content?.artistName && (
                    <p className="text-gray-300">{post.content.artistName}</p>
                  )}
                  {post.postType === "games" && post.content?.developerName && (
                    <p className="text-gray-300">
                      {post.content.developerName}
                    </p>
                  )}
                </div>
              </div>
            </Link>
            {isOwner && (
              <button
                onClick={() => handleDeletePost(post._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &minus;
              </button>
            )}
          </div>
        ))}
      </Masonry>
    </main>
  );
};

export default Feed;
