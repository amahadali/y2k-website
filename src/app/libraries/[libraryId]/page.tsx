"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  user: string;
  posts: Post[];
}

const LibraryDetailsPage: React.FC = () => {
  const { libraryId } = useParams() as unknown as LibraryParams;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/Login"); // Redirect to login page if not authenticated
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const response = await fetch(`/api/libraries/${libraryId}`);
        const data = await response.json();
        if (data.success) {
          setLibrary(data.data);
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
      fetchLibrary();
    }
  }, [libraryId]);

  const handleDeleteLibrary = async () => {
    try {
      const response = await fetch(`/api/libraries/${libraryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push(`/profile/${session?.user?.username}`);
      } else {
        console.error("Failed to delete library");
      }
    } catch (error) {
      console.error("Error deleting library:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!library) return <p>Library not found</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{library.name}</h1>
          {session?.user?.id === library.user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-xl text-gray-500 hover:text-gray-700"
              >
                &#x22EE;
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg py-2 z-10">
                  <button
                    onClick={handleDeleteLibrary}
                    className="block px-4 py-2 text-red-500 hover:bg-gray-700 w-full text-left"
                  >
                    Delete Library
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-4">{library.description}</p>{" "}
        {/* Added description */}
        <Feed posts={library.posts} />
      </div>
    </Layout>
  );
};

export default LibraryDetailsPage;
