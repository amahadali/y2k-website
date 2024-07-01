"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PostDetailsProps {
  fetchUrl: string;
  redirectUrl: string;
  children: (data: any) => ReactNode;
}

const PostDetails: React.FC<PostDetailsProps> = ({
  fetchUrl,
  redirectUrl,
  children,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [contentData, setContentData] = useState<any | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [postUserId, setPostUserId] = useState<string | null>(null); // State to store post user ID
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/Login"); // Redirect to login page if not authenticated
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      const pathParts = window.location.pathname.split("/");
      const newContentId = pathParts[pathParts.length - 1];
      if (newContentId) {
        fetch(fetchUrl.replace("{id}", newContentId))
          .then((response) => response.json())
          .then((data) => {
            setContentData(data);
            return fetch(`/api/posts?contentId=${newContentId}`);
          })
          .then((response) => response.json())
          .then((data) => {
            if (data.success && data.data.length > 0) {
              setPostId(data.data[0]._id); // Assuming there's only one post with this contentId
              setPostUserId(data.data[0].user); // Set the post user ID
            }
          })
          .catch((error) => console.error("Error fetching data:", error));
      }
    }
  }, [fetchUrl, session]);

  const handleDelete = async () => {
    if (postId) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          router.back(); // Redirect back to where the user was before
        } else {
          console.error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  if (status === "loading" || !session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start relative min-h-screen bg-black text-white">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-3xl bg-black text-white rounded-full p-2"
      >
        ×
      </button>
      {contentData && children(contentData)}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-xl"
        >
          ⋮
        </button>
        {menuOpen && (
          <div className="relative">
            <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded-md shadow-lg py-2">
              <a href="#" className="block px-4 py-2">
                Source
              </a>
              <a href="#" className="block px-4 py-2">
                Copy Link
              </a>
              <a href="#" className="block px-4 py-2">
                Disconnect
              </a>
              <a href="#" className="block px-4 py-2 text-red-500">
                Report
              </a>
              {session?.user?.id === postUserId && ( // Conditional rendering of the delete button
                <button
                  onClick={handleDelete}
                  className="block px-4 py-2 text-red-500"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
