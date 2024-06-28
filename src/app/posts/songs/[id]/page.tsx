"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

interface Song {
  _id: string;
  title: string;
  artistName: string;
  mp3Url: string;
  imageUrl: string;
}

const SongPost = () => {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [song, setSong] = useState<Song | null>(null);
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const newId = pathParts[pathParts.length - 1];
    setId(newId);
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`/api/postDetails/songs/${id}`)
        .then((response) => response.json())
        .then((data) => setSong(data));
    }
  }, [id]);

  if (!song) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start relative min-h-screen bg-black text-white">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-3xl bg-black text-white rounded-full p-2"
      >
        ×
      </button>
      <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
        <img
          src={song.imageUrl}
          alt={song.title}
          className="object-cover rounded-md shadow-md max-h-screen"
        />
      </div>
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
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
                {session?.user && (
                  <button
                    onClick={() => {
                      fetch(`/api/postDetails/songs/${id}`, {
                        method: "DELETE",
                      }).then(() => router.push("/posts/songs"));
                    }}
                    className="block px-4 py-2 text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold mb-4">{song.title}</h1>
        <p className="text-xl">Artist: {song.artistName}</p>
        <audio controls ref={audioRef} className="mt-4 w-full">
          <source src={song.mp3Url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default SongPost;
