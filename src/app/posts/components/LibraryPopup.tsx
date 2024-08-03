"use client"; // Indicate that this component is a client-side React component

import React, { useEffect, useState } from "react"; // Import necessary hooks and types from React
import { useSession } from "next-auth/react"; // Import useSession hook for authentication session management

// Define TypeScript interfaces for Library and component props
interface Library {
  _id: string;
  name: string;
  description: string;
}

interface LibraryPopupProps {
  closeLibraryPopup: () => void; // Function to close the popup
  postId: string; // ID of the post to be added to a library
}

// LibraryPopup functional component
const LibraryPopup: React.FC<LibraryPopupProps> = ({
  closeLibraryPopup,
  postId,
}) => {
  // Get the current session data from useSession hook
  const { data: session } = useSession();

  // State variables to manage libraries, loading state, and error messages
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect to fetch libraries when the component mounts or session username changes
  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        // Fetch libraries from the API
        const response = await fetch("/api/libraries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: session?.user.username }), // Send the username in the request body
        });

        // Parse the response
        const data = await response.json();

        // Update state based on API response
        if (data.success) {
          setLibraries(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        // Handle fetch errors
        setError("Failed to fetch libraries");
      } finally {
        // Update loading state after fetch attempt
        setLoading(false);
      }
    };

    fetchLibraries(); // Call the function to fetch libraries
  }, [session?.user.username]); // Dependency array to re-fetch if the username changes

  // Function to handle adding a post to a library
  const handleAddToLibrary = async (libraryId: string) => {
    try {
      // Send request to add post to the specified library
      const response = await fetch(`/api/libraries/${libraryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, action: "add" }), // Send post ID and action in the request body
      });

      // Throw an error if the response is not OK
      if (!response.ok) {
        throw new Error("Failed to add post to library");
      }

      // Close the popup on successful addition
      closeLibraryPopup();
    } catch (error) {
      // Log errors to the console
      console.error("Error adding post to library:", error);
    }
  };

  // Render loading or error messages if applicable
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Render the popup with a list of libraries and a close button
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Select Library</h2>
        <ul>
          {/* Map through libraries to create a list of buttons */}
          {libraries.map((library) => (
            <li key={library._id} className="mb-2">
              <button
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                onClick={() => handleAddToLibrary(library._id)} // Handle button click
              >
                {library.name} {/* Display library name */}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={closeLibraryPopup} // Close the popup on button click
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryPopup;
