"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Define the Library interface for TypeScript
interface Library {
  _id: string;
  name: string;
  description: string;
  thumbnails: string[];
}

// Define the LibraryFeedProps interface for component props
interface LibraryFeedProps {
  username: string;
}

// LibraryFeed component definition
const LibraryFeed: React.FC<LibraryFeedProps> = ({ username }) => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch libraries from the API
    const fetchLibraries = async () => {
      try {
        const response = await fetch("/api/libraries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (data.success) {
          setLibraries(data.data); // Update state with fetched libraries
        } else {
          setError(data.message); // Set error message if API call fails
        }
      } catch (error) {
        setError("Failed to fetch libraries"); // Set a generic error message
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    if (username) {
      fetchLibraries(); // Fetch libraries if username is provided
    }
  }, [username]);

  // Conditional rendering based on loading state, error, or absence of libraries
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!libraries.length) return <p>No libraries available</p>;

  return (
    <div className="p-4 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {libraries.map((library) => (
          <Link
            key={library._id}
            href={`/profile/${username}/libraries/${library._id}`}
          >
            <div className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                {library.thumbnails.slice(0, 4).map((thumbnail, index) => (
                  <img
                    key={index}
                    src={thumbnail}
                    alt={library.name}
                    className="w-full h-full object-cover"
                  />
                ))}
                {!library.thumbnails.length && (
                  <span className="text-white text-2xl">{library.name}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white">{library.name}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LibraryFeed;
