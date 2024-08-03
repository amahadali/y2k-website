"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Layout from "../../../../components/Nav/Navigation";
import Feed from "../../../../components/Feed/Feed";

// Define the shape of the parameters for the library
interface LibraryParams {
  libraryId: string;
}

// Define the structure of a post within the library
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
  user: {
    username: string;
  } | null;
  datePosted: string;
}

// Define the structure of a library, including its posts
interface Library {
  _id: string;
  name: string;
  description: string;
  user: string;
  posts: Post[];
}

const LibraryDetailsPage: React.FC = () => {
  // Extract the library ID from URL parameters and initialize router and session
  const { libraryId } = useParams() as unknown as LibraryParams;
  const router = useRouter();
  const { data: session } = useSession();

  // State variables for managing library data, loading state, error handling, and menu visibility
  const [library, setLibrary] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to fetch library data from the API
  const fetchLibrary = async () => {
    try {
      const response = await fetch(`/api/libraries/${libraryId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: libraryId }),
      });
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

  // Fetch the library data when the component mounts or libraryId changes
  useEffect(() => {
    if (libraryId) {
      fetchLibrary();
    }
  }, [libraryId]);

  // Function to handle library deletion
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

  // Function to handle post deletion from the library
  const handleDeletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/libraries/${libraryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, action: "remove" }),
      });

      if (response.ok) {
        await fetchLibrary(); // Re-fetch the library data to update the UI
      } else {
        console.error("Failed to delete post from library");
      }
    } catch (error) {
      console.error("Error deleting post from library:", error);
    }
  };

  // Render loading, error, or library details based on the state
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!library) return <p>Library not found</p>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Display library name and description, and show delete menu for the owner */}
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
        <p className="text-gray-600 mb-4">{library.description}</p>
        {/* Render the Feed component to display posts in the library */}
        <Feed
          posts={library.posts}
          isOwner={session?.user?.id === library.user}
          onDeletePost={handleDeletePost}
          showUploader={false} // Hide uploader information
        />
      </div>
    </Layout>
  );
};

export default LibraryDetailsPage;
