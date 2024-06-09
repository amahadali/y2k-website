import React, { useEffect, useState } from "react";

interface Item {
  _id: string;
  type: string;
  name: string;
  artistName?: string;
  developerName?: string;
  ringtone?: string;
  imageUrl: string;
  createdAt: string;
}

const Feed = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items/fetch");
        const data = await response.json();

        if (data.success) {
          setItems(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4">{error}</p>;

  return (
    <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-gray-800 rounded-lg p-4 flex flex-col"
        >
          <div className="h-48 bg-gray-700 rounded-md mb-4 relative">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover rounded-md"
            />
            {item.ringtone && (
              <button
                onClick={() => new Audio(item.ringtone).play()}
                className="absolute bottom-2 right-2 bg-gray-900 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
              >
                ▶️
              </button>
            )}
          </div>
          <h3 className="text-xl mb-2">{item.name}</h3>
          <p className="text-gray-400">{item.type}</p>
          {item.artistName && (
            <p className="text-gray-400">{item.artistName}</p>
          )}
          {item.developerName && (
            <p className="text-gray-400">{item.developerName}</p>
          )}
        </div>
      ))}
    </main>
  );
};

export default Feed;
