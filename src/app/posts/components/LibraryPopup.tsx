import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Library {
  _id: string;
  name: string;
  description: string;
}

interface LibraryPopupProps {
  closeLibraryPopup: () => void;
  postId: string;
}

const LibraryPopup: React.FC<LibraryPopupProps> = ({
  closeLibraryPopup,
  postId,
}) => {
  const { data: session } = useSession();
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibraries = async () => {
      try {
        const response = await fetch(`/api/libraries`);
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

    fetchLibraries();
  }, []);

  const handleAddToLibrary = async (libraryId: string) => {
    try {
      const response = await fetch(`/api/libraries/${libraryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add post to library");
      }

      closeLibraryPopup();
    } catch (error) {
      console.error("Error adding post to library:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Select Library</h2>
        <ul>
          {libraries.map((library) => (
            <li key={library._id} className="mb-2">
              <button
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                onClick={() => handleAddToLibrary(library._id)}
              >
                {library.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={closeLibraryPopup}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LibraryPopup;
