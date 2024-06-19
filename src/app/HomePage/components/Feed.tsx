import React, { useEffect, useState } from "react";

interface Post {
  _id: string;
  title: string;
  imageUrl: string;
  postType: string;
  content: {
    artistName?: string;
    developerName?: string;
    mp3Url?: string;
  };
  datePosted: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();

        if (data.success) {
          setPosts(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4">{error}</p>;

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-gray-800 rounded-lg p-4 flex flex-col"
        >
          <div className="h-48 bg-gray-700 rounded-md mb-4 relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover rounded-md"
            />
            {post.postType === "ringtone" && post.content.mp3Url && (
              <button
                onClick={() => new Audio(post.content.mp3Url).play()}
                className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
              >
                ▶️
              </button>
            )}
          </div>
          <h3 className="text-xl mb-2">{post.title}</h3>
          <p className="text-gray-400 capitalize">{post.postType}</p>
          {post.postType === "song" && post.content.artistName && (
            <p className="text-gray-400">{post.content.artistName}</p>
          )}
          {post.postType === "game" && post.content.developerName && (
            <p className="text-gray-400">{post.content.developerName}</p>
          )}
        </div>
      ))}
    </main>
  );
};

export default Feed;
