import React, { useState } from "react";
import { useSession } from "next-auth/react";
import CategorySelect from "./ElementPopup/CategorySelect";
import FileUpload from "./ElementPopup/FileUpload";
import ImageUpload from "./ElementPopup/ImageUpload";
import TextInput from "./ElementPopup/TextInput";

interface ElementPopupProps {
  closeElementPopup: () => void;
  category: string;
  setCategory: (category: string) => void;
}

const ElementPopup: React.FC<ElementPopupProps> = ({
  closeElementPopup,
  category,
  setCategory,
}) => {
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: session } = useSession();

  // Handles file input changes
  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setter(e.target.files[0]);
      }
    };

  // Uploads the content based on the selected category
  const handleUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("postType", category);
    formData.append("imageFile", imageFile);

    if ((category === "song" || category === "ringtone") && file) {
      formData.append("file", file);
    }

    if (category === "song") {
      formData.append("artistName", artistName);
    } else if (category === "game") {
      formData.append("developerName", developerName);
    }

    try {
      const response = await fetch("/api/upload/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload content");
      }

      const responseData = await response.json();
      console.log("Content uploaded successfully:", responseData.message);
      closeElementPopup(); // Close the popup on success
    } catch (error) {
      console.error("Error uploading content:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Create Element</h2>
        {/* Category selection */}
        <CategorySelect category={category} setCategory={setCategory} />
        {category && (
          <TextInput
            label="Name"
            placeholder={`Enter ${category} name...`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}
        {category === "song" && (
          <>
            <TextInput
              label="Artist Name"
              placeholder="Enter artist name..."
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
            />
            <FileUpload
              label="Upload MP3"
              onFileChange={handleFileChange(setFile)}
            />
            <ImageUpload onImageChange={handleFileChange(setImageFile)} />
          </>
        )}
        {category === "ringtone" && (
          <>
            <FileUpload
              label="Upload Ringtone"
              onFileChange={handleFileChange(setFile)}
            />
            <ImageUpload onImageChange={handleFileChange(setImageFile)} />
          </>
        )}
        {category === "wallpaper" && (
          <ImageUpload onImageChange={handleFileChange(setImageFile)} />
        )}
        {category === "game" && (
          <>
            <TextInput
              label="Developer Name"
              placeholder="Enter developer name..."
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
            />
            <ImageUpload onImageChange={handleFileChange(setImageFile)} />
          </>
        )}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            onClick={closeElementPopup}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 ml-2"
            onClick={handleUpload}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementPopup;
