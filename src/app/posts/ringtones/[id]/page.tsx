"use client";

import React, { useRef } from "react";
import PostDetails from "../../components/PostDetails";

interface Ringtone {
  _id: string;
  title: string;
  mp3Url: string;
  imageUrl: string;
}

const RingtonePost: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <PostDetails
      fetchUrl="/api/postDetails/ringtones/{id}"
      redirectUrl="/posts/ringtones"
    >
      {(data: Ringtone) => (
        <>
          <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="object-cover rounded-md shadow-md max-h-screen"
            />
          </div>
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
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

export default RingtonePost;
