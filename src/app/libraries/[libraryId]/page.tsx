// src/app/libraries/[libraryId]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "../../components/Nav/Navigation";
import Feed from "../../components/Feed/Feed";

interface LibraryParams {
  libraryId: string;
}

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
  user: string;
  datePosted: string;
}

interface Library {
  _id: string;
  name: string;
  description: string;
  posts: Post[];
}

const LibraryDetailsPage: React.FC = () => {
  const { libraryId } = useParams() as unknown as LibraryParams;
  const [libraryPosts, setLibraryPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraryPosts = async () => {
      try {
        const response = await fetch(`/api/libraries/${libraryId}`);
        const data = await response.json();
        if (data.success) {
          setLibraryPosts(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch library posts");
      } finally {
        setLoading(false);
      }
    };

    if (libraryId) {
      fetchLibraryPosts();
    }
  }, [libraryId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!libraryPosts.length) return <p>No posts found in this library</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <Feed posts={libraryPosts} />
      </div>
    </Layout>
  );
};

export default LibraryDetailsPage;
