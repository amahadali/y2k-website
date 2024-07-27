"use client";

import React, { useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LibraryPopup from "./LibraryPopup"; // Ensure this path is correct

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
  const { data: session } = useSession();
  const [contentData, setContentData] = useState<any | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [postUserId, setPostUserId] = useState<string | null>(null); // State to store post user ID
  const [menuOpen, setMenuOpen] = useState(false);
  const [libraryPopupOpen, setLibraryPopupOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const newContentId = pathParts[pathParts.length - 1];
    if (newContentId) {
      fetch(fetchUrl.replace("{id}", newContentId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: newContentId }), // Send id in the body
      })
        .then((response) => response.json())
        .then((data) => {
          setContentData(data);
          return fetch("/api/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contentId: newContentId }),
          });
        })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.data.length > 0) {
            setPostId(data.data[0]._id); // Assuming there's only one post with this contentId
            setPostUserId(data.data[0].user._id); // Set the post user ID
          }
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [fetchUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close the menu if clicking outside of the menu and button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    // Attach event listener if menu is open
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy link:", error);
      });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleImageDownload = () => {
    if (contentData?.imageUrl) {
      const link = document.createElement("a");
      link.href = contentData.imageUrl;
      link.download = "downloaded-image.jpg"; // Ensure this is the correct file type
      document.body.appendChild(link); // Append to the body to make it clickable
      link.click();
      document.body.removeChild(link); // Remove from the body after clicking
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white relative">
      {/* "x" Button for Navigation */}
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-3xl bg-gray-800 text-white rounded-full p-3 hover:bg-gray-700 transition-colors"
      >
        ×
      </button>

      {/* Card Container */}
      <div className="relative w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-lg flex flex-col max-h-[calc(100vh-6rem)] overflow-hidden">
        {contentData ? (
          <div className="flex flex-col h-full">
            {/* Image */}
            {contentData?.imageUrl && (
              <div className="relative mb-4 flex-shrink-0">
                <img
                  src={contentData.imageUrl}
                  alt="Content Image"
                  className="w-full h-auto max-h-[50vh] object-contain rounded-lg"
                />
              </div>
            )}
            {/* Content */}
            <div className="text-lg space-y-4 flex-grow">
              <h2 className="text-3xl font-semibold">{contentData?.title}</h2>
              {contentData?.artistName && (
                <p className="text-xl text-gray-300">
                  Artist: {contentData.artistName}
                </p>
              )}
              {contentData?.developerName && (
                <p className="text-xl text-gray-300">
                  Developer: {contentData.developerName}
                </p>
              )}
              <p className="text-base text-gray-200">
                {contentData?.description}
              </p>
            </div>
            {/* Audio Player and Download Button Wrapper */}
            <div className="mt-auto flex flex-col items-center mb-4">
              {contentData?.mp3Url && (
                <audio controls className="w-full bg-gray-700 rounded-lg">
                  <source src={contentData.mp3Url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {contentData?.imageUrl && (
                <button
                  onClick={handleImageDownload}
                  className="bg-gray-700 text-white p-2 rounded-md hover:bg-gray-600 transition-colors mt-4"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="text-white text-xl bg-gray-800 p-2 rounded hover:bg-gray-700 transition-colors"
        >
          ⋮
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-12 right-0 w-48 bg-gray-800 text-white rounded-md shadow-lg py-2"
          >
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-700"
              onClick={handleCopyLink}
            >
              Copy Link
            </a>
            <button
              onClick={() => setLibraryPopupOpen(true)}
              className="block w-full px-4 py-2 text-left hover:bg-gray-700"
            >
              Add to Library
            </button>
            <a
              href="#"
              className="block px-4 py-2 hover:bg-gray-700 text-red-500"
            >
              Report
            </a>
            {session?.user?.id === postUserId && (
              <button
                onClick={handleDelete}
                className="block w-full px-4 py-2 text-left hover:bg-gray-700 text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Library Popup */}
      {libraryPopupOpen && (
        <LibraryPopup
          closeLibraryPopup={() => setLibraryPopupOpen(false)}
          postId={postId as string}
        />
      )}
    </div>
  );
};

export default PostDetails;
