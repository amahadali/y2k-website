"use client";

import React from "react";
import PostDetails from "../../components/PostDetails";

interface Wallpaper {
  _id: string;
  title: string;
  imageUrl: string;
}

const WallpaperPost: React.FC = () => {
  return (
    <PostDetails
      fetchUrl="/api/postDetails/wallpapers/{id}"
      redirectUrl="/posts/wallpapers"
    >
      {(data: Wallpaper) => (
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
          </div>
        </>
      )}
    </PostDetails>
  );
};

export default WallpaperPost;
