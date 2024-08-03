"use client";

import React, { useRef } from "react";
import PostDetails from "../../components/PostDetails"; // Import the PostDetails component

interface Song {
  _id: string;
  title: string;
  artistName: string;
  mp3Url: string;
  imageUrl: string;
}

const SongPost: React.FC = () => {
  // Create a ref to control the audio element
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <PostDetails
      fetchUrl="/api/postDetails/songs/{id}" // URL template to fetch song details, with placeholder for ID
      redirectUrl="/posts/songs" // URL to redirect to after certain actions
    >
      {(data: Song) => (
        <>
          {/* Image section */}
          <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="object-cover rounded-md shadow-md max-h-screen"
            />
          </div>
          {/* Content section with song details and audio player */}
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-xl">Artist: {data.artistName}</p>
            <audio controls ref={audioRef} className="mt-4 w-full">
              <source src={data.mp3Url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </>
      )}
    </PostDetails>
  );
};

export default SongPost;
