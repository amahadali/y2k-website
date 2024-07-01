// src/components/LibraryFeed.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Library {
  _id: string;
  name: string;
  description: string;
}

const LibraryFeed: React.FC = () => {
  const { data: session } = useSession();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch("/api/libraries");
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

    if (session) {
      fetchLibraries();
    }
  }, [session]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!libraries.length) return <p>No libraries available</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {libraries.map((library) => (
        <Link key={library._id} href={`/libraries/${library._id}`}>
          <div className="relative group overflow-hidden rounded-lg shadow-lg cursor-pointer">
            <div className="bg-gray-700 h-48 flex items-center justify-center">
              <span className="text-white text-2xl">{library.name}</span>
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white">{library.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LibraryFeed;
