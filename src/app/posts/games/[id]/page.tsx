"use client";

import React from "react";
import PostDetails from "../../components/PostDetails"; // Import the PostDetails component

interface Game {
  _id: string;
  title: string;
  developerName: string;
  imageUrl: string;
}

const GamePost: React.FC = () => {
  return (
    <PostDetails
      fetchUrl="/api/postDetails/games/{id}" // URL template to fetch game details, with placeholder for ID
      redirectUrl="/posts/games" // URL to redirect to after certain actions
    >
      {(data: Game) => (
        <>
          {/* Image section */}
          <div className="w-full md:w-1/2 p-4 flex justify-center items-center">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="object-cover rounded-md shadow-md max-h-screen"
            />
          </div>
          {/* Content section */}
          <div className="w-full md:w-1/2 p-4 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
            <p className="text-xl">Developer: {data.developerName}</p>
          </div>
        </>
      )}
    </PostDetails>
  );
};

export default GamePost;
