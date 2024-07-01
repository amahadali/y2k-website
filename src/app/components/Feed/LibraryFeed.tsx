"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Library {
  _id: string;
  name: string;
  description: string;
  thumbnails: string[]; // Updated to use the thumbnails array
}

interface LibraryFeedProps {
  username: string;
}

const LibraryFeed: React.FC<LibraryFeedProps> = ({ username }) => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch(`/api/libraries?username=${username}`);
        const data = await response.json();
        if (data.success) {
          setLibraries(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch libraries");
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchLibraries();
    }
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!libraries.length) return <p>No libraries available</p>;

  return (
    <div className="p-4 mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {libraries.map((library) => (
          <Link key={library._id} href={`/libraries/${library._id}`}>
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
                <p className="text-white">{library.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LibraryFeed;
